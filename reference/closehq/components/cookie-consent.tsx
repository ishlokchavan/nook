'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type ConsentState = { analytics: boolean; ts: number } | null;

const STORAGE_KEY = 'iclose_consent_v1';

function loadConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean) {
  const state: ConsentState = { analytics, ts: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function initAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

  if (gaId && !document.getElementById('ga4-script')) {
    const s = document.createElement('script');
    s.id = 'ga4-script';
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    s.async = true;
    document.head.appendChild(s);
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true });
  }

  if (pixelId && /^\d+$/.test(pixelId) && !(window as any).fbq) {
    const n: any = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    (window as any).fbq = n;
    if (!(window as any)._fbq) (window as any)._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(s);
    n('init', pixelId);
    n('track', 'PageView');
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const consent = loadConsent();
    if (!consent) {
      setVisible(true);
    } else if (consent.analytics) {
      initAnalytics();
    }

    // Allow footer "Cookie settings" link to reopen banner
    const handler = () => setSettingsOpen(true);
    window.addEventListener('iclose:open-cookie-settings', handler);
    return () => window.removeEventListener('iclose:open-cookie-settings', handler);
  }, []);

  const accept = () => {
    saveConsent(true);
    initAnalytics();
    setVisible(false);
    setSettingsOpen(false);
  };

  const decline = () => {
    saveConsent(false);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible && !settingsOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-2xl mx-auto bg-ink text-paper rounded-2xl px-6 py-5 shadow-2xl flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="flex-1 text-[14px] leading-[1.55] text-paper/80" style={{ letterSpacing: '-0.008em' }}>
          We use cookies to improve your experience and analyse site traffic. Essential cookies are always on.{' '}
          <a href="/privacy" className="text-paper underline underline-offset-2 hover:text-paper/70 transition-colors">
            Privacy Policy
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-[14px] text-paper/60 hover:text-paper transition-colors px-3 py-2 rounded-lg"
          >
            Essential only
          </button>
          <button
            onClick={accept}
            className="text-[14px] font-medium bg-paper text-ink px-4 py-2 rounded-full hover:bg-paper/90 transition-colors"
          >
            Accept all
          </button>
          <button
            onClick={decline}
            aria-label="Close"
            className="text-paper/40 hover:text-paper transition-colors ml-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
