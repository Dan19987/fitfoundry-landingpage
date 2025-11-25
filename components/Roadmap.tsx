import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Flame } from 'lucide-react';

const milestones = [
  {
    date: "Q1 2025",
    title: "The Inception",
    desc: "Wissenschaftliche Recherche & Startschuss.",
    status: "completed"
  },
  {
    date: "Q2 2025",
    title: "Construction",
    desc: "Core-Entwicklung: Audio Engine & Calorie Algo.",
    status: "completed"
  },
  {
    date: "Q3 2025",
    title: "Polishing",
    desc: "Closed Beta Phase & UI Refinement.",
    status: "upcoming"
  },
  {
    date: "Winter 2025",
    title: "LAUNCH",
    desc: "Public Release im App Store. Der Anfang.",
    status: "future"
  }
];

const Roadmap: React.FC = () => {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Ambience: Heat leak from Magma Section above */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/5 to-brand-dark pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-orange/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">FitFoundry Timeline</h2>
          <p className="text-brand-muted text-lg">Der Weg zum perfekten Produkt.</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Central Line Background */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-brand-border transform md:-translate-x-1/2" />
          
          {/* Animated Lava Line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-gradient-to-b from-brand-orange to-brand-gold transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(237,85,59,0.5)] origin-top"
          />

          <div className="space-y-12">
            {milestones.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.2 }}
                  className={`relative flex items-center md:justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-0 pl-16 md:pl-0`}
                >
                  {/* Timeline Dot (Center) */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-brand-dark border-2 border-brand-orange z-10 shadow-[0_0_10px_rgba(0,0,0,1)]">
                    {item.status === 'completed' ? (
                      <div className="w-3 h-3 bg-brand-gold rounded-full animate-pulse" />
                    ) : item.status === 'future' ? (
                      <Flame size={14} className="text-brand-orange" />
                    ) : (
                      <Circle size={12} className="text-brand-muted" />
                    )}
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-[45%] ${isLeft ? 'text-left md:text-right' : 'text-left'}`}>
                    <div className="inline-block px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-gold font-bold mb-2">
                      {item.date}
                    </div>
                    <h3 className={`text-xl font-bold text-white mb-2 ${item.title === 'LAUNCH' ? 'text-brand-orange text-2xl tracking-widest uppercase' : ''}`}>
                      {item.title}
                    </h3>
                    <p className="text-brand-muted text-sm">{item.desc}</p>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;