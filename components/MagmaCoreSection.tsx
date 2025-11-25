import React, { useEffect, useRef } from 'react';

/**
 * MagmaCoreSection
 * A procedural visual effect simulating breaking crust over flowing magma.
 * Uses HTML5 Canvas for performance.
 */
const MagmaCoreSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    
    // Grid settings for the crust plates
    const cellSize = 60;
    let cols = 0;
    let rows = 0;
    let grid: { x: number; y: number; xOrg: number; yOrg: number }[][] = [];

    const initGrid = () => {
      // Calculate enough columns to cover width + padding
      cols = Math.ceil(canvas.width / cellSize) + 2;
      rows = Math.ceil(canvas.height / cellSize) + 2;
      grid = [];

      for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
          // Add randomness to vertices to create irregular rock shapes
          const offsetX = (Math.random() - 0.5) * (cellSize * 0.7);
          const offsetY = (Math.random() - 0.5) * (cellSize * 0.7);
          // Base position adjusted to center grid
          const px = (x - 1) * cellSize + offsetX;
          const py = (y - 1) * cellSize + offsetY;
          row.push({ x: px, y: py, xOrg: px, yOrg: py });
        }
        grid.push(row);
      }
    };

    const draw = () => {
      if (!ctx) return;
      time += 0.05;

      // 1. Draw Magma Background
      // Create a pulsing gradient effect representing the heat below
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const pulse = Math.sin(time * 0.5) * 0.1; // Slow heat pulse
      
      // Magma Color Palette
      gradient.addColorStop(0, '#500000'); // Deep dark red
      gradient.addColorStop(0.4 + pulse, '#cf1020'); // Bright Red
      gradient.addColorStop(0.7 - pulse, '#ff4500'); // Orange
      gradient.addColorStop(1, '#ff8c00'); // Gold/Orange

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 2. Draw Rock Plates (Crust)
      ctx.fillStyle = '#0D1117'; // Brand Dark background color
      ctx.strokeStyle = '#252b36'; // Slightly lighter for rock edges
      ctx.lineWidth = 1;

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          // Get the four points of the cell (quad)
          const p1 = grid[y][x];
          const p2 = grid[y][x + 1];
          const p3 = grid[y + 1][x + 1];
          const p4 = grid[y + 1][x];

          // Calculate center of the quad
          const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
          const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;

          // Calculate distance from center of screen for wave effect
          const dist = Math.sqrt((centerX - canvas.width/2)**2 + (centerY - canvas.height/2)**2);
          
          // "Breathing" cracks: The shrink factor oscillates
          const wave = Math.sin(dist * 0.01 - time) * 0.05;
          const shrink = 0.85 + wave; // 0.8 to 0.9 scale factor

          ctx.beginPath();
          
          // Draw shrunk quad (moves vertices towards center)
          ctx.moveTo(centerX + (p1.x - centerX) * shrink, centerY + (p1.y - centerY) * shrink);
          ctx.lineTo(centerX + (p2.x - centerX) * shrink, centerY + (p2.y - centerY) * shrink);
          ctx.lineTo(centerX + (p3.x - centerX) * shrink, centerY + (p3.y - centerY) * shrink);
          ctx.lineTo(centerX + (p4.x - centerX) * shrink, centerY + (p4.y - centerY) * shrink);
          
          ctx.closePath();
          ctx.fill();
          // Optional: slight stroke to define edges
          // ctx.stroke(); 
        }
      }
      
      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      // Set canvas resolution to match display size
      canvas.width = window.innerWidth;
      canvas.height = 600; // Fixed height for this section
      initGrid();
    };

    // Initial setup
    handleResize();
    const animId = requestAnimationFrame(draw);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    }
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden flex items-center justify-center bg-brand-dark">
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 w-full h-full" 
        />
        
        {/* Text Content Overlay */}
        <div className="relative z-10 text-center max-w-4xl px-4 pointer-events-none select-none mix-blend-hard-light">
            <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl tracking-tighter uppercase mb-4 opacity-90">
                The Foundry
            </h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6 rounded-full shadow-[0_0_10px_white]"></div>
            <p className="text-xl md:text-3xl text-white font-bold tracking-[0.5em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Built for Performance
            </p>
        </div>
        
        {/* Overlay Vignette to blend edges into the rest of the site */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-transparent to-brand-dark z-0 pointer-events-none opacity-50" />
    </section>
  );
};

export default MagmaCoreSection;