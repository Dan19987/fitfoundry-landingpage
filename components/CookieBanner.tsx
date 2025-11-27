import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cookie } from 'lucide-react';
// TypeScript Definition für gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('fitfoundry-consent');
    if (!consent) {
      // Small delay so it doesn't pop up instantly aggressively
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleAccept = () => {
    localStorage.setItem('fitfoundry-consent', 'accepted');

    // GA4 Consent Update - Tracking aktivieren
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    setIsVisible(false);
  };
  const handleDecline = () => {
    localStorage.setItem('fitfoundry-consent', 'declined');

    // GA4 bleibt denied (default) - kein Update nötig

    setIsVisible(false);
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-50"
        >
          <div className="bg-brand-surface/95 backdrop-blur-xl border border-brand-border p-6 rounded-2xl shadow-2xl shadow-black/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-brand-dark rounded-full text-brand-orange shrink-0">
                <Cookie size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Keks oder Eisen?</h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  Wir nutzen Cookies, um zu analysieren, wie unsere digitale Schmiede genutzt wird. Keine Werbung, nur Performance-Daten.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 px-4 rounded-full border border-brand-border text-brand-muted text-sm font-medium hover:text-white hover:border-brand-text transition-colors"
              >
                Ablehnen
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 px-4 rounded-full bg-brand-orange text-white text-sm font-bold hover:bg-brand-gold hover:text-brand-dark transition-all shadow-lg shadow-brand-orange/20"
              >
                Akzeptieren
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-4 text-xs text-brand-muted/50">
                <span className="flex items-center gap-1"><ShieldCheck size={10}/> DSGVO Konform</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default CookieBanner;
