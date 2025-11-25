import React from 'react';
import { motion } from 'framer-motion';

/**
 * HeroLogo Component
 * A large, atmospheric rendering of the brand logo for the Hero background.
 * Acts as the "Shield" or "Core" that particles bounce off.
 */
const HeroLogo: React.FC = () => {
  return (
    // Changed position from top-1/2 to top-[38%] to create the Pyramid Layout
    <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full max-w-4xl pointer-events-none select-none flex items-center justify-center">
      
      {/* 1. Background Glow (Behind Logo) */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-brand-orange/10 blur-[80px] rounded-full mix-blend-screen"
      />

      {/* 2. The Logo Itself (The Solid Barrier) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ 
          opacity: 1, // Full opacity for sharpness
          scale: 1,
          y: 0
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut"
        }}
        className="relative w-72 h-72 md:w-[500px] md:h-[500px] z-10"
      >
        <img 
          src="/assets/images/logo.png" 
          alt="FitFoundry Emblem" 
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
             // Enhanced visuals: slightly warmer and sharper
             filter: 'contrast(1.1) brightness(1.1) drop-shadow(0 25px 50px rgba(0,0,0,0.7))'
          }}
        />
      </motion.div>

      {/* 3. Subtle Heat Haze (In front of logo, but very subtle) */}
      <motion.div 
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[340px] h-[340px] md:w-[560px] md:h-[560px] bg-gradient-to-t from-brand-orange/20 to-transparent rounded-full blur-xl mix-blend-overlay z-20"
      />
    </div>
  );
};

export default HeroLogo;