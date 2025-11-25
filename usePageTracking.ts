// usePageTracking.ts
// Hook für cookieless UTM Tracking zu Google Sheet

import { useEffect } from 'react';

// Google Apps Script URL für Page View Tracking
const TRACKING_SCRIPT_URL = 'DEINE_TRACKING_SCRIPT_URL_HIER'; // ← Wird noch erstellt!

interface PageViewData {
  timestamp: string;
  page: string;
  referrer: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  device: 'mobile' | 'desktop';
  userAgent: string;
}

export const usePageTracking = () => {
  useEffect(() => {
    const trackPageView = async () => {
      // URL Parameter auslesen
      const params = new URLSearchParams(window.location.search);
      
      // UTM Parameter extrahieren
      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const utmContent = params.get('utm_content');
      
      // UTM in Session Storage speichern (für Conversion Tracking)
      if (utmSource || utmMedium || utmCampaign) {
        sessionStorage.setItem('fitfoundry_utm', JSON.stringify({
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
          content: utmContent
        }));
      }
      
      // Device Detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Page View Daten sammeln
      const data: PageViewData = {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        device: isMobile ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent
      };
      
      // Zu Google Sheet senden (fire and forget)
      try {
        const body = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          body.append(key, value?.toString() || '');
        });
        
        fetch(TRACKING_SCRIPT_URL, {
          method: 'POST',
          body: body
        }).catch(e => console.debug('Tracking failed', e));
        
      } catch (e) {
        console.debug('Tracking error', e);
      }
    };
    
    // Track beim Mount
    trackPageView();
    
  }, []); // Nur einmal pro Seitenaufruf
};