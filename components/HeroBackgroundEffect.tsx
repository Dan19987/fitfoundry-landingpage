// HeroBackgroundEffect.tsx - PERFORMANCE OPTIMIERT

import React, { useEffect, useRef, useState } from 'react';

const HeroBackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true // ⚡ Performance-Boost: Async rendering
    });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    let barrierRadius = 260; 
    let centerX = canvas.width / 2;
    let centerY = canvas.height * 0.33;

    const colors = ['#ED553B', '#FF6B35', '#FFD700', '#FFFFFF'];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      vx: number;
      vy: number;
      color: string;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 100;
        this.size = Math.random() * 3 + 0.5;
        
        this.speedY = Math.random() * 1.5 + 0.5; 
        this.speedX = (Math.random() - 0.5) * 0.5; 
        
        this.vx = this.speedX;
        this.vy = -this.speedY;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.5;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        this.vx = this.vx * 0.95 + this.speedX * 0.05;
        this.vy = this.vy * 0.95 + (-this.speedY) * 0.05;

        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < barrierRadius) {
          const angle = Math.atan2(dy, dx);
          
          const targetX = centerX + Math.cos(angle) * barrierRadius;
          const targetY = centerY + Math.sin(angle) * barrierRadius;
          
          this.x = targetX;
          this.y = targetY;

          this.vx += Math.cos(angle) * 1.5;
          this.vy += Math.sin(angle) * 1.5;
        }

        this.opacity -= this.fadeSpeed;

        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
        }
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = canvas!.height + Math.random() * 50;
        this.size = Math.random() * 3 + 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        
        this.vx = this.speedX;
        this.vy = -this.speedY;
        
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }
    }

    const init = () => {
      particles = [];
      // ⚡ Reduzierte Particle-Count für Mobile Performance
      const isMobile = window.innerWidth < 768;
      const particleCount = Math.min(
        isMobile ? 80 : 150, 
        200
      );
      
      for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas!.height;
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        if (Math.sqrt(dx*dx + dy*dy) < barrierRadius) {
           p.y = canvas!.height + 100;
        }
        particles.push(p);
      }
    };

    const animate = () => {
      // ⚡ Stop animation wenn Component nicht sichtbar
      if (!ctx || !canvas || !isVisible) return;
      
      ctx.fillStyle = '#1a0f0e';
      ctx.globalAlpha = 0.85;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1.0;

      ctx.shadowBlur = 0;

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerX = canvas.width / 2;
      centerY = canvas.height * 0.33;
      barrierRadius = window.innerWidth < 768 ? 140 : 260;
      init();
    };

    // ⚡ Intersection Observer - pausiert Animation außerhalb viewport
    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    }, { threshold: 0.1 });

    observer.observe(canvas);

    // Initial fill
    if (ctx) {
      ctx.fillStyle = '#1a0f0e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ 
        backgroundColor: '#1a0f0e',
        transform: 'translateZ(0)',
        willChange: 'transform' // ⚡ GPU-Beschleunigung
      }}
    />
  );
};

export default HeroBackgroundEffect;
