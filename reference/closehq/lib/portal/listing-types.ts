/** A listing resolved for a single locale (translation already applied). */
export interface Listing {
  id: string;
  reference: string;
  title: string;
  description: string;
  purpose: 'sale' | 'rent';
  completion: 'ready' | 'off_plan';
  category: 'residential' | 'commercial';
  propertyType: 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'plot' | 'office' | 'retail';
  /** Listing origin — owner/POA self-listing vs developer/agent listing. */
  source: 'owner' | 'developer';
  city: string;
  community: string | null;
  building: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  priceAed: number;
  isVerified: boolean;
  coverImageUrl: string | null;
  amenities: string[];
  latitude?: number | null;
  longitude?: number | null;
  /** Off-plan / new-project fields (null for ready secondary listings). */
  handoverBy?: string | null;
  paymentPlan?: string | null;
  developerName?: string | null;
  developerLogo?: string | null;
  /** Listing agent / agency (for the agent-agency filter; null for owner-only). */
  agentName?: string | null;
  agencyName?: string | null;
}

export interface ListingFilters {
  purpose?: 'sale' | 'rent';
  completion?: 'ready' | 'off_plan';
  /** Free-text query (community / building / city). */
  q?: string;
  limit?: number;
}
