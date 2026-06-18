import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, Star } from "lucide-react";

import { LockedContact } from "@/components/feed/locked-contact";
import { Pill } from "@/components/ui/pill";
import { getPostById } from "@/lib/data/feed";
import { createClient } from "@/lib/supabase/server";
import { SUPPLIER_TYPE_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const backHref = `/app/post/${id}`;

  return (
    <div className="pb-8">
      {/* Full-bleed hero with a floating back button */}
      <div className="relative aspect-[4/5] w-full bg-secondary">
        <Image
          src={post.imagePath}
          alt={`${post.roomType ?? "Project"} by ${post.supplier.handle}`}
          fill
          sizes="(max-width: 520px) 100vw, 520px"
          className="object-cover"
          priority
        />
        <div className="lg-scrim-t absolute inset-x-0 top-0 h-24" />
        <Link
          href="/app"
          aria-label="Back"
          className="lg-glass-light absolute left-4 top-[max(16px,env(safe-area-inset-top))] flex size-10 items-center justify-center rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Link>
      </div>

      {/* Content sheet rising over the image */}
      <div className="relative -mt-6 rounded-t-3xl bg-card px-5 pt-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="flex items-center gap-1.5 text-xl font-bold tracking-tight">
              <span className="truncate">{post.supplier.handle}</span>
              {post.supplier.verified && (
                <BadgeCheck className="size-5 shrink-0 text-primary" aria-label="Verified" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {SUPPLIER_TYPE_LABEL[post.supplier.type]}
              {post.supplier.areas.length > 0 && ` · ${post.supplier.areas.join(", ")}`}
            </p>
          </div>
          {post.supplier.ratingCount > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
              <Star className="size-4 fill-primary text-primary" />
              {post.supplier.ratingAvg.toFixed(1)}
              <span className="text-muted-foreground">({post.supplier.ratingCount})</span>
            </span>
          )}
        </div>

        {post.supplier.bio && (
          <p className="mt-3 text-sm text-muted-foreground">{post.supplier.bio}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {post.roomType && <Pill variant="honey">{post.roomType}</Pill>}
          {post.finish && <Pill>{post.finish}</Pill>}
          {post.area && <Pill variant="outline">{post.area}</Pill>}
          {post.sqft && <Pill variant="outline">{post.sqft} sqft</Pill>}
          {post.tags.map((t) => (
            <Pill key={t} variant="outline">
              #{t}
            </Pill>
          ))}
        </div>

        <div className="mt-6">
          <LockedContact
            supplierId={post.supplier.profileId}
            isSignedIn={!!user}
            backHref={backHref}
          />
        </div>
      </div>
    </div>
  );
}
