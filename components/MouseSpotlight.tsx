import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * MouseSpotlight Component
 * Creates a glowing orb that follows the user's cursor.
 * Adds a "torch in a dark foundry" atmosphere.
 */
const MouseSpotlight: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for the spotlight movement (lag effect)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 25 });

  useEffect(() => {
    // Initialize off-screen to prevent flash
    mouseX.set(-1000);
    mouseY.set(-1000);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full mix-blend-screen opacity-20"
        style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            background: 'radial-gradient(circle, rgba(237,85,59,0.4) 0%, rgba(255,215,0,0.1) 40%, transparent 70%)'
        }}
      />
    </div>
  );
};

export default MouseSpotlight;