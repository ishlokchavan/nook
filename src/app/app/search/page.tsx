import Link from "next/link";
import { Search } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { PostCard } from "@/components/feed/post-card";
import { Input } from "@/components/ui/input";
import { Pill } from "@/components/ui/pill";
import { getFeed } from "@/lib/data/feed";
import { SUPPLIER_TYPE_LABEL, type SupplierType } from "@/lib/types";

export const dynamic = "force-dynamic";

const TYPES: SupplierType[] = ["carpenter", "contractor", "designer"];
const AREAS = ["Dubai Marina", "Downtown", "Jumeirah", "Business Bay", "Palm Jumeirah"];

export default async function SearchScreen({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; area?: string }>;
}) {
  const sp = await searchParams;
  const type = TYPES.includes(sp.type as SupplierType)
    ? (sp.type as SupplierType)
    : undefined;
  const area = sp.area;
  const q = sp.q;

  const results = await getFeed({ type, area, q });

  // Build a query string while toggling one filter key.
  const toggle = (key: "type" | "area", value: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (area) params.set("area", area);
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    const s = params.toString();
    return `/app/search${s ? `?${s}` : ""}`;
  };

  return (
    <div>
      <ScreenHeader title="Search" subtitle="Filter by trade, area and finish" />
      <div className="flex flex-col gap-4 px-4 pt-2">
        <form action="/app/search" className="relative">
          {type && <input type="hidden" name="type" value={type} />}
          {area && <input type="hidden" name="area" value={area} />}
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search rooms, finishes, areas…"
            className="pl-9"
            aria-label="Search"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <Link key={t} href={toggle("type", t)}>
              <Pill variant={type === t ? "honey" : "outline"}>
                {SUPPLIER_TYPE_LABEL[t]}
              </Pill>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <Link key={a} href={toggle("area", a)}>
              <Pill variant={area === a ? "honey" : "default"}>{a}</Pill>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-5 pt-2">
          {results.length === 0 ? (
            <p className="pt-8 text-center text-sm text-muted-foreground">
              No projects match these filters.
            </p>
          ) : (
            results.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
