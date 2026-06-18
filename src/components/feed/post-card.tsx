import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Lock, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SUPPLIER_TYPE_LABEL, type FeedPost } from "@/lib/types";

/**
 * A single feed card: full-bleed project image with an anonymous handle and a
 * "Contact locked" affordance, tapping through to the post detail. The locked
 * chip is the visible promise of the core product rule.
 */
export function PostCard({ post, priority = false }: { post: FeedPost; priority?: boolean }) {
  return (
    <Link href={`/app/post/${post.id}`} className="block">
      <Card className="overflow-hidden transition-transform active:scale-[0.99]">
        <div className="relative aspect-[4/5] w-full bg-secondary">
          <Image
            src={post.imagePath}
            alt={`${post.roomType ?? "Project"} by ${post.supplier.handle}`}
            fill
            sizes="(max-width: 520px) 100vw, 480px"
            className="object-cover"
            priority={priority}
          />
          <div className="lg-scrim-b absolute inset-x-0 bottom-0 h-2/5" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-sm font-semibold text-white">
                <span className="truncate">{post.supplier.handle}</span>
                {post.supplier.verified && (
                  <BadgeCheck className="size-3.5 shrink-0 text-white" aria-label="Verified" />
                )}
              </p>
              <p className="truncate text-xs text-white/80">
                {SUPPLIER_TYPE_LABEL[post.supplier.type]}
              </p>
            </div>
            <span className="lg-glass-dark flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white">
              <Lock className="size-3" /> Locked
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 p-4">
          {post.roomType && <Pill variant="honey">{post.roomType}</Pill>}
          {post.area && <Pill>{post.area}</Pill>}
          {post.finish && <Pill variant="outline">{post.finish}</Pill>}
          {post.supplier.ratingCount > 0 && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-primary text-primary" />
              {post.supplier.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
