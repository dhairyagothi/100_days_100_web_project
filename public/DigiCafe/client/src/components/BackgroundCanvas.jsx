import { useEffect, useRef } from 'react'

export default function BackgroundCanvas() {
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Increased particle count - responsive based on screen size
    const particleCount = Math.max(80, Math.min(200, window.innerWidth / 5))
    const particles = []

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = `particle ${Math.random() > 0.85 ? 'large' : ''}`
      
      const randomX = Math.random() * 100
      const randomY = Math.random() * 100
      const randomDelay = Math.random() * 20

      particle.style.left = `${randomX}%`
      particle.style.top = `${randomY}%`
      particle.style.animationDelay = `${randomDelay}s`
      particle.style.animationDuration = `${15 + Math.random() * 10}s`

      // Store particle data
      const particleData = {
        element: particle,
        x: randomX,
        y: randomY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        originalX: randomX,
        originalY: randomY,
      }

      container.appendChild(particle)
      particles.push(particleData)
    }

    particlesRef.current = particles

    // Mouse move tracking
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    // Mouse leave - particles return to normal
    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 }
    }

    // Animation frame for particle movement
    let animationId
    const animate = () => {
      const containerRect = container.getBoundingClientRect()
      const mouse = mouseRef.current

      particles.forEach((particleData) => {
        // Calculate absolute pixel position
        const particlePixelX = (particleData.x / 100) * containerRect.width + containerRect.left
        const particlePixelY = (particleData.y / 100) * containerRect.height + containerRect.top
        
        // Calculate distance from mouse
        const dx = particlePixelX - mouse.x
        const dy = particlePixelY - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 150 // Radius of effect

        // Repel away from mouse with smooth easing
        if (distance < repelRadius && distance > 0) {
          const angle = Math.atan2(dy, dx)
          // Smooth force calculation using easing
          const force = Math.pow((repelRadius - distance) / repelRadius, 2)
          particleData.vx += Math.cos(angle) * force * 1.5
          particleData.vy += Math.sin(angle) * force * 1.5
        } else {
          // Smooth return to original position
          const returnForce = 0.0008
          particleData.vx += (particleData.originalX - particleData.x) * returnForce
          particleData.vy += (particleData.originalY - particleData.y) * returnForce
          
          // Smooth friction - less aggressive
          particleData.vx *= 0.98
          particleData.vy *= 0.98
        }

        // Limit max velocity for smooth movement
        const maxVelocity = 0.15
        const velocity = Math.sqrt(particleData.vx ** 2 + particleData.vy ** 2)
        if (velocity > maxVelocity) {
          particleData.vx = (particleData.vx / velocity) * maxVelocity
          particleData.vy = (particleData.vy / velocity) * maxVelocity
        }

        // Update position with smoothing
        particleData.x += particleData.vx
        particleData.y += particleData.vy

        // Boundary check - wrap around
        if (particleData.x > 100) particleData.x = 0
        if (particleData.x < 0) particleData.x = 100
        if (particleData.y > 100) particleData.y = 0
        if (particleData.y < 0) particleData.y = 100

        // Apply position with transform for smoother rendering
        const element = particleData.element
        element.style.left = `${particleData.x}%`
        element.style.top = `${particleData.y}%`
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Handle responsive particle count on resize
    const handleResize = () => {
      const newCount = Math.max(80, Math.min(200, window.innerWidth / 5))
      const currentCount = container.children.length

      if (newCount > currentCount) {
        // Add more particles
        for (let i = currentCount; i < newCount; i++) {
          const particle = document.createElement('div')
          particle.className = `particle ${Math.random() > 0.85 ? 'large' : ''}`
          
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          const randomDelay = Math.random() * 20

          particle.style.left = `${randomX}%`
          particle.style.top = `${randomY}%`
          particle.style.animationDelay = `${randomDelay}s`
          particle.style.animationDuration = `${15 + Math.random() * 10}s`

          const particleData = {
            element: particle,
            x: randomX,
            y: randomY,
            vx: 0,
            vy: 0,
            originalX: randomX,
            originalY: randomY,
          }

          container.appendChild(particle)
          particlesRef.current.push(particleData)
        }
      } else if (newCount < currentCount) {
        // Remove excess particles
        for (let i = currentCount - 1; i >= newCount; i--) {
          const particleData = particlesRef.current[i]
          if (particleData) {
            particleData.element.remove()
            particlesRef.current.pop()
          }
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container.parentElement)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      resizeObserver.disconnect()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
      particles.forEach(p => p.element.remove())
    }
  }, [])

  return <div ref={containerRef} className="background-canvas" />
}
