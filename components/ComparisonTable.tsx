import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';

const ComparisonTable: React.FC = () => {
  const features = [
    {
      name: "Feedback",
      standard: "Generische Push-Nachrichten",
      foundry: "Live Audio-Coach (Reaktiv)"
    },
    {
      name: "Kalorien",
      standard: "Ungenaue Formeln",
      foundry: "Echtzeit-Stoffwechsel-Analyse"
    },
    {
      name: "Tracking",
      standard: "Manuelle Eingabe nach Training",
      foundry: "One-Tap + Live Burn Ticker"
    },
    {
      name: "Datenschutz",
      standard: "Cloud / Verkauf von Daten",
      foundry: "Lokal & DSGVO-Konform"
    }
  ];

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      {/* Background Glow / Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-surface/50 blur-[100px] pointer-events-none" />
      {/* New: Subtle bottom gradient to lift the section */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-brand-surface/20 via-brand-dark to-brand-dark pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Iron vs. Plastic</h2>
          <p className="text-brand-muted text-lg">Warum FitFoundry in einer eigenen Liga spielt.</p>
        </div>

        {/* VISUAL BATTLE ARENA */}
        <div className="flex items-center justify-center gap-8 md:gap-20 mb-16">
          
          {/* Plastic Element (Weak) */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-brand-border bg-transparent flex items-center justify-center grayscale opacity-40">
              <div className="w-16 h-16 rounded-full bg-brand-surface/50" />
            </div>
            <span className="text-brand-muted font-mono uppercase text-sm tracking-widest opacity-60">Standard</span>
          </div>

          {/* VS Element */}
          <div className="relative">
             <div className="absolute inset-0 bg-brand-orange/20 blur-xl rounded-full" />
             <Zap className="text-brand-text relative z-10 w-10 h-10 md:w-16 md:h-16" fill="currentColor" strokeWidth={0} />
          </div>

          {/* Iron Element (Strong/Pulsing) */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-brand-surface border border-brand-orange/30 flex items-center justify-center shadow-[0_0_30px_rgba(237,85,59,0.3)]">
              {/* Core Pulse */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-gold shadow-[0_0_20px_#ED553B] blur-[1px]"
              />
              {/* Outer Ring Rotation */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-brand-gold/30 border-t-transparent border-l-transparent"
              />
            </div>
            <span className="text-brand-orange font-bold font-mono uppercase text-sm tracking-widest drop-shadow-md">Foundry</span>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center">
          
          {/* Standard App Card */}
          <div className="bg-brand-surface/20 border border-brand-border rounded-2xl p-8 md:rounded-r-none md:border-r-0 opacity-70 hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-bold text-brand-muted mb-6 text-center">Standard Apps</h3>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-brand-muted group/item">
                  <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center shrink-0 group-hover/item:bg-red-900/20 group-hover/item:text-red-500 transition-colors">
                    <X size={16} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider opacity-50 mb-1">{f.name}</div>
                    <div className="font-medium decoration-brand-muted/50 line-through decoration-1">{f.standard}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FitFoundry Card (Highlighted) */}
          <motion.div 
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-surface/60 backdrop-blur-xl border-2 border-brand-orange rounded-2xl p-10 shadow-[0_0_50px_rgba(237,85,59,0.15)] relative z-10 md:-ml-4 group"
          >
            <div className="absolute top-0 right-0 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-lg">
              WINNER
            </div>
            
            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-brand-gold mb-8 text-center drop-shadow-sm">
              FitFoundry
            </h3>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-white">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-gold flex items-center justify-center text-brand-dark shrink-0 shadow-lg shadow-brand-orange/20">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-xs text-brand-orange uppercase tracking-wider font-bold mb-1">{f.name}</div>
                    <div className="font-bold text-lg">{f.foundry}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;