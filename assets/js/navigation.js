/**
 * FitFoundry Navigation System
 * Handles mobile navigation, smooth scrolling, and scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Elements
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Navigation Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                resetHamburgerMenu();
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    resetHamburgerMenu();
                }
            });
        });
    }
    
    // Reset hamburger menu animation
    function resetHamburgerMenu() {
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
    
    // Navigation scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled
        if (scrollTop > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
        
        // Hide/show navigation on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            mainNav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            mainNav.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track scroll event
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_to_section', 'Navigation', this.getAttribute('href'));
                }
            }
        });
    });
    
    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }
    
    // Update active link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    
    // Scroll-triggered animations
    function handleScrollAnimations() {
        const elements = document.querySelectorAll('.scroll-fade-in');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initialize scroll animations
    window.addEventListener('scroll', throttle(handleScrollAnimations, 100));
    handleScrollAnimations(); // Run on page load
    
    // Back to top functionality
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.setAttribute('aria-label', 'Zurück nach oben');
        
        // Styles for back to top button
        Object.assign(backToTop.style, {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '50px',
            height: '50px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '1.5rem',
            cursor: 'pointer',
            opacity: '0',
            visibility: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: '999',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
        
        document.body.appendChild(backToTop);
        
        // Show/hide back to top button
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        // Back to top click handler
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track back to top event
            if (typeof trackEvent === 'function') {
                trackEvent('back_to_top', 'Navigation');
            }
        });
    }
    
    // Initialize back to top button
    createBackToTopButton();
    
    // Form submission tracking
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const formType = this.className.includes('early-bird') ? 'early-bird' : 'contact';
            
            // Track form submission
            if (typeof trackEvent === 'function') {
                trackEvent('form_submit', 'Form', formType);
            }
        });
    });
    
    // CTA button tracking
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonType = this.className.includes('nav-cta') ? 'navigation' : 'content';
            
            // Track CTA clicks
            if (typeof trackEvent === 'function') {
                trackEvent('cta_click', 'CTA', `${buttonType}_${buttonText}`);
            }
        });
    });
    
    // Page visibility tracking
    document.addEventListener('visibilitychange', function() {
        if (typeof trackEvent === 'function') {
            if (document.hidden) {
                trackEvent('page_hidden', 'Engagement');
            } else {
                trackEvent('page_visible', 'Engagement');
            }
        }
    });
    
    // Scroll depth tracking
    let maxScrollDepth = 0;
    window.addEventListener('scroll', throttle(function() {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track significant scroll milestones
            if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_depth_25', 'Engagement');
                }
            } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_depth_50', 'Engagement');
                }
            } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_depth_75', 'Engagement');
                }
            } else if (maxScrollDepth >= 90) {
                if (typeof trackEvent === 'function') {
                    trackEvent('scroll_depth_90', 'Engagement');
                }
            }
        }
    }, 500));
    
    // External link tracking
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                if (typeof trackEvent === 'function') {
                    trackEvent('external_link', 'Navigation', this.href);
                }
            });
        }
    });
    
    // Performance monitoring
    window.addEventListener('load', function() {
        // Track page load time
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        
        if (typeof trackEvent === 'function') {
            trackEvent('page_load_time', 'Performance', Math.round(loadTime / 1000) + 's');
        }
        
        // Track Core Web Vitals if available
        if ('web-vitals' in window) {
            // This would require the web-vitals library
            // For now, we'll track basic performance metrics
        }
    });
// Initialize animated counters for homepage
    initAnimatedCounters();


// Animierte Zahlen für Hero Stats
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    if (counters.length === 0) return; // Exit if no counters found
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.getAttribute('data-target');
                
                if (target && !counter.classList.contains('counted')) {
                    animateCounter(counter, target);
                    counter.classList.add('counted');
                }
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, targetText) {
    // Extrahiere Zahlen aus dem Text (z.B. "±3-4%" -> "3")
    const number = targetText.match(/\d+/);
    if (!number) {
        element.textContent = targetText;
        element.classList.add('animate');
        return;
    }
    
    const targetNumber = parseInt(number[0]);
    const prefix = targetText.split(number[0])[0];
    const suffix = targetText.split(number[0])[1];
    
    let current = 0;
    const increment = targetNumber / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        element.textContent = prefix + Math.floor(current) + suffix;
        element.classList.add('animate');
    }, 50);
}

});

// Utility function: Throttle
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Utility function: Debounce
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// CSS for scrolled navigation state
const style = document.createElement('style');
style.textContent = `
    .main-nav.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    .nav-link.active {
        color: var(--primary-color);
        font-weight: var(--font-weight-semibold);
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary-color);
        border-radius: 1px;
    }
    
    .back-to-top:hover {
        background: var(--primary-dark) !important;
        transform: translateY(-2px) !important;
    }
`;
document.head.appendChild(style);
