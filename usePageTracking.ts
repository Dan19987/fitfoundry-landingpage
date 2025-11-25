// usePageTracking.ts
import { useEffect } from 'react';

const TRACKING_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbx1BKhF9XWZYX739HqnYbDH3n9DbjATcHQMSjolwrGRHz1HeF4RQ2FABaJGo44AJ2M/exec';

// exakt derselbe wie in PageViewTracking.gs
const PAGEVIEW_TOKEN = 'FitFoundry$2025!PageView#Tracking';

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
      const params = new URLSearchParams(window.location.search);

      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const utmContent = params.get('utm_content');

      // UTM im Session Storage parken
      if (utmSource || utmMedium || utmCampaign) {
        sessionStorage.setItem(
          'fitfoundry_utm',
          JSON.stringify({
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
            content: utmContent,
          }),
        );
      }

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const data: PageViewData = {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer || 'direct',
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        device: isMobile ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent,
      };

      try {
        const body = new URLSearchParams();

        // **Token hinzufügen**
        body.append('token', PAGEVIEW_TOKEN);

        Object.entries(data).forEach(([key, value]) => {
          body.append(key, value?.toString() || '');
        });

        fetch(TRACKING_SCRIPT_URL, {
          method: 'POST',
          body,
        }).catch((e) => console.debug('Tracking failed', e));
      } catch (e) {
        console.debug('Tracking error', e);
      }
    };

    trackPageView();
  }, []);
};
