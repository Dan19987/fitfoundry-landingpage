// =============================================================================
// FITFOUNDRY APP LAUNCH COUNTDOWN - MONATE & TAGE VERSION
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
                        <div class="countdown-number" id="months">0</div>
                        <div class="countdown-label">Monate</div>
                    </div>
                    <div class="countdown-separator">+</div>
                    <div class="countdown-item">
                        <div class="countdown-number" id="days">0</div>
                        <div class="countdown-label">Tage</div>
                    </div>
                </div>
                
                <div class="countdown-footer">
                    <p class="countdown-note">
⚡ <strong>Herbst 2025:</strong> Jetzt anmelden, um nichts zu verpassen! 
<span class="highlight-gold">Erinnerung zum Launch</span> garantiert ;)
                    </p>
                </div>
            </div>
        `;
    }
    
    updateCountdown() {
        const now = new Date();
        
        if (now >= this.targetDate) {
            this.handleExpired();
            return;
        }
        
        // Berechne Monate und Tage
        const { months, days } = this.calculateMonthsAndDays(now, this.targetDate);
        
        // Update display
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        
        // Add urgent styling when less than 1 month
        if (months === 0 && days <= 30) {
            this.container.classList.add('countdown-urgent');
        }
        
        // Track countdown milestones
        this.trackMilestones(months, days);
    }
    
    calculateMonthsAndDays(startDate, endDate) {
        let months = 0;
        let currentDate = new Date(startDate);
        
        // Count full months
        while (currentDate.getMonth() !== endDate.getMonth() || 
               currentDate.getFullYear() !== endDate.getFullYear()) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            if (currentDate <= endDate) {
                months++;
            } else {
                currentDate.setMonth(currentDate.getMonth() - 1);
                break;
            }
        }
        
        // Calculate remaining days
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        return { months, days };
    }
    
    startCountdown() {
        // Update every hour (weniger frequent da nur Monate/Tage)
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000 * 60 * 60); // Every hour
        
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
    
    trackMilestones(months, days) {
        // Track significant milestones for months/days
        if (days === 0) { // Volle Monate
            const milestones = [6, 3, 2, 1];
            milestones.forEach(milestone => {
                if (months === milestone) {
                    if (typeof trackEvent === 'function') {
                        trackEvent('countdown_milestone', 'App_Launch', `${milestone}_months_remaining`);
                    }
                }
            });
        }
        
        // Track when less than 30 days
        if (months === 0 && [30, 14, 7, 1].includes(days)) {
            if (typeof trackEvent === 'function') {
                trackEvent('countdown_milestone', 'App_Launch', `${days}_days_remaining`);
            }
        }
    }
    
    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// =============================================================================
// COUNTDOWN STYLES (Angepasst für Monate/Tage)
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
            gap: 2rem;
            margin: 2rem 0;
            position: relative;
            z-index: 2;
        }
        
        .countdown-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 100px;
        }
        
        .countdown-number {
            font-size: 3.5rem;
            font-weight: 900;
            color: #FFD700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .countdown-label {
            font-size: 1rem;
            color: rgba(255,255,255,0.8);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        
        .countdown-separator {
            font-size: 2.5rem;
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
            font-size: 4rem;
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
                gap: 1rem;
            }
            
            .countdown-item {
                min-width: 80px;
            }
            
            .countdown-number {
                font-size: 2.5rem;
            }
            
            .countdown-label {
                font-size: 0.8rem;
            }
            
            .countdown-separator {
                font-size: 1.8rem;
            }
        }
        
        @media (max-width: 480px) {
            .countdown-display {
                flex-direction: column;
                gap: 1rem;
            }
            
            .countdown-separator {
                display: none;
            }
            
            .countdown-number {
                font-size: 3rem;
            }
            
            .countdown-label {
                font-size: 0.9rem;
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
    // Target: 21. November 2025, 00:00:00
    const targetDate = '2025-11-21T00:00:00';
    
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
