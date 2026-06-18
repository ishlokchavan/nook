/**
 * Instant skeleton shown while the property route resolves on the server.
 * Mirrors the image-first detail layout so the transition feels native — the
 * screen appears immediately, then fills in.
 */
export default function PropertyLoading() {
  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-paper">
      {/* Media area */}
      <div className="h-[60%] w-full animate-pulse bg-ink/[0.07]" />

      {/* Info block */}
      <div className="space-y-3 px-4 pt-5">
        <div className="h-7 w-44 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-ink/[0.07]" />
        <div className="flex gap-3 pt-3">
          <div className="h-12 flex-1 animate-pulse rounded-full bg-ink/[0.07]" />
          <div className="h-12 flex-1 animate-pulse rounded-full bg-ink/[0.07]" />
        </div>
      </div>
    </div>
  );
}
