// ================================================================
// FITFOUNDRY LAZY LOADING SYSTEM
// ================================================================

class FitFoundryLazyLoader {
    constructor() {
        this.imageObserver = null;
        this.sectionObserver = null;
        this.animationObserver = null;
        this.loadedSections = new Set();
        
        this.init();
    }

    init() {
        // Nur wenn IntersectionObserver unterstützt wird
        if ('IntersectionObserver' in window) {
            this.setupImageLazyLoading();
            this.setupSectionLazyLoading();
            this.setupAnimationLazyLoading();
            this.optimizeFonts();
            this.deferNonCriticalCSS();
        } else {
            // Fallback für alte Browser
            this.loadAllImages();
            console.warn('IntersectionObserver nicht unterstützt - Lazy Loading deaktiviert');
        }
    }

    // ================================================================
    // BILDER LAZY LOADING
    // ================================================================
    setupImageLazyLoading() {
        const imageOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Normales img Tag
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Background Images
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                        img.removeAttribute('data-bg');
                    }
                    
                    // Klasse für fade-in Animation
                    img.classList.add('lazy-loaded');
                    
                    // Nicht mehr beobachten
                    observer.unobserve(img);
                }
            });
        }, imageOptions);

        // Alle lazy images finden
        document.querySelectorAll('img[data-src], [data-bg]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    // ================================================================
    // SEKTIONEN LAZY LOADING
    // ================================================================
    setupSectionLazyLoading() {
        const sectionOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        this.sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.loadedSections.has(entry.target)) {
                    const section = entry.target;
                    this.loadedSections.add(section);
                    
                    // Sektion als geladen markieren
                    section.classList.add('section-loaded');
                    
                    // Spezielle Behandlung je nach Sektion
                    this.handleSectionLoad(section);
                }
            });
        }, sectionOptions);

        // Alle Sektionen außer Hero lazy laden
        document.querySelectorAll('.section:not(.hero)').forEach(section => {
            // Initial verstecken
            section.classList.add('lazy-section');
            this.sectionObserver.observe(section);
        });
    }

    handleSectionLoad(section) {
        // Features Section
        if (section.classList.contains('gradient-features')) {
            this.loadFeatureCards();
        }
        
        // Pricing Section
        else if (section.classList.contains('gradient-pricing')) {
            this.loadPricingCards();
        }
        
        // Testimonials
        else if (section.classList.contains('gradient-social')) {
            this.loadTestimonials();
        }
        
        // Science Section
        else if (section.classList.contains('gradient-science')) {
            this.initScienceCounters();
        }
        
        // Audio/Live Sections
        else if (section.classList.contains('gradient-audio') || 
                 section.classList.contains('gradient-live')) {
            this.loadDemoContainers();
        }
    }

    // ================================================================
    // ANIMATIONEN LAZY LOADING
    // ================================================================
    setupAnimationLazyLoading() {
        const animationOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Animation starten
                    if (element.dataset.animation) {
                        element.style.animation = element.dataset.animation;
                        element.removeAttribute('data-animation');
                    }
                    
                    // Klassen für CSS Animationen
                    if (element.dataset.animClass) {
                        element.classList.add(element.dataset.animClass);
                        element.removeAttribute('data-anim-class');
                    }
                    
                    this.animationObserver.unobserve(element);
                }
            });
        }, animationOptions);

        // Elemente mit Animationen vorbereiten
        this.prepareAnimations();
    }

    prepareAnimations() {
        // Counter stoppen bis sichtbar
        document.querySelectorAll('.animated-counter').forEach(counter => {
            counter.textContent = '0';
            counter.dataset.animClass = 'start-counting';
            this.animationObserver.observe(counter);
        });

        // Floating badges
        document.querySelectorAll('.floating-badge').forEach(badge => {
            badge.style.animation = 'none';
            badge.dataset.animation = 'floatBadgeEnhanced 6s ease-in-out infinite';
            this.animationObserver.observe(badge);
        });

        // Pulse animations
        document.querySelectorAll('.pulse').forEach(el => {
            el.style.animation = 'none';
            el.dataset.animation = 'pulse 2s ease-in-out infinite';
            this.animationObserver.observe(el);
        });
    }

    // ================================================================
    // SPEZIFISCHE LADE-FUNKTIONEN
    // ================================================================
    loadFeatureCards() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        });
    }

    loadPricingCards() {
        const cards = document.querySelectorAll('.pricing-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        });
    }

    loadTestimonials() {
        const cards = document.querySelectorAll('.testimonial-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 200);
        });
    }

    initScienceCounters() {
        // Nur Counter in der Science Section starten
        const section = document.querySelector('.gradient-science');
        if (section) {
            const counters = section.querySelectorAll('.animated-counter');
            counters.forEach(counter => {
                if (counter.classList.contains('start-counting')) {
                    this.animateCounter(counter);
                    counter.classList.remove('start-counting');
                }
            });
        }
    }

    animateCounter(counter) {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target % 1 !== 0) {
                counter.textContent = current.toFixed(1);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }

    loadDemoContainers() {
        // Demo Container animationen starten
        document.querySelectorAll('.audio-demo-container, .live-demo-container').forEach(container => {
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    }

    // ================================================================
    // FONT OPTIMIERUNG
    // ================================================================
    optimizeFonts() {
        // Font-display: swap für bessere Performance
        const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (fontLink) {
            fontLink.href += '&display=swap';
        }
    }

    // ================================================================
    // CSS LAZY LOADING
    // ================================================================
    deferNonCriticalCSS() {
        // Mobile CSS nur auf Mobile laden
        if (window.innerWidth > 768) {
            const mobileCss = document.querySelector('link[href*="mobile-fixes.css"]');
            if (mobileCss) {
                mobileCss.media = 'print';
                mobileCss.onload = function() { this.media = 'all'; };
            }
        }
    }

    // ================================================================
    // FALLBACK FÜR ALTE BROWSER
    // ================================================================
    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
        
        document.querySelectorAll('[data-bg]').forEach(el => {
            el.style.backgroundImage = `url(${el.dataset.bg})`;
        });
    }

    // ================================================================
    // PERFORMANCE MONITORING
    // ================================================================
    logPerformance() {
        if (window.performance && performance.getEntriesByType) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('🚀 FitFoundry Performance:', {
                'DOM geladen': perfData.domContentLoadedEventEnd + 'ms',
                'Seite komplett': perfData.loadEventEnd + 'ms',
                'Geladene Sektionen': this.loadedSections.size
            });
        }
    }
}

// ================================================================
// LAZY LOADER STARTEN
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    window.fitFoundryLazyLoader = new FitFoundryLazyLoader();
    
    // Performance nach 3 Sekunden loggen
    setTimeout(() => {
        window.fitFoundryLazyLoader.logPerformance();
    }, 3000);
});