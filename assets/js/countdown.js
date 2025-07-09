// =============================================================================
// FITFOUNDRY APP LAUNCH COUNTDOWN
// =============================================================================

class FitFoundryCountdown {
    constructor(targetDate, containerId) {
        this.targetDate = new Date(targetDate);
        this.container = document.getElementById(containerId);
        this.interval = null;
        this.isExpired = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('Countdown container not found');
            return;
        }
        
        this.createCountdownHTML();
        this.updateCountdown();
        this.startCountdown();
    }
    
    createCountdownHTML() {
        this.container.innerHTML = `
            <div class="countdown-container">
                <div class="countdown-header">
                    <h3 class="countdown-title">🚀 FitFoundry App Launch</h3>
                    <p class="countdown-subtitle">Die Fitness-Revolution startet in...</p>
                </div>
                
                <div class="countdown-display">
                    <div class="countdown-item">
                        <div class="countdown-number" id="days">00</div>
                        <div class="countdown-label">Tage</div>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="hours">00</div>
                        <div class="countdown-label">Stunden</div>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="minutes">00</div>
                        <div class="countdown-label">Minuten</div>
                    </div>
                    <div class="countdown-separator">:</div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="seconds">00</div>
                        <div class="countdown-label">Sekunden</div>
                    </div>
                </div>
                
                <div class="countdown-footer">
                    <p class="countdown-note">
                        ⚡ <strong>Early Bird Rabatt:</strong> Nur noch wenige Tage! 
                        <span class="highlight-gold">50% Rabatt</span> sichern
                    </p>
                </div>
            </div>
        `;
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;
        
        if (distance < 0) {
            this.handleExpired();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display with leading zeros
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // Add pulsing effect when time is running low
        if (days <= 7) {
            this.container.classList.add('countdown-urgent');
        }
        
        // Track countdown milestones
        this.trackMilestones(days, hours, minutes, seconds);
    }
    
    startCountdown() {
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000); // Update every second for seconds display
        
        // Update immediately
        this.updateCountdown();
    }
    
    handleExpired() {
        this.isExpired = true;
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        // Show launch message
        this.container.innerHTML = `
            <div class="countdown-container countdown-expired">
                <div class="countdown-header">
                    <h3 class="countdown-title">🎉 FitFoundry ist da!</h3>
                    <p class="countdown-subtitle">Die Fitness-Revolution hat begonnen</p>
                </div>
                
                <div class="countdown-display">
                    <div class="countdown-item">
                        <div class="countdown-number">🚀</div>
                        <div class="countdown-label">LIVE</div>
                    </div>
                </div>
                
                <div class="countdown-footer">
                    <a href="https://apps.apple.com/de/developer/fitfoundry" class="btn-primary" target="_blank">
                        📱 Jetzt im App Store
                    </a>
                </div>
            </div>
        `;
        
        // Track launch event
        if (typeof trackEvent === 'function') {
            trackEvent('app_launch_countdown_expired', 'App_Launch', 'countdown_complete');
        }
    }
    
    trackMilestones(days, hours, minutes, seconds) {
        // Track significant milestones
        const milestones = [30, 14, 7, 3, 1];
        
        milestones.forEach(milestone => {
            if (days === milestone && hours === 0 && minutes === 0 && seconds === 0) {
                if (typeof trackEvent === 'function') {
                    trackEvent('countdown_milestone', 'App_Launch', `${milestone}_days_remaining`);
                }
            }
        });
    }
    
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// =============================================================================
// COUNTDOWN STYLES (Injected via JavaScript)
// =============================================================================

function injectCountdownStyles() {
    const styles = `
        <style>
        .countdown-container {
            background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            position: relative;
            overflow: hidden;
        }
        
        .countdown-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255,215,0,0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
        }
        
        .countdown-header {
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 2;
        }
        
        .countdown-title {
            font-size: 1.5rem;
            font-weight: 900;
            color: #FFD700;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .countdown-subtitle {
            color: rgba(255,255,255,0.9);
            font-size: 1rem;
            margin: 0;
        }
        
        .countdown-display {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin: 2rem 0;
            position: relative;
            z-index: 2;
        }
        
        .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;
        }
        
        .countdown-number {
            font-size: 2.5rem;
            font-weight: 900;
            color: #FFD700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 0.25rem;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .countdown-label {
            font-size: 0.8rem;
            color: rgba(255,255,255,0.8);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
        }
        
        .countdown-separator {
            font-size: 2rem;
            color: #FFD700;
            font-weight: 900;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .countdown-footer {
            margin-top: 1.5rem;
            position: relative;
            z-index: 2;
        }
        
        .countdown-note {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.9);
            margin: 0;
            line-height: 1.4;
        }
        
        .highlight-gold {
            color: #FFD700;
            font-weight: 700;
        }
        
        /* Urgent State */
        .countdown-urgent {
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        .countdown-urgent .countdown-number {
            animation: glow 1.5s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { 
                text-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,215,0,0.3);
            }
            to { 
                text-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.6);
            }
        }
        
        /* Expired State */
        .countdown-expired {
            background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,200,0,0.05));
            border-color: rgba(0,255,0,0.3);
        }
        
        .countdown-expired .countdown-number {
            font-size: 3rem;
            animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        /* Mobile Optimierung */
        @media (max-width: 768px) {
            .countdown-container {
                padding: 1.5rem;
            }
            
            .countdown-title {
                font-size: 1.2rem;
            }
            
            .countdown-subtitle {
                font-size: 0.9rem;
            }
            
            .countdown-display {
                gap: 0.3rem;
            }
            
            .countdown-item {
                min-width: 50px;
            }
            
            .countdown-number {
                font-size: 1.6rem;
            }
            
            .countdown-label {
                font-size: 0.6rem;
            }
            
            .countdown-separator {
                font-size: 1.2rem;
            }
            
            .countdown-note {
                font-size: 0.8rem;
            }
        }
        
        @media (max-width: 480px) {
            .countdown-display {
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .countdown-item {
                min-width: 70px;
                margin: 0.2rem;
            }
            
            .countdown-separator {
                display: none;
            }
            
            .countdown-number {
                font-size: 1.8rem;
            }
            
            .countdown-label {
                font-size: 0.7rem;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Inject styles
    injectCountdownStyles();
    
    // Initialize countdown
    // Target: 5. August 2025, 00:00:00 (German Time)
    const targetDate = '2025-08-19T00:00:00';
    
    // Find countdown containers and initialize
    const countdownContainers = document.querySelectorAll('[id^="countdown-"]');
    
    countdownContainers.forEach(container => {
        new FitFoundryCountdown(targetDate, container.id);
    });
    
    // Track countdown page views
    if (typeof trackEvent === 'function') {
        trackEvent('countdown_viewed', 'App_Launch', 'countdown_display');
    }
});

// =============================================================================
// GLOBAL FUNCTIONS
// =============================================================================

// Function to update target date if needed
function updateCountdownDate(newDate) {
    const countdownContainers = document.querySelectorAll('[id^="countdown-"]');
    
    countdownContainers.forEach(container => {
        // Destroy existing countdown
        const existingCountdown = container.countdownInstance;
        if (existingCountdown) {
            existingCountdown.destroy();
        }
        
        // Create new countdown with updated date
        container.countdownInstance = new FitFoundryCountdown(newDate, container.id);
    });
}

// Export for potential use
window.FitFoundryCountdown = FitFoundryCountdown;
window.updateCountdownDate = updateCountdownDate;