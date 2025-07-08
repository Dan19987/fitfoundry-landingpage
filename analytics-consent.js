/**
 * FitFoundry Analytics Consent Manager
 * DSGVO-konforme Google Analytics 4 Integration
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        GA_ID: 'G-08FBC0TKGP',
        CONSENT_COOKIE: 'fitfoundry_analytics_consent',
        CONSENT_VERSION: 'v1',
        COOKIE_DURATION: 365, // days
        BANNER_HIDE_DURATION: 30 // days to hide banner after decision
    };
    
    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        initAnalyticsConsent();
    });
    
    /**
     * Initialize the analytics consent system
     */
    function initAnalyticsConsent() {
        const consentStatus = getConsentStatus();
        
        if (consentStatus === null) {
            // No consent decision made yet - show banner
            showConsentBanner();
        } else if (consentStatus === 'accepted') {
            // Consent given - initialize analytics
            initializeAnalytics();
            hideConsentBanner();
        } else {
            // Consent declined - ensure analytics is disabled
            disableAnalytics();
            hideConsentBanner();
        }
        
        // Check if banner should be reshown (after 30 days)
        checkBannerExpiry();
    }
    
    /**
     * Get current consent status from localStorage
     */
    function getConsentStatus() {
        try {
            const consent = localStorage.getItem(CONFIG.CONSENT_COOKIE);
            return consent;
        } catch (e) {
            console.warn('Could not access localStorage for consent status');
            return null;
        }
    }
    
    /**
     * Set consent status in localStorage
     */
    function setConsentStatus(status) {
        try {
            localStorage.setItem(CONFIG.CONSENT_COOKIE, status);
            localStorage.setItem(CONFIG.CONSENT_COOKIE + '_timestamp', Date.now().toString());
            localStorage.setItem(CONFIG.CONSENT_COOKIE + '_version', CONFIG.CONSENT_VERSION);
        } catch (e) {
            console.warn('Could not save consent status to localStorage');
        }
    }
    
    /**
     * Show the consent banner
     */
    function showConsentBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.style.display = 'block';
            
            // Add animation
            setTimeout(() => {
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            }, 100);
            
            // Track banner shown event
            trackEvent('consent_banner_shown', 'Privacy', 'initial_load');
        }
    }
    
    /**
     * Hide the consent banner
     */
    function hideConsentBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * Accept cookies and initialize analytics
     */
    window.acceptCookies = function() {
        setConsentStatus('accepted');
        initializeAnalytics();
        hideConsentBanner();
        
        // Track consent acceptance
        trackEvent('consent_accepted', 'Privacy', window.location.pathname);
        
        // Show confirmation message
        showConsentMessage('✅ Danke! Analytics aktiviert für bessere Website-Erfahrung.', 'success');
    };
    
    /**
     * Decline cookies and disable analytics
     */
    window.declineCookies = function() {
        setConsentStatus('declined');
        disableAnalytics();
        hideConsentBanner();
        
        // Track consent decline (if possible)
        console.log('Analytics consent declined');
        
        // Show confirmation message
        showConsentMessage('✅ Deine Entscheidung wurde gespeichert. Keine Analytics-Cookies.', 'info');
    };
    
    /**
     * Initialize Google Analytics 4
     */
    function initializeAnalytics() {
        // Check if gtag is already loaded
        if (typeof gtag === 'undefined') {
            loadGoogleAnalytics();
        } else {
            configureAnalytics();
        }
    }
    
    /**
     * Load Google Analytics script
     */
    function loadGoogleAnalytics() {
        // Create and load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.GA_ID}`;
        
        script.onload = function() {
            configureAnalytics();
        };
        
        script.onerror = function() {
            console.warn('Could not load Google Analytics');
        };
        
        document.head.appendChild(script);
        
        // Initialize gtag function
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function() {
            dataLayer.push(arguments);
        };
    }
    
    /**
     * Configure Google Analytics with privacy settings
     */
    function configureAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('js', new Date());
            
            gtag('config', CONFIG.GA_ID, {
                // Privacy-focused configuration
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false,
                cookie_flags: 'SameSite=Strict;Secure',
                cookie_expires: CONFIG.COOKIE_DURATION * 24 * 60 * 60, // Convert to seconds
                
                // Custom dimensions for better tracking
                custom_map: {
                    'page_type': 'custom_dimension_1',
                    'user_engagement': 'custom_dimension_2'
                },
                
                // Enhanced measurement settings
                enhanced_measurement: {
                    scrolls: true,
                    outbound_clicks: true,
                    site_search: false,
                    video_engagement: false,
                    file_downloads: true
                }
            });
            
            // Track successful analytics initialization
            gtag('event', 'analytics_initialized', {
                event_category: 'System',
                event_label: window.location.pathname
            });
            
            console.log('✅ Google Analytics initialized with privacy settings');
        }
    }
    
    /**
     * Disable Google Analytics
     */
    function disableAnalytics() {
        // Set GA disable flag
        window[`ga-disable-${CONFIG.GA_ID}`] = true;
        
        // Clear any existing GA cookies
        clearGoogleAnalyticsCookies();
        
        console.log('❌ Google Analytics disabled');
    }
    
    /**
     * Clear Google Analytics cookies
     */
    function clearGoogleAnalyticsCookies() {
        const cookiesToClear = ['_ga', '_ga_' + CONFIG.GA_ID.replace('G-', ''), '_gid', '_gat'];
        
        cookiesToClear.forEach(cookieName => {
            // Clear cookie for current domain
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            
            // Clear cookie for parent domain
            const domain = window.location.hostname.split('.').slice(-2).join('.');
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
        });
    }
    
    /**
     * Enhanced tracking function with consent check
     */
    window.trackEvent = function(action, category = 'General', label = '', value = null) {
        // Only track if consent is given
        if (getConsentStatus() !== 'accepted') {
            return;
        }
        
        if (typeof gtag !== 'undefined') {
            const eventData = {
                event_category: category,
                event_label: label || window.location.pathname
            };
            
            if (value !== null) {
                eventData.value = value;
            }
            
            // Add custom dimensions
            eventData.page_type = getPageType();
            eventData.user_engagement = getUserEngagementLevel();
            
            gtag('event', action, eventData);
            
            // Debug logging in development
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
                console.log('📊 Event tracked:', action, eventData);
            }
        }
    };
    
    /**
     * Track page views with enhanced data
     */
    window.trackPageView = function(page_title = document.title, page_location = window.location.href) {
        if (getConsentStatus() !== 'accepted') {
            return;
        }
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: page_title,
                page_location: page_location,
                page_type: getPageType(),
                user_engagement: getUserEngagementLevel()
            });
        }
    };
    
    /**
     * Get page type for analytics
     */
    function getPageType() {
        const path = window.location.pathname;
        
        if (path === '/' || path === '/index.html') return 'homepage';
        if (path.includes('kontakt')) return 'contact';
        if (path.includes('impressum')) return 'legal';
        if (path.includes('datenschutz')) return 'privacy';
        if (path.includes('apple-watch')) return 'feature_apple_watch';
        if (path.includes('hautfaltenmessung')) return 'feature_body_fat';
        if (path.includes('deutsche-fitness')) return 'feature_privacy';
        
        return 'landing_page';
    }
    
    /**
     * Calculate user engagement level
     */
    function getUserEngagementLevel() {
        const timeOnPage = Date.now() - (window.fitfoundryPageLoadTime || Date.now());
        
        if (timeOnPage < 10000) return 'low'; // Less than 10 seconds
        if (timeOnPage < 60000) return 'medium'; // Less than 1 minute
        return 'high'; // More than 1 minute
    }
    
    /**
     * Show consent message
     */
    function showConsentMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `consent-message consent-${type}`;
        messageEl.textContent = message;
        
        // Styles
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#22c55e' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '10001',
            maxWidth: '300px',
            fontSize: '0.9rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 4000);
    }
    
    /**
     * Check if consent banner should be reshown
     */
    function checkBannerExpiry() {
        try {
            const timestamp = localStorage.getItem(CONFIG.CONSENT_COOKIE + '_timestamp');
            if (timestamp) {
                const daysSinceDecision = (Date.now() - parseInt(timestamp)) / (1000 * 60 * 60 * 24);
                
                if (daysSinceDecision > CONFIG.BANNER_HIDE_DURATION) {
                    // Clear old consent and show banner again
                    localStorage.removeItem(CONFIG.CONSENT_COOKIE);
                    localStorage.removeItem(CONFIG.CONSENT_COOKIE + '_timestamp');
                    localStorage.removeItem(CONFIG.CONSENT_COOKIE + '_version');
                    
                    setTimeout(() => {
                        showConsentBanner();
                    }, 2000); // Show after 2 seconds delay
                }
            }
        } catch (e) {
            console.warn('Could not check consent expiry');
        }
    }
    
    /**
     * Allow users to change their consent decision
     */
    window.changeConsent = function() {
        const currentConsent = getConsentStatus();
        const message = currentConsent === 'accepted' 
            ? 'Analytics ist aktiviert. Möchtest du es deaktivieren?' 
            : 'Analytics ist deaktiviert. Möchtest du es aktivieren?';
        
        if (confirm(message)) {
            if (currentConsent === 'accepted') {
                window.declineCookies();
            } else {
                window.acceptCookies();
            }
        }
    };
    
    // Track page load time
    window.fitfoundryPageLoadTime = Date.now();
    
    // Track when page becomes visible/hidden
    document.addEventListener('visibilitychange', function() {
        if (getConsentStatus() === 'accepted') {
            trackEvent(document.hidden ? 'page_hidden' : 'page_visible', 'Engagement');
        }
    });
    
    // Track page unload
    window.addEventListener('beforeunload', function() {
        if (getConsentStatus() === 'accepted') {
            const timeOnPage = Date.now() - window.fitfoundryPageLoadTime;
            trackEvent('page_unload', 'Engagement', 'time_on_page', Math.round(timeOnPage / 1000));
        }
    });
    
    console.log('🔒 FitFoundry Analytics Consent Manager loaded');
    
})();