type GtagEvent = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  // Meta Pixel — map common conversion events
  if (typeof window.fbq === 'function') {
    if (name === 'lead_submit') {
      window.fbq('track', 'Lead', params);
    } else if (name === 'whatsapp_click') {
      window.fbq('track', 'Contact', params);
    } else {
      window.fbq('trackCustom', name, params);
    }
  }
}
