import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Cpu } from 'lucide-react';

interface FlipCardProps {
  src: string;
  title: string;
  subtitle: string;
  techTitle: string;
  techDesc: string;
  index: number;
}

const FlipCard: React.FC<FlipCardProps> = ({ src, title, subtitle, techTitle, techDesc, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ⚡ Safari Detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  return (
    <div className="w-full h-[450px] perspective-1000 cursor-pointer" onClick={handleFlip}>
       <motion.div
        // ⚡ Safari: Keine whileInView Animation (verursacht Flicker)
        initial={{ opacity: isSafari ? 1 : 0, y: isSafari ? 0 : 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: isSafari ? 0 : index * 0.2 }}
        className="relative w-full h-full transition-all duration-500"
        style={{
          transformStyle: "preserve-3d"
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        onAnimationComplete={() => setIsAnimating(false)}
       >
          {/* ============ FRONT SIDE ============ */}
          <div 
            className="absolute inset-0 w-full h-full bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-2xl backface-hidden group"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              zIndex: isFlipped ? 1 : 2
            }}
          >
             {/* Background Image - ⚡ Safari: Kein Scale (Border-Radius Flicker) */}
             <div 
               className={`absolute inset-0 bg-cover bg-center ${!isSafari ? 'transition-transform duration-700 group-hover:scale-110' : ''}`}
               style={{ backgroundImage: `url(${src})` }}
             />
             <div className="absolute inset-0 bg-brand-orange/20 mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />

             {/* Content */}
             <div className="absolute bottom-0 left-0 p-8 w-full z-20 transform translate-z-10">
               <div className="flex items-center gap-2 text-brand-orange font-bold text-sm tracking-wider uppercase mb-2">
                 <span className="w-8 h-[2px] bg-brand-orange"></span>
                 {subtitle}
               </div>
               <h3 className="text-3xl font-black text-white mb-4 leading-tight group-hover:text-brand-gold transition-colors">
                 {title}
               </h3>
               <div className="inline-flex items-center gap-2 text-white font-medium group-hover:translate-x-2 transition-transform">
                 Tap to reveal <ArrowUpRight size={18} />
               </div>
             </div>
          </div>

          {/* ============ BACK SIDE ============ */}
          <div 
            className="absolute inset-0 w-full h-full bg-brand-dark border-2 border-brand-orange rounded-2xl overflow-hidden shadow-2xl p-8 flex flex-col justify-center items-center text-center backface-hidden"
            style={{ 
              transform: "rotateY(180deg)",
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: isFlipped ? 2 : 1
            }}
          >
             <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-gold/30 flex items-center justify-center mb-6 text-brand-gold">
               <Cpu size={32} />
             </div>
             <h4 className="text-xl font-bold text-brand-orange mb-2 uppercase tracking-widest">{techTitle}</h4>
             <p className="text-white text-2xl font-black mb-4">The Tech Inside</p>
             <p className="text-brand-muted leading-relaxed mb-8">
               {techDesc}
             </p>
             <button className="px-6 py-2 rounded-full border border-brand-muted text-brand-muted text-sm hover:border-brand-text hover:text-white transition-colors">
                Close
             </button>
          </div>
       </motion.div>
    </div>
  );
};

const MotivationGallery: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-brand-dark">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Forged for <span className="text-brand-orange">Greatness</span>
          </h2>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
             Die App ist nur das Werkzeug. Der Wille kommt von dir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1: Iron Will */}
          <FlipCard 
            src="/assets/images/ironwill.webp"
            title="Iron Will"
            subtitle="Strength Training"
            techTitle="Progressive Overload"
            techDesc="Der Algorithmus berechnet dein 1RM live neu und schlägt automatisch das nächste Gewicht vor, basierend auf deiner Tagesform."
            index={0}
          />
          {/* Card 2: Unstoppable */}
          <FlipCard 
            src="/assets/images/unstoppable.webp"
            title="Unstoppable"
            subtitle="Cardio & Endurance"
            techTitle="Zone Monitoring"
            techDesc="Echtzeit-Analyse deiner Herzfrequenz-Zonen. Der Audio-Coach sagt dir genau, wann du Gas geben musst und wann du bremst."
            index={1}
          />
          {/* Card 3: Laser Focus */}
          <FlipCard 
            src="/assets/images/laserfocus.webp"
            title="Laser Focus"
            subtitle="Mindset & Audio"
            techTitle="Audio Injection"
            techDesc="Kein Blick aufs Handy nötig. Wichtige Stats und Motivation werden direkt über deine Musik gelegt (Ducking-Effekt)."
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

export default MotivationGallery;
