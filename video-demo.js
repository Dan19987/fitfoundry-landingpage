/**
 * FitFoundry Video Demo System
 * Für Werbevideos, App-Previews und Jackson-Pollock Anleitungen
 */

(function() {
    'use strict';
    
    // Video Configuration
    const VIDEO_CONFIG = {
        baseUrl: '/assets/video/',
        demos: {
            'werbevideo-1': {
                file: 'fitfoundry-werbevideo-1.mp4',
                poster: 'fitfoundry-werbevideo-1-poster.jpg',
                title: 'FitFoundry Werbevideo #1',
                description: 'Entdecke die wissenschaftliche Fitness-Revolution'
            },
            'werbevideo-2': {
                file: 'fitfoundry-werbevideo-2.mp4', 
                poster: 'fitfoundry-werbevideo-2-poster.jpg',
                title: 'FitFoundry Werbevideo #2',
                description: 'Avatar-Gamification trifft Jackson-Pollock Wissenschaft'
            },
            'app-preview': {
                file: 'fitfoundry-app-preview.mp4',
                poster: 'fitfoundry-app-preview-poster.jpg', 
                title: 'App Preview',
                description: 'Kurzer Einblick in die FitFoundry App'
            },
            'jackson-pollock-anleitung': {
                file: 'jackson-pollock-anleitung.mp4',
                poster: 'jackson-pollock-anleitung-poster.jpg',
                title: 'Jackson-Pollock Anleitung', 
                description: 'So funktioniert die wissenschaftliche Hautfaltenmessung'
            }
        },
        quality: {
            hd: '720p',
            sd: '480p'
        },
        autoplay: false,
        muted: true
    };
    
    let activeVideos = new Set();
    let isInitialized = false;
    
    /**
     * Initialize video demo system
     */
    function init() {
        if (isInitialized) return;
        
        setupVideoPlayers();
        setupIntersectionObserver();
        setupGlobalControls();
        
        isInitialized = true;
        console.log('🎬 FitFoundry Video Demo initialized');
    }
    
    /**
     * Setup all video players on the page
     */
    function setupVideoPlayers() {
        const players = document.querySelectorAll('[data-video-demo]');
        
        players.forEach(player => {
            const demoType = player.getAttribute('data-video-demo');
            if (VIDEO_CONFIG.demos[demoType]) {
                createVideoPlayer(player, demoType);
            }
        });
    }
    
    /**
     * Create individual video player
     */
    function createVideoPlayer(container, demoType) {
        const config = VIDEO_CONFIG.demos[demoType];
        const videoUrl = VIDEO_CONFIG.baseUrl + config.file;
        const posterUrl = VIDEO_CONFIG.baseUrl + config.poster;
        
        // Create player HTML
        const playerHTML = `
            <div class="video-player" data-type="${demoType}">
                <div class="video-info">
                    <h4 class="video-title">${config.title}</h4>
                    <p class="video-description">${config.description}</p>
                </div>
                <div class="video-container">
                    <video 
                        class="video-element"
                        poster="${posterUrl}"
                        preload="metadata"
                        playsinline
                        controls
                        ${VIDEO_CONFIG.muted ? 'muted' : ''}
                    >
                        <source src="${videoUrl}" type="video/mp4">
                        <p>Ihr Browser unterstützt keine Video-Wiedergabe.</p>
                    </video>
                    <div class="video-overlay">
                        <button class="play-overlay-btn" aria-label="Video abspielen">
                            <span class="play-icon">▶️</span>
                        </button>
                    </div>
                </div>
                <div class="video-controls-custom">
                    <button class="fullscreen-btn" aria-label="Vollbild">⛶</button>
                    <button class="pip-btn" aria-label="Picture-in-Picture" style="display: none;">📺</button>
                </div>
            </div>
        `;
        
        container.innerHTML = playerHTML;
        
        // Setup player functionality
        const player = container.querySelector('.video-player');
        const video = player.querySelector('.video-element');
        const overlay = player.querySelector('.video-overlay');
        const playOverlayBtn = player.querySelector('.play-overlay-btn');
        const fullscreenBtn = player.querySelector('.fullscreen-btn');
        const pipBtn = player.querySelector('.pip-btn');
        
        // Show PiP button if supported
        if (document.pictureInPictureEnabled && video.requestPictureInPicture) {
            pipBtn.style.display = 'block';
        }
        
        // Video event listeners
        video.addEventListener('loadstart', () => {
            trackVideoEvent('load_start', demoType);
        });
        
        video.addEventListener('loadedmetadata', () => {
            trackVideoEvent('metadata_loaded', demoType);
        });
        
        video.addEventListener('play', () => {
            activeVideos.add(video);
            hideOverlay(overlay);
            trackVideoEvent('play', demoType);
        });
        
        video.addEventListener('pause', () => {
            activeVideos.delete(video);
            showOverlay(overlay);
            trackVideoEvent('pause', demoType);
        });
        
        video.addEventListener('ended', () => {
            activeVideos.delete(video);
            showOverlay(overlay);
            trackVideoEvent('completed', demoType);
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            showVideoError(player);
        });
        
        video.addEventListener('timeupdate', () => {
            // Track 25%, 50%, 75% milestones
            const progress = (video.currentTime / video.duration) * 100;
            if (progress >= 25 && !video.dataset.milestone25) {
                video.dataset.milestone25 = 'true';
                trackVideoEvent('progress_25', demoType);
            }
            if (progress >= 50 && !video.dataset.milestone50) {
                video.dataset.milestone50 = 'true';
                trackVideoEvent('progress_50', demoType);
            }
            if (progress >= 75 && !video.dataset.milestone75) {
                video.dataset.milestone75 = 'true';
                trackVideoEvent('progress_75', demoType);
            }
        });
        
        // Overlay play button
        playOverlayBtn.addEventListener('click', () => {
            playVideo(video, demoType);
        });
        
        // Custom controls
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreen(video);
        });
        
        pipBtn.addEventListener('click', () => {
            togglePictureInPicture(video);
        });
        
        // Click to play/pause (but not on controls)
        video.addEventListener('click', (e) => {
            // Don't interfere with native controls
            if (!e.target.closest('.video-controls-custom')) {
                if (video.paused) {
                    playVideo(video, demoType);
                } else {
                    video.pause();
                }
            }
        });
    }
    
    /**
     * Play video with proper handling
     */
    function playVideo(video, demoType) {
        // Pause other videos if needed (optional behavior)
        pauseOtherVideos(video);
        
        video.play().catch(error => {
            console.error('Video play failed:', error);
            showVideoError(video.closest('.video-player'));
        });
    }
    
    /**
     * Pause other videos (optional)
     */
    function pauseOtherVideos(currentVideo) {
        activeVideos.forEach(video => {
            if (video !== currentVideo && !video.paused) {
                video.pause();
            }
        });
    }
    
    /**
     * Show/hide video overlay
     */
    function showOverlay(overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    }
    
    function hideOverlay(overlay) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    }
    
    /**
     * Toggle fullscreen
     */
    function toggleFullscreen(video) {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * Toggle Picture-in-Picture
     */
    function togglePictureInPicture(video) {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            video.requestPictureInPicture().catch(err => {
                console.log('PiP request failed:', err);
            });
        }
    }
    
    /**
     * Setup intersection observer for auto-pause
     */
    function setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('.video-element');
                    if (video && activeVideos.has(video)) {
                        if (entry.intersectionRatio < 0.25) {
                            // Pause video when mostly out of view
                            video.pause();
                        }
                    }
                });
            }, {
                threshold: [0.25, 0.75]
            });
            
            document.querySelectorAll('.video-player').forEach(player => {
                observer.observe(player);
            });
        }
    }
    
    /**
     * Show video error message
     */
    function showVideoError(player) {
        const container = player.querySelector('.video-container');
        container.innerHTML = '<div class="video-error">❌ Video konnte nicht geladen werden</div>';
    }
    
    /**
     * Setup global video controls
     */
    function setupGlobalControls() {
        // Pause videos when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                activeVideos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                    }
                });
            }
        });
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            activeVideos.forEach(video => {
                video.pause();
            });
        });
    }
    
    /**
     * Track video events for analytics
     */
    function trackVideoEvent(action, demoType) {
        if (typeof trackEvent === 'function') {
            trackEvent(`video_${action}`, 'Video Demo', demoType);
        }
    }
    
    /**
     * Add CSS for video players
     */
    function addVideoStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .video-player {
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                margin: 2rem 0;
                max-width: 800px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .video-info {
                background: #f8fafc;
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .video-title {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #1f2937;
            }
            
            .video-description {
                font-size: 0.95rem;
                color: #6b7280;
                margin: 0;
            }
            
            .video-container {
                position: relative;
                width: 100%;
                aspect-ratio: 16/9;
            }
            
            .video-element {
                width: 100%;
                height: 100%;
                object-fit: cover;
                background: #000;
            }
            
            .video-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 1;
                transition: opacity 0.3s ease;
                pointer-events: auto;
            }
            
            .play-overlay-btn {
                background: rgba(237, 85, 59, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 2rem;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .play-overlay-btn:hover {
                background: rgba(199, 62, 29, 0.9);
                transform: scale(1.1);
            }
            
            .video-controls-custom {
                background: #f8fafc;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                border-top: 1px solid #e2e8f0;
            }
            
            .fullscreen-btn,
            .pip-btn {
                background: none;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0.5rem 1rem;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s ease;
            }
            
            .fullscreen-btn:hover,
            .pip-btn:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
            }
            
            .video-error {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                color: #ef4444;
                font-size: 1.1rem;
                background: #fef2f2;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .video-player {
                    margin: 1rem 0;
                }
                
                .video-info {
                    padding: 1rem;
                }
                
                .play-overlay-btn {
                    width: 60px;
                    height: 60px;
                    font-size: 1.5rem;
                }
                
                .video-controls-custom {
                    padding: 0.75rem;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .video-info {
                    background: #1f2937;
                    border-color: #374151;
                }
                
                .video-title {
                    color: #f9fafb;
                }
                
                .video-description {
                    color: #d1d5db;
                }
                
                .video-controls-custom {
                    background: #1f2937;
                    border-color: #374151;
                }
                
                .fullscreen-btn,
                .pip-btn {
                    border-color: #6b7280;
                    color: #d1d5db;
                }
                
                .fullscreen-btn:hover,
                .pip-btn:hover {
                    background: #374151;
                    border-color: #9ca3af;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public API
    window.FitFoundryVideo = {
        init: init,
        play: (demoType) => {
            const player = document.querySelector(`[data-video-demo="${demoType}"]`);
            if (player) {
                const video = player.querySelector('.video-element');
                if (video) {
                    playVideo(video, demoType);
                }
            }
        },
        pause: (demoType) => {
            const player = document.querySelector(`[data-video-demo="${demoType}"]`);
            if (player) {
                const video = player.querySelector('.video-element');
                if (video) {
                    video.pause();
                }
            }
        },
        pauseAll: () => {
            activeVideos.forEach(video => {
                video.pause();
            });
        }
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addVideoStyles();
            init();
        });
    } else {
        addVideoStyles();
        init();
    }
    
})();