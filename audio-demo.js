/**
 * FitFoundry Audio Demo System
 * Für Workout-Snippets und App-Begrüßung
 */

(function() {
    'use strict';
    
    // Audio Configuration
    const AUDIO_CONFIG = {
        baseUrl: '/assets/audio/',
        demos: {
            'workout-snippet': {
                file: 'Male2_05-Workout-weißtdunoch.mp3',
                title: 'Workout Audio-Kommentar',
                description: 'Hörprobe aus einem FitFoundry Workout'
            },
            'app-welcome': {
                file: 'Male1_01-Intro-Willkommen.mp3', 
                title: 'App-Begrüßung',
                description: 'Audio-Demo der FitFoundry App'
            }
        },
        fadeTime: 300,
        maxVolume: 0.8
    };
    
    let currentAudio = null;
    let isInitialized = false;
    
    /**
     * Initialize audio demo system
     */
    function init() {
        if (isInitialized) return;
        
        setupAudioPlayers();
        setupGlobalControls();
        preloadCriticalAudio();
        
        isInitialized = true;
        console.log('🔊 FitFoundry Audio Demo initialized');
    }
    
    /**
     * Setup all audio players on the page
     */
    function setupAudioPlayers() {
        const players = document.querySelectorAll('[data-audio-demo]');
        
        players.forEach(player => {
            const demoType = player.getAttribute('data-audio-demo');
            if (AUDIO_CONFIG.demos[demoType]) {
                createAudioPlayer(player, demoType);
            }
        });
    }
    
    /**
     * Create individual audio player
     */
    function createAudioPlayer(container, demoType) {
        const config = AUDIO_CONFIG.demos[demoType];
        const audioUrl = AUDIO_CONFIG.baseUrl + config.file;
        
        // Create player HTML
        const playerHTML = `
            <div class="audio-player" data-type="${demoType}">
                <div class="audio-info">
                    <h4 class="audio-title">${config.title}</h4>
                    <p class="audio-description">${config.description}</p>
                </div>
                <div class="audio-controls">
                    <button class="play-btn" aria-label="Audio abspielen">
                        <span class="play-icon">▶️</span>
                        <span class="pause-icon" style="display: none;">⏸️</span>
                    </button>
                    <div class="audio-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="time-display">
                            <span class="current-time">0:00</span>
                            <span class="total-time">--:--</span>
                        </div>
                    </div>
                    <div class="volume-control">
                        <button class="volume-btn" aria-label="Lautstärke">🔊</button>
                        <input type="range" class="volume-slider" min="0" max="100" value="80">
                    </div>
                </div>
                <audio preload="metadata">
                    <source src="${audioUrl}" type="audio/mpeg">
                    Ihr Browser unterstützt keine Audio-Wiedergabe.
                </audio>
            </div>
        `;
        
        container.innerHTML = playerHTML;
        
        // Setup player functionality
        const player = container.querySelector('.audio-player');
        const audio = player.querySelector('audio');
        const playBtn = player.querySelector('.play-btn');
        const progressBar = player.querySelector('.progress-bar');
        const progressFill = player.querySelector('.progress-fill');
        const currentTimeEl = player.querySelector('.current-time');
        const totalTimeEl = player.querySelector('.total-time');
        const volumeSlider = player.querySelector('.volume-slider');
        const volumeBtn = player.querySelector('.volume-btn');
        
        // Audio event listeners
        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
        });
        
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });
        
        audio.addEventListener('ended', () => {
            stopAudio(audio, player);
            trackAudioEvent('completed', demoType);
        });
        
        audio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            showAudioError(player);
        });
        
        // Play/Pause functionality
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                playAudio(audio, player, demoType);
            } else {
                stopAudio(audio, player);
            }
        });
        
        // Progress bar click
        progressBar.addEventListener('click', (e) => {
            if (audio.duration) {
                const rect = progressBar.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                audio.currentTime = pos * audio.duration;
            }
        });
        
        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            audio.volume = volume * AUDIO_CONFIG.maxVolume;
            updateVolumeIcon(volumeBtn, volume);
        });
        
        volumeBtn.addEventListener('click', () => {
            toggleMute(audio, volumeSlider, volumeBtn);
        });
        
        // Set initial volume
        audio.volume = AUDIO_CONFIG.maxVolume * 0.8;
    }
    
    /**
     * Play audio with proper handling
     */
    function playAudio(audio, player, demoType) {
        // Stop any currently playing audio
        if (currentAudio && currentAudio !== audio) {
            stopAudio(currentAudio, currentAudio.closest('.audio-player'));
        }
        
        audio.play().then(() => {
            currentAudio = audio;
            updatePlayButton(player, true);
            trackAudioEvent('play', demoType);
        }).catch(error => {
            console.error('Audio play failed:', error);
            showAudioError(player);
        });
    }
    
    /**
     * Stop audio (not just pause)
     */
    function stopAudio(audio, player) {
        audio.pause();
        audio.currentTime = 0; // Reset to beginning
        updatePlayButton(player, false);
        
        if (currentAudio === audio) {
            currentAudio = null;
        }
    }
    
    /**
     * Pause audio (for backward compatibility)
     */
    function pauseAudio(audio, player) {
        // Use stop instead of pause for better UX
        stopAudio(audio, player);
    }
    
    /**
     * Reset player to initial state
     */
    function resetPlayer(player) {
        const audio = player.querySelector('audio');
        const progressFill = player.querySelector('.progress-fill');
        const currentTimeEl = player.querySelector('.current-time');
        
        audio.currentTime = 0;
        progressFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        updatePlayButton(player, false);
        
        if (currentAudio === audio) {
            currentAudio = null;
        }
    }
    
    /**
     * Update play/pause button state
     */
    function updatePlayButton(player, isPlaying) {
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
    
    /**
     * Format time for display
     */
    function formatTime(seconds) {
        if (isNaN(seconds)) return '--:--';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    /**
     * Update volume icon based on level
     */
    function updateVolumeIcon(btn, volume) {
        if (volume === 0) {
            btn.textContent = '🔇';
        } else if (volume < 0.5) {
            btn.textContent = '🔉';
        } else {
            btn.textContent = '🔊';
        }
    }
    
    /**
     * Toggle mute functionality
     */
    function toggleMute(audio, volumeSlider, volumeBtn) {
        if (audio.volume > 0) {
            audio.dataset.previousVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            updateVolumeIcon(volumeBtn, 0);
        } else {
            const prevVolume = parseFloat(audio.dataset.previousVolume) || 0.8;
            audio.volume = prevVolume;
            volumeSlider.value = (prevVolume / AUDIO_CONFIG.maxVolume) * 100;
            updateVolumeIcon(volumeBtn, prevVolume);
        }
    }
    
    /**
     * Show audio error message
     */
    function showAudioError(player) {
        const controls = player.querySelector('.audio-controls');
        controls.innerHTML = '<p class="audio-error">❌ Audio konnte nicht geladen werden</p>';
    }
    
    /**
     * Setup global audio controls
     */
    function setupGlobalControls() {
        // Pause all audio when leaving page
        window.addEventListener('beforeunload', () => {
            if (currentAudio) {
                currentAudio.pause();
            }
        });
        
        // Pause audio when page becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && currentAudio) {
                stopAudio(currentAudio, currentAudio.closest('.audio-player'));
            }
        });
    }
    
    /**
     * Preload critical audio files
     */
    function preloadCriticalAudio() {
        // Preload app-welcome audio for better UX
        if (AUDIO_CONFIG.demos['app-welcome']) {
            const audio = new Audio();
            audio.preload = 'metadata';
            audio.src = AUDIO_CONFIG.baseUrl + AUDIO_CONFIG.demos['app-welcome'].file;
        }
    }
    
    /**
     * Track audio events for analytics
     */
    function trackAudioEvent(action, demoType) {
        if (typeof trackEvent === 'function') {
            trackEvent(`audio_${action}`, 'Audio Demo', demoType);
        }
    }
    
    /**
     * Add CSS for audio players
     */
    function addAudioStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .audio-player {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1rem 0;
                max-width: 500px;
            }
            
            .audio-info {
                margin-bottom: 1rem;
            }
            
            .audio-title {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #1f2937;
            }
            
            .audio-description {
                font-size: 0.9rem;
                color: #6b7280;
                margin: 0;
            }
            
            .audio-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .play-btn {
                background: #ed553b;
                color: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.2s ease;
            }
            
            .play-btn:hover {
                background: #c73e1d;
                transform: scale(1.05);
            }
            
            .audio-progress {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .progress-bar {
                height: 6px;
                background: #e2e8f0;
                border-radius: 3px;
                cursor: pointer;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background: #ed553b;
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .time-display {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                color: #6b7280;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .volume-btn {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.1rem;
            }
            
            .volume-slider {
                width: 80px;
            }
            
            .audio-error {
                color: #ef4444;
                font-size: 0.9rem;
                margin: 0;
            }
            
            @media (max-width: 480px) {
                .audio-controls {
                    flex-direction: column;
                    gap: 0.8rem;
                }
                
                .audio-progress {
                    width: 100%;
                }
                
                .volume-control {
                    align-self: stretch;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Public API
    window.FitFoundryAudio = {
        init: init,
        play: (demoType) => {
            const player = document.querySelector(`[data-audio-demo="${demoType}"]`);
            if (player) {
                const audio = player.querySelector('audio');
                const playerEl = player.querySelector('.audio-player');
                if (audio && playerEl) {
                    playAudio(audio, playerEl, demoType);
                }
            }
        },
        pause: () => {
            if (currentAudio) {
                stopAudio(currentAudio, currentAudio.closest('.audio-player'));
            }
        }
    };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addAudioStyles();
            init();
        });
    } else {
        addAudioStyles();
        init();
    }
    
})();