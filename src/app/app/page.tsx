import { Lock } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

/**
 * Feed (Home tab) — placeholder layout for the Instagram-style project feed.
 * Real posts arrive in Milestone 3 once the schema + seed exist; for now this
 * shows the card shape, anonymous handle and the locked-contact affordance so
 * the app-shell experience is tangible.
 */
const PLACEHOLDERS = [
  { handle: "carpenter_568", type: "Carpenter", room: "Kitchen", area: "Dubai Marina", finish: "Walnut & brass" },
  { handle: "designer_204", type: "Interior designer", room: "Living room", area: "Downtown", finish: "Warm minimal" },
  { handle: "contractor_091", type: "Contractor", room: "Full villa", area: "Jumeirah", finish: "Turnkey reno" },
];

export default function FeedScreen() {
  return (
    <div>
      <ScreenHeader title="Discover" subtitle="Real Dubai interiors, anonymously" />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {PLACEHOLDERS.map((p, i) => (
          <Card
            key={p.handle}
            className="animate-fade-up overflow-hidden"
            style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
          >
            {/* Image placeholder with bottom scrim + handle */}
            <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-secondary to-muted">
              <div className="lg-scrim-b absolute inset-x-0 bottom-0 h-2/5" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{p.handle}</p>
                  <p className="text-xs text-white/80">{p.type}</p>
                </div>
                <span className="lg-glass-dark flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white">
                  <Lock className="size-3" /> Contact locked
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              <Pill variant="honey">{p.room}</Pill>
              <Pill>{p.area}</Pill>
              <Pill variant="outline">{p.finish}</Pill>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
