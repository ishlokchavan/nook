/**
 * Hand-written types mirroring the Milestone 2 schema (supabase/migrations).
 * When sign-in lands and the DB is stable we can replace these with
 * `supabase gen types`, but these keep the app fully typed in the meantime.
 */

export type UserRole = "client" | "supplier" | "admin";
export type SupplierType = "carpenter" | "contractor" | "designer";
export type ModerationStatus = "pending" | "approved" | "rejected";

export interface SupplierSummary {
  profileId: string;
  type: SupplierType;
  handle: string;
  areas: string[];
  bio: string | null;
  verified: boolean;
  ratingAvg: number;
  ratingCount: number;
}

export interface FeedPost {
  id: string;
  imagePath: string;
  roomType: string | null;
  finish: string | null;
  tags: string[];
  area: string | null;
  sqft: number | null;
  createdAt: string;
  supplier: SupplierSummary;
}

export interface FeedFilters {
  type?: SupplierType;
  area?: string;
  q?: string;
}

/** Human label for a supplier type. */
export const SUPPLIER_TYPE_LABEL: Record<SupplierType, string> = {
  carpenter: "Carpenter",
  contractor: "Contractor",
  designer: "Interior designer",
};
