/**
 * FitFoundry Lazy Loading System
 * Performance-optimiert für Landing Pages
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        rootMargin: '50px 0px',
        threshold: 0.1,
        imagePlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMyMi43NjE0IDI1IDI1IDIyLjc2MTQgMjUgMjBDMjUgMTcuMjM4NiAyMi43NjE0IDE1IDIwIDE1QzE3LjIzODYgMTUgMTUgMTcuMjM4NiAxNSAyMEMxNSAyMi43NjE0IDE3LjIzODYgMjUgMjAgMjVaIiBmaWxsPSIjOUIxOUY5Ii8+Cjwvc3ZnPgo='
    };
    
    // Lazy loading for images
    function initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, CONFIG);
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(loadImage);
        }
    }
    
    // Load individual image
    function loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // Create new image for preloading
        const newImg = new Image();
        
        newImg.onload = function() {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            
            // Track successful image load
            if (typeof trackEvent === 'function') {
                trackEvent('image_loaded', 'Performance', src);
            }
        };
        
        newImg.onerror = function() {
            img.classList.add('error');
            console.warn('Failed to load image:', src);
        };
        
        newImg.src = src;
    }
    
    // Lazy loading for videos
    function initVideoLazyLoading() {
        const videos = document.querySelectorAll('video[data-src]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        loadVideo(video);
                        observer.unobserve(video);
                    }
                });
            }, CONFIG);
            
            videos.forEach(video => videoObserver.observe(video));
        } else {
            videos.forEach(loadVideo);
        }
    }
    
    // Load individual video
    function loadVideo(video) {
        const src = video.getAttribute('data-src');
        if (!src) return;
        
        video.src = src;
        video.classList.add('loaded');
        video.removeAttribute('data-src');
        
        // Auto-load video for better UX
        video.load();
        
        // Track video load
        if (typeof trackEvent === 'function') {
            trackEvent('video_loaded', 'Performance', src);
        }
    }
    
    // Lazy loading for background images
    function initBackgroundLazyLoading() {
        const elements = document.querySelectorAll('[data-bg]');
        
        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        loadBackgroundImage(element);
                        observer.unobserve(element);
                    }
                });
            }, CONFIG);
            
            elements.forEach(el => bgObserver.observe(el));
        } else {
            elements.forEach(loadBackgroundImage);
        }
    }
    
    // Load background image
    function loadBackgroundImage(element) {
        const bgSrc = element.getAttribute('data-bg');
        if (!bgSrc) return;
        
        const img = new Image();
        img.onload = function() {
            element.style.backgroundImage = `url(${bgSrc})`;
            element.classList.add('bg-loaded');
            element.removeAttribute('data-bg');
        };
        img.src = bgSrc;
    }
    
    // Lazy loading for iframes (embeds, maps, etc.)
    function initIframeLazyLoading() {
        const iframes = document.querySelectorAll('iframe[data-src]');
        
        if ('IntersectionObserver' in window) {
            const iframeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const iframe = entry.target;
                        loadIframe(iframe);
                        observer.unobserve(iframe);
                    }
                });
            }, CONFIG);
            
            iframes.forEach(iframe => iframeObserver.observe(iframe));
        } else {
            iframes.forEach(loadIframe);
        }
    }
    
    // Load individual iframe
    function loadIframe(iframe) {
        const src = iframe.getAttribute('data-src');
        if (!src) return;
        
        iframe.src = src;
        iframe.classList.add('loaded');
        iframe.removeAttribute('data-src');
    }
    
    // Add loading placeholder for images
    function addImagePlaceholders() {
        const images = document.querySelectorAll('img[data-src]:not([src])');
        images.forEach(img => {
            if (!img.src || img.src === '') {
                img.src = CONFIG.imagePlaceholder;
                img.classList.add('lazy-placeholder');
            }
        });
    }
    
    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            const src = img.getAttribute('data-src') || img.getAttribute('src');
            if (src) {
                const preloadImg = new Image();
                preloadImg.src = src;
            }
        });
    }
    
    // Initialize all lazy loading
    function init() {
        // Add CSS for smooth transitions
        addLazyLoadingStyles();
        
        // Add placeholders
        addImagePlaceholders();
        
        // Preload critical images
        preloadCriticalImages();
        
        // Initialize lazy loading
        initImageLazyLoading();
        initVideoLazyLoading();
        initBackgroundLazyLoading();
        initIframeLazyLoading();
        
        console.log('✅ FitFoundry Lazy Loading initialized');
    }
    
    // Add CSS styles for lazy loading
    function addLazyLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            img[data-src] {
                transition: opacity 0.3s ease;
                opacity: 0.7;
            }
            
            img.loaded {
                opacity: 1;
            }
            
            img.error {
                opacity: 0.5;
                filter: grayscale(100%);
            }
            
            img.lazy-placeholder {
                background: #f3f4f6;
                border-radius: 8px;
            }
            
            [data-bg] {
                transition: opacity 0.3s ease;
            }
            
            [data-bg].bg-loaded {
                opacity: 1;
            }
            
            video[data-src] {
                background: #f3f4f6;
                border-radius: 8px;
            }
            
            iframe[data-src] {
                background: #f3f4f6;
                min-height: 200px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public API
    window.FitFoundryLazyLoad = {
        init: init,
        loadImage: loadImage,
        loadVideo: loadVideo
    };
    
    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();