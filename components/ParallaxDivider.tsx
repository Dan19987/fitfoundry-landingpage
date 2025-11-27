import React from 'react';
import { motion } from 'framer-motion';

const ParallaxDivider: React.FC = () => {
  return (
    <section className="relative h-[500px] w-full overflow-hidden flex items-center justify-center">
      {/* Fixed Background Image for Parallax Effect */}
      <div 
        className="absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat"
        style={{ 
          backgroundImage: `url('/assets/images/ironwill.webp')`,
          
          // ⚡ Safari Performance: will-change
          willChange: 'transform'
        }}
      />
      
      {/* Dark Gradient Overlay to blend with site */}
      <div className="absolute inset-0 bg-brand-dark/60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-brand-gold tracking-tighter uppercase drop-shadow-2xl">
            Forge Your Legacy
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxDivider;
