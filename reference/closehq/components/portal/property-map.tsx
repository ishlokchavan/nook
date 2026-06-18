'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { Listing } from '@/lib/portal/listing-types';

const DUBAI = { lat: 25.15, lng: 55.27 };

function priceShort(n: number): string {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;
}

/** Whether Google Maps is configured (public key present at build). */
export const MAPS_ENABLED = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

/** Interactive Google Map with price-pin markers (Property Finder pattern). */
export function PropertyMap({ listings }: { listings: Listing[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';
  const [active, setActive] = useState<Listing | null>(null);

  const pins = listings.filter((l) => l.latitude != null && l.longitude != null);
  if (!apiKey) return null;

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId={mapId}
        defaultCenter={DUBAI}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI={false}
        className="h-full w-full"
      >
        {pins.map((l) => (
          <AdvancedMarker
            key={l.id}
            position={{ lat: l.latitude as number, lng: l.longitude as number }}
            onClick={() => setActive(l)}
          >
            <span className="rounded-full bg-accent text-white text-[12px] font-medium px-2.5 py-1 shadow-card whitespace-nowrap">
              From {priceShort(l.priceAed)}
            </span>
          </AdvancedMarker>
        ))}

        {active && active.latitude != null && active.longitude != null && (
          <InfoWindow
            position={{ lat: active.latitude, lng: active.longitude }}
            onCloseClick={() => setActive(null)}
            pixelOffset={[0, -36]}
          >
            <Link href={`/properties/${active.reference}`} className="block w-48">
              <div className="text-[14px] font-semibold text-ink">AED {active.priceAed.toLocaleString('en-US')}</div>
              <div className="text-[12px] text-graphite mt-0.5 line-clamp-1">{active.title}</div>
              <div className="text-[11px] text-graphite mt-0.5">{[active.building, active.community].filter(Boolean).join(', ')}</div>
            </Link>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
