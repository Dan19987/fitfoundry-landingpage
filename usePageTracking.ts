import { useEffect } from 'react';

const TRACKING_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycfa9JQLVeiLtCUSz3zz_DGfjWNbizcQXnYIb17F4d1_aho8D4GwzhOSOgZSZp1GZO/exec';
const PAGEVIEW_TOKEN = 'FitFoundry$2025!PageView#Tracking';

export const usePageTracking = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // URL Parameter auslesen
        const params = new URLSearchParams(window.location.search);
        const utmSource = params.get('utm_source');
        const utmMedium = params.get('utm_medium');
        const utmCampaign = params.get('utm_campaign');
        const utmContent = params.get('utm_content');
        
        // UTM im Session Storage speichern (für Newsletter)
        if (utmSource || utmMedium || utmCampaign) {
          sessionStorage.setItem(
            'fitfoundry_utm',
            JSON.stringify({
              source: utmSource,
              medium: utmMedium,
              campaign: utmCampaign,
              content: utmContent,
            })
          );
        }
        
        // Device Detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Request Body bauen
        const body = new URLSearchParams({
          token: PAGEVIEW_TOKEN,
          page: window.location.pathname,
          referrer: document.referrer || '(direct)',
          utm_source: utmSource || '-',
          utm_medium: utmMedium || '-',
          utm_campaign: utmCampaign || '-',
          utm_content: utmContent || '-',
          device: isMobile ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent
        });
        
        console.log('📊 Tracking PageView:', {
          page: window.location.pathname,
          utm_source: utmSource || '-'
        });
        
        // Fire and forget - keine await, blockiert nicht
        fetch(TRACKING_SCRIPT_URL, {
          method: 'POST',
          body: body
        })
          .then(res => res.json())
          .then(data => console.log('✅ Tracking Success:', data))
          .catch(e => console.debug('❌ Tracking failed:', e));
        
      } catch (error) {
        console.debug('Tracking error:', error);
      }
    };
    
    // Tracking ausführen
    trackPageView();
  }, []); // Nur einmal beim Mount
};
