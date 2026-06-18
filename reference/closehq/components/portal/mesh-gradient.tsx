import { cn } from '@/lib/utils';

/**
 * Mesh-gradient wash matching the Figma mid-fi hero — soft blue / violet /
 * magenta blobs that fade to white in the centre (where the search card sits).
 * Pure CSS so it stays crisp at any size; no exported image needed.
 */
export function MeshGradient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute inset-0 blur-3xl"
        style={{
          background: [
            'radial-gradient(38% 50% at 82% 18%, rgba(56,108,255,0.85) 0%, rgba(56,108,255,0) 60%)',
            'radial-gradient(34% 46% at 90% 36%, rgba(124,58,237,0.80) 0%, rgba(124,58,237,0) 62%)',
            'radial-gradient(40% 52% at 12% 78%, rgba(124,58,237,0.70) 0%, rgba(124,58,237,0) 60%)',
            'radial-gradient(36% 48% at 4% 60%, rgba(255,45,85,0.65) 0%, rgba(255,45,85,0) 58%)',
            'radial-gradient(30% 40% at 22% 92%, rgba(56,108,255,0.55) 0%, rgba(56,108,255,0) 60%)',
          ].join(','),
        }}
      />
      {/* Soft white core so foreground text + card stay legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 45%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.4) 55%, rgba(255,255,255,0) 80%)',
        }}
      />
    </div>
  );
}
