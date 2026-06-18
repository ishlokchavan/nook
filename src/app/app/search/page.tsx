import { Search } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";

const FILTERS = ["Carpenter", "Contractor", "Designer", "Kitchen", "Living", "Bathroom", "Dubai Marina", "Downtown"];

export default function SearchScreen() {
  return (
    <div>
      <ScreenHeader title="Search" subtitle="Filter by trade, room and area" />
      <div className="flex flex-col gap-4 px-4 pt-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects, finishes, areas…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Pill key={f} variant="outline" className="cursor-pointer">
              {f}
            </Pill>
          ))}
        </div>
        <p className="pt-8 text-center text-sm text-muted-foreground">
          Results will appear here once the feed is wired to the database.
        </p>
      </div>
    </div>
  );
}
