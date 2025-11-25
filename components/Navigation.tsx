import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300 rounded-full border ${
          isScrolled
            ? 'bg-brand-dark/90 border-brand-border backdrop-blur-md shadow-lg shadow-black/50 py-3'
            : 'bg-brand-surface/60 border-brand-border/50 backdrop-blur-sm py-4'
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              {/* Glow Effect behind logo */}
              <div className="absolute inset-0 bg-brand-orange/30 blur-md rounded-full group-hover:bg-brand-orange/50 transition-colors" />
              <img 
                src="/assets/images/logo.png" 
                alt="FitFoundry Logo" 
                className="w-full h-full object-contain relative z-10 drop-shadow-md"
                onError={(e) => {
                  // Fallback if png not found, try webp or placeholder
                  const target = e.target as HTMLImageElement;
                  if (target.src.endsWith('png')) {
                    target.src = "/assets/images/logo.webp";
                  }
                }}
              />
            </div>
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-brand-gold transition-colors">FitFoundry</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Live-Tracker
            </a>
            <a href="#trust" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Wissenschaft
            </a>
            <a href="#features-list" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
              Features
            </a>
          </div>

          <div className="hidden md:block">
            <a
              href="#early-bird"
              className="bg-brand-gold text-brand-dark text-sm font-bold px-6 py-2.5 rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              Early Access
            </a>
          </div>

          <button
            className="md:hidden text-brand-text"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <a
            href="#features"
            className="text-xl font-bold text-brand-text"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Live-Tracker
          </a>
          <a
            href="#trust"
            className="text-xl font-bold text-brand-text"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Wissenschaft
          </a>
          <a
            href="#early-bird"
            className="bg-brand-gold text-brand-dark text-lg font-bold px-8 py-3 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Early Access
          </a>
        </div>
      )}
    </>
  );
};

export default Navigation;