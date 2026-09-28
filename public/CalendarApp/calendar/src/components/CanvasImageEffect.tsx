import React, { useEffect, useRef } from 'react';

export const CanvasImageEffect: React.FC<{
  imageSrc: string;
  className?: string;
}> = ({ imageSrc, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
   
    img.src = imageSrc;

    const render = () => {
      if (!canvas || !ctx || !img.complete) return;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      const { width, height } = canvas;
      
      const imageAspect = img.width / img.height;
      const canvasAspect = width / height;
      let drawWidth = width;
      let drawHeight = height;
      let drawX = 0;
      let drawY = 0;

      let coverWidth = width;
      let coverHeight = height;
      if (canvasAspect > imageAspect) {
        coverHeight = width / imageAspect;
      } else {
        coverWidth = height * imageAspect;
      }

      const zoomFactor = 2; 
      
      if (canvasAspect > imageAspect) {
        drawHeight = height * zoomFactor;
        drawWidth = (height * imageAspect) * zoomFactor;
        drawX = (width - drawWidth) / 2;
        drawY = (height - drawHeight) / 2;
      } else {
        drawWidth = width * zoomFactor;
        drawHeight = (width / imageAspect) * zoomFactor;
        drawX = (width - drawWidth) / 2;
        drawY = (height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, width, height);

      const offsetX = (mouseRef.current.x - width / 2) * 0.05;
      const offsetY = (mouseRef.current.y - height / 2) * 0.05;

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(1.05, 1.05);

      // Draw blurred background to fill empty space
      ctx.save();
      ctx.filter = 'blur(25px) opacity(0.8)';
      ctx.drawImage(img, (width - coverWidth)/2, (height - coverHeight)/2, coverWidth, coverHeight);
      ctx.restore();
      
      // Draw actual uncropped image in center
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {

          const noise = (Math.random() - 0.5) * 10;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);
      } catch (e) {
        
      }
      
      ctx.restore();

      const gradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(render);
    };

    img.onload = () => {
      const resize = () => {
        if (canvas.parentElement) {
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        }
      };
      window.addEventListener('resize', resize);
      resize();
      
      animationRef.current = requestAnimationFrame(render);

      return () => window.removeEventListener('resize', resize);
    };

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [imageSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    }
  };

  const handleMouseLeave = () => {
    if (canvasRef.current) {
      mouseRef.current.targetX = canvasRef.current.width / 2;
      mouseRef.current.targetY = canvasRef.current.height / 2;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ display: 'block' }}
    />
  );
};