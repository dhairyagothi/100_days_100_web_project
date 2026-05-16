document.addEventListener('click', function(e) {    
    for (let i = 0; i < 50; i++) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    // 1. create a div element
    const particle = document.createElement('div');

    // 2. style it (position, size, color, border-radius)
    const size = Math.random() * 5 + 5; // Random size between 5px and 15px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`; 
    particle.style.borderRadius = '100%';
    particle.style.position = 'absolute';
    particle.style.pointerEvents = 'none'; // So you don't accidentally click the particles

    // Position it at the click coordinates
    particle.style.left = `${x - size/2}px`;
    particle.style.top = `${y - size/2}px`;

    // 3. append it to body
    document.body.appendChild(particle);

    // 4. animate it moving outward and fading
    // Generate random movement values
    const destinationX = (Math.random() - 0.5) * 500; // Move left or right up to 150px
    const destinationY = (Math.random() - 0.5) * 400; // Move up or down up to 150px

    const animation = particle.animate([
        { transform: 'translate(0, 0)', opacity: 1 }, // Start position
        { transform: `translate(${destinationX}px, ${destinationY}px)`, opacity: 0 } // End position
    ], {
        duration: 1500, // 1 second
        easing: 'ease-out'
    });

    // 5. remove it after animation ends
    animation.onfinish = () => {
        particle.remove();
    };
}