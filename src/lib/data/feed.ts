import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { FeedFilters, FeedPost } from "@/lib/types";

// Shape returned by the nested PostgREST select below.
interface RawPost {
  id: string;
  image_path: string;
  room_type: string | null;
  finish: string | null;
  tags: string[] | null;
  area: string | null;
  sqft: number | null;
  created_at: string;
  supplier: {
    profile_id: string;
    type: FeedPost["supplier"]["type"];
    areas: string[] | null;
    bio: string | null;
    verified: boolean;
    rating_avg: number;
    rating_count: number;
    profile: { display_handle: string } | null;
  } | null;
}

const POST_SELECT = `
  id, image_path, room_type, finish, tags, area, sqft, created_at,
  supplier:suppliers!inner (
    profile_id, type, areas, bio, verified, rating_avg, rating_count,
    profile:profiles!inner ( display_handle )
  )
`;

function mapPost(row: RawPost): FeedPost | null {
  if (!row.supplier?.profile) return null;
  return {
    id: row.id,
    imagePath: row.image_path,
    roomType: row.room_type,
    finish: row.finish,
    tags: row.tags ?? [],
    area: row.area,
    sqft: row.sqft,
    createdAt: row.created_at,
    supplier: {
      profileId: row.supplier.profile_id,
      type: row.supplier.type,
      handle: row.supplier.profile.display_handle,
      areas: row.supplier.areas ?? [],
      bio: row.supplier.bio,
      verified: row.supplier.verified,
      ratingAvg: Number(row.supplier.rating_avg),
      ratingCount: row.supplier.rating_count,
    },
  };
}

/**
 * Approved posts for the public feed, newest first, with optional filters.
 * Returns [] on any error (e.g. tables not created yet) so the app shell
 * always renders an empty state rather than crashing.
 */
export async function getFeed(filters: FeedFilters = {}): Promise<FeedPost[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(40);

    if (filters.type) query = query.eq("supplier.type", filters.type);
    if (filters.area) query = query.ilike("area", `%${filters.area}%`);
    if (filters.q) {
      query = query.or(
        `room_type.ilike.%${filters.q}%,finish.ilike.%${filters.q}%,area.ilike.%${filters.q}%`,
      );
    }

    const { data, error } = await query.returns<RawPost[]>();
    if (error) return [];
    return (data ?? []).map(mapPost).filter((p): p is FeedPost => p !== null);
  } catch {
    return [];
  }
}

/** A single post by id (or null if missing / not yet approved). */
export async function getPostById(id: string): Promise<FeedPost | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(POST_SELECT)
      .eq("id", id)
      .maybeSingle()
      .returns<RawPost>();
    if (error || !data) return null;
    return mapPost(data);
  } catch {
    return null;
  }
}
