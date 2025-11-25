import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Ist der Early Access kostenlos?",
    answer: "Ja, die Anmeldung zum Early Access ist 100% kostenlos. Du sicherst dir damit lediglich den Anspruch auf den Launch-Rabatt (50%) und wirst informiert, sobald die App verfügbar ist."
  },
  {
    question: "Wann erscheint FitFoundry?",
    answer: "Der offizielle Launch ist für Herbst (Q4) 2025 geplant. Wir führen derzeit geschlossene Beta-Tests durch, um die Audio-Engine zu perfektionieren."
  },
{
  question: "Welche Geräte werden unterstützt?",
  answer: "FitFoundry ist exklusiv für Apple-Geräte entwickelt. Du benötigst ein iPhone mit iOS 14.0 oder höher. Die App funktioniert auch auf dem iPad. Eine Apple Watch wird nicht benötigt - alle Funktionen laufen direkt auf deinem iPhone."
},
{
  question: "Kann ich meine Daten exportieren?",
  answer: "Ja, du kannst deine kompletten Trainingsdaten jederzeit als JSON-Datei exportieren und auch wieder importieren. So behältst du die volle Kontrolle über deine Daten und kannst sie sichern oder auf ein neues Gerät übertragen."
},
{
  question: "Wird Apple Health unterstützt?",
  answer: "Apple Health Integration ist für Q2 2026 geplant. Aktuell werden alle Daten lokal auf deinem iPhone gespeichert."
},
{
  question: "Was macht Apple Sign-In?",
  answer: "Mit Apple Sign-In verknüpfst du dein Konto sicher. Deine Trainingsdaten bleiben aktuell lokal auf deinem Gerät. Die Anmeldung ermöglicht uns, zukünftig sichere Cloud-Backups & Sync anzubieten."
},
  {
    question: "Werden meine Daten verkauft?",
    answer: "Niemals. FitFoundry ist ein deutsches Unternehmen. Deine Gesundheitsdaten werden lokal auf deinem Gerät verschlüsselt und nur für die App-Funktionen genutzt. Wir sind kein Datenhändler."
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-brand-surface/20" aria-label="Häufig gestellte Fragen">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Häufige Fragen</h2>
          <p className="text-brand-muted text-lg">Alles, was du vor dem Start wissen musst.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-brand-border rounded-xl bg-brand-dark/50 overflow-hidden hover:border-brand-orange/30 transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${activeIndex === idx ? 'text-brand-gold' : 'text-white'}`}>
                  {faq.question}
                </span>
                <span className="text-brand-orange">
                  {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-brand-muted leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;