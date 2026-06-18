/**
 * Developer directory — real Dubai developer data (source: Proffer dataset),
 * with cashback rebranded as iClose **credits** per the platform's compliance
 * model (credits, not cashback). Mirrors the planned Supabase `developers`
 * table so the page is data-driven and swaps to a live query with no UI change.
 *
 * Ordering: `private_top` (hyped) first, then `private`, then `government`.
 * Government / state-linked developers hide the credit pill and show
 * "Request details" instead.
 *
 * Logos/banners point at the dataset CDN for now; replace with owned assets
 * (or a managed `developers` table) later. More fields can be added over time.
 */

const CDN = 'https://d1fikckodunwer.cloudfront.net/';

export type DeveloperTier = 'private_top' | 'private' | 'government';

export interface Developer {
  slug: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  tier: DeveloperTier;
  foundedYear: number | null;
  /** Active projects (numberOfProjects). */
  projects: number;
  /** Available units across active projects. */
  units: number;
  /** Lowest available price across projects, AED. */
  minPriceAed: number;
  /** Headline credits %, null for government / where not disclosed. */
  creditPct: number | null;
  website: string | null;
  tagline: string;
  sortWeight: number;
}

const TIER_ORDER: Record<DeveloperTier, number> = { private_top: 0, private: 1, government: 2 };

const DEVELOPERS: Developer[] = [
  // ── Featured / hyped ──────────────────────────────────────────────
  { slug: '5f82618a-553c-4bde-9820-faff376475fb', name: 'Emaar', logoUrl: `${CDN}ab386226-e1de-42ed-865d-c5e9d810be04`, bannerUrl: `${CDN}ff8409d0-6c92-4a9c-9f37-a7e04d1e010f`, tier: 'private_top', foundedYear: 1997, projects: 44, units: 324, minPriceAed: 1615888, creditPct: 1, website: 'https://properties.emaar.com', tagline: 'Master developer behind Burj Khalifa, Dubai Marina and Dubai Hills.', sortWeight: 10 },
  { slug: '4108867f-d587-4836-a62c-9614a18ef470', name: 'DAMAC', logoUrl: `${CDN}54092b14-60e7-4dbc-b8e9-ed055c182f7d`, bannerUrl: `${CDN}4c7fb960-e841-419d-8d30-31466a4027fb`, tier: 'private_top', foundedYear: 2002, projects: 5, units: 56, minPriceAed: 1172000, creditPct: 1.5, website: 'https://www.damacproperties.com', tagline: 'Luxury master communities including DAMAC Hills and Lagoons.', sortWeight: 20 },
  { slug: '47fd86f6-bb89-4c1c-beb7-f4810cd09e08', name: 'Sobha Realty', logoUrl: `${CDN}02a5bb1a-6091-461d-925b-5a698e6c569c`, bannerUrl: `${CDN}59a585fe-2677-4f61-8e1a-2f121422f212`, tier: 'private_top', foundedYear: 1976, projects: 18, units: 1989, minPriceAed: 1060383, creditPct: 2, website: 'https://sobharealty.com', tagline: 'Vertically integrated developer of Sobha Hartland and beyond.', sortWeight: 30 },
  { slug: 'c57fd6c2-7530-46a9-bbad-c1404a2386c0', name: 'Binghatti', logoUrl: `${CDN}3f042de8-1ed3-4265-a61b-133d284d6c16`, bannerUrl: `${CDN}d77ff96c-9b5b-4390-a719-b3bcd0c056e5`, tier: 'private_top', foundedYear: 2008, projects: 35, units: 4309, minPriceAed: 687999, creditPct: 1.5, website: 'https://www.binghatti.com/en/', tagline: 'Design-led branded residences across central Dubai.', sortWeight: 40 },
  { slug: '59e8a547-1efb-4e9a-8524-e8834a34e6e7', name: 'Danube', logoUrl: `${CDN}dfba4718-86d8-4ce3-95cd-5ec4332c4cb2`, bannerUrl: `${CDN}224d26df-a193-4318-84c2-7226bd5b0a9c`, tier: 'private_top', foundedYear: 1993, projects: 12, units: 1071, minPriceAed: 865000, creditPct: 1.5, website: 'https://danubeproperties.com', tagline: 'High-volume residential communities with flexible plans.', sortWeight: 50 },
  { slug: 'c1ee80f8-de12-48cd-a085-d29b02d88856', name: 'Ellington', logoUrl: `${CDN}f619b342-9a9e-42f8-89a5-f17b7d7af899`, bannerUrl: `${CDN}6b644fd6-0899-4458-b440-a35c5a2d7631`, tier: 'private_top', foundedYear: 2014, projects: 17, units: 138, minPriceAed: 1769828, creditPct: 1.5, website: 'https://ellingtonproperties.ae/en', tagline: 'Boutique, design-focused residences in prime districts.', sortWeight: 60 },
  { slug: '72d908cd-6b85-4679-a8a2-cd4014609a9c', name: 'Samana', logoUrl: `${CDN}73534604-b491-4dec-8508-974f6384e35f`, bannerUrl: `${CDN}486def8b-10a1-449f-9eb3-38c9e1748610`, tier: 'private_top', foundedYear: 2018, projects: 20, units: 962, minPriceAed: 571160, creditPct: 1.5, website: 'https://www.samanadevelopers.com/', tagline: 'Lifestyle developments with private resort-style amenities.', sortWeight: 70 },
  { slug: 'af3dadd9-fe19-4927-9661-8113df17e9e2', name: 'Azizi', logoUrl: `${CDN}e47e8bcb-59fd-4cd9-8f90-6dfab3a057e2`, bannerUrl: `${CDN}ffab2802-f05c-4ce8-8de9-f0b8d0b98e06`, tier: 'private_top', foundedYear: 2007, projects: 22, units: 3691, minPriceAed: 687000, creditPct: 2, website: 'https://www.azizidevelopments.com', tagline: 'Large-scale communities including Riviera and Venice.', sortWeight: 80 },

  // ── Private ───────────────────────────────────────────────────────
  { slug: '78f29c94-ecb8-464b-8fc3-9715a7a2dd55', name: 'Arada', logoUrl: `${CDN}d24498d2-c623-476a-a82f-63ded0bfb59a`, bannerUrl: `${CDN}d70ba322-74b1-4b67-9dc4-dbab8848259c`, tier: 'private', foundedYear: 2017, projects: 1, units: 44, minPriceAed: 3879000, creditPct: 1.5, website: 'https://www.arada.com/', tagline: 'Sustainable, human-centric communities across the UAE.', sortWeight: 10 },
  { slug: 'a8acc3b2-50f7-431b-9b3b-e440c95fe5e6', name: 'Object 1', logoUrl: `${CDN}c38a4e92-f4bd-4b82-9ffb-f627f7c09f3b`, bannerUrl: `${CDN}19afe4aa-f2d9-42b1-83a6-a887a81d4044`, tier: 'private', foundedYear: 2010, projects: 13, units: 1218, minPriceAed: 635000, creditPct: 2, website: 'https://www.object-1.com/', tagline: 'Architecture-led, integrated living environments.', sortWeight: 20 },
  { slug: '625175c9-e5d6-4bc8-91c9-cdabe32213ce', name: 'Reportage', logoUrl: `${CDN}1e371b84-c6a3-42f8-b8a4-145b04bde27f`, bannerUrl: `${CDN}73183834-22f8-4eb1-911a-60b3804a8897`, tier: 'private', foundedYear: 2014, projects: 5, units: 384, minPriceAed: 528561, creditPct: 1.5, website: 'https://reportageuae.com', tagline: 'Value-driven mid-market residential across the UAE.', sortWeight: 30 },
  { slug: '97147235-42eb-4945-88f4-9623d4799b0e', name: 'Tiger Group', logoUrl: `${CDN}65c7520d-77be-4aa0-9dad-509d53306e07`, bannerUrl: `${CDN}8e5a559b-6bee-444a-826e-2937ed809a41`, tier: 'private', foundedYear: 1976, projects: 15, units: 466, minPriceAed: 545089, creditPct: 2, website: 'https://www.tigergroup.ae/', tagline: 'Established developer behind Tiger Sky Tower.', sortWeight: 40 },
  { slug: '7a061cf8-49c8-4346-850a-239572566315', name: 'Prestige One', logoUrl: `${CDN}0b62a4f8-ea35-41ce-b6a4-5603d2abb774`, bannerUrl: `${CDN}b0efbb49-1f37-4efe-bf5e-fb29af56638f`, tier: 'private', foundedYear: 2023, projects: 8, units: 229, minPriceAed: 645000, creditPct: 1.5, website: 'https://prestigeone.ae/', tagline: 'Boutique, wellness-focused residential projects.', sortWeight: 50 },
  { slug: 'c030615b-b792-4786-b146-1c15275fe218', name: 'Octa Properties', logoUrl: `${CDN}2b810861-ed6d-4fa1-adc6-db3a7f08a668`, bannerUrl: `${CDN}259ec764-b496-49ee-b3da-588217595d86`, tier: 'private', foundedYear: 2021, projects: 11, units: 209, minPriceAed: 785000, creditPct: 1, website: 'https://www.octaproperties.com/', tagline: 'Premium branded residences in prime locations.', sortWeight: 60 },
  { slug: 'ffbfd5b0-b92a-4b1c-8e41-55048f571dfa', name: 'Mira Developments', logoUrl: `${CDN}51619782-a73d-4af2-959a-fb164b73f830`, bannerUrl: `${CDN}be1532ec-eb2d-4ffc-b149-39feea89b806`, tier: 'private', foundedYear: 2020, projects: 2, units: 42, minPriceAed: 926300, creditPct: 1, website: 'https://miradevelopments.ae', tagline: 'Branded, fully-furnished design-led homes.', sortWeight: 70 },
  { slug: '06b06c5d-7979-46fc-b04e-f8b01aa461c9', name: 'Vincitore', logoUrl: `${CDN}e9d7bbb2-7561-4aa3-9dc6-1412f541ffb4`, bannerUrl: `${CDN}49d6bf62-a0ed-47cd-8890-bb7b6d2c6070`, tier: 'private', foundedYear: 2013, projects: 2, units: 66, minPriceAed: 930000, creditPct: 1.5, website: 'https://vincitorerealty.com', tagline: 'European-inspired, wellness-focused luxury.', sortWeight: 80 },
  { slug: '289c63b2-bbb4-4a81-90cd-44a7b950f870', name: 'Beyond (Omniyat)', logoUrl: `${CDN}abbf8a20-0938-4147-a940-efd1dac0eb1c`, bannerUrl: `${CDN}f6b65dd6-709e-4595-af45-8ec56b3e36ea`, tier: 'private', foundedYear: 2024, projects: 4, units: 36, minPriceAed: 2937000, creditPct: 1.5, website: 'https://beyonddevelopments.ae/', tagline: 'Luxury waterfront living by the OMNIYAT group.', sortWeight: 90 },

  // ── Government / state-linked (credits hidden) ────────────────────
  { slug: '72c0169c-fd8f-4f20-a90b-23f1aff6cf23', name: 'Aldar', logoUrl: `${CDN}e808f446-2eac-41e3-a0df-3e0849fd64ba`, bannerUrl: `${CDN}4d9b9c0d-e9a8-40ce-bc1a-2ce728a75032`, tier: 'government', foundedYear: 2005, projects: 4, units: 36, minPriceAed: 5158200, creditPct: null, website: 'https://www.aldar.com/en', tagline: "Abu Dhabi's leading developer — Yas & Saadiyat Islands.", sortWeight: 10 },
  { slug: '690332a0-88b4-4e63-a4ba-7ea5689d73d9', name: 'Nakheel', logoUrl: `${CDN}8f458547-3089-448f-b2da-b520497dc044`, bannerUrl: `${CDN}76cd9cf2-7335-4aff-a7ff-892989348359`, tier: 'government', foundedYear: 2001, projects: 6, units: 29, minPriceAed: 4028000, creditPct: null, website: 'https://www.nakheel.com/', tagline: 'Master developer of Palm Jumeirah and The World.', sortWeight: 20 },
  { slug: '30dc0e03-03c2-4b18-8d81-03018adc71d5', name: 'Meraas', logoUrl: `${CDN}da8014d1-6006-4b0d-bbb1-306ce477d2d1`, bannerUrl: `${CDN}d6e79c71-292f-4165-a5a3-ad162647119f`, tier: 'government', foundedYear: 2007, projects: 4, units: 6, minPriceAed: 6614000, creditPct: null, website: 'https://meraas.com', tagline: 'City Walk, Bluewaters and Dubai Harbour.', sortWeight: 30 },
  { slug: '23916534-ebff-4b7d-9a20-3ba8187a2e9d', name: 'wasl', logoUrl: `${CDN}c43acb78-2b89-49c8-af26-21002d61fcc0`, bannerUrl: `${CDN}958555a4-c159-45d1-b86c-c8268c56e534`, tier: 'government', foundedYear: 2008, projects: 2, units: 8, minPriceAed: 12048000, creditPct: null, website: 'https://www.wasl.ae/en', tagline: 'City-forming developer within Dubai 2040.', sortWeight: 40 },
  { slug: '969285b4-32b4-4861-820d-c764220e9a08', name: 'Dubai South', logoUrl: `${CDN}da37dff4-d2fa-402e-981e-97be9d883ea2`, bannerUrl: `${CDN}0986caf8-e03f-4608-8856-c688be8e6096`, tier: 'government', foundedYear: 2006, projects: 2, units: 15, minPriceAed: 1925401, creditPct: null, website: 'https://www.dubaisouth.ae/en', tagline: "Dubai's largest single urban master development.", sortWeight: 50 },
];

/** Developers sorted by tier (private_top → private → government), then weight. */
export function getDevelopers(): Developer[] {
  return [...DEVELOPERS].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.sortWeight - b.sortWeight,
  );
}

export function getDeveloperBySlug(slug: string): Developer | undefined {
  return DEVELOPERS.find((d) => d.slug === slug);
}

export function getDeveloperSlugs(): string[] {
  return DEVELOPERS.map((d) => d.slug);
}
