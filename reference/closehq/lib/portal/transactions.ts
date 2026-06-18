export interface Transaction {
  id: string;
  kind: 'sold' | 'rented';
  date: string; // ISO date
  community: string;
  building: string | null;
  propertyType: string;
  bedrooms: number | null;
  areaSqft: number | null;
  priceAed: number;
}

const SEED_TRANSACTIONS: Transaction[] = [
  { id: 't1', kind: 'sold', date: '2026-06-10', community: 'Downtown Dubai', building: 'Burj Vista', propertyType: 'Apartment', bedrooms: 2, areaSqft: 1320, priceAed: 3150000 },
  { id: 't2', kind: 'sold', date: '2026-06-08', community: 'Dubai Marina', building: 'Marina Gate', propertyType: 'Apartment', bedrooms: 1, areaSqft: 810, priceAed: 1790000 },
  { id: 't3', kind: 'sold', date: '2026-06-05', community: 'Palm Jumeirah', building: 'Signature Villas', propertyType: 'Villa', bedrooms: 4, areaSqft: 5100, priceAed: 21800000 },
  { id: 't4', kind: 'sold', date: '2026-06-03', community: 'Dubai Hills Estate', building: 'Maple', propertyType: 'Townhouse', bedrooms: 3, areaSqft: 2080, priceAed: 4280000 },
  { id: 't5', kind: 'sold', date: '2026-05-29', community: 'Business Bay', building: 'Peninsula', propertyType: 'Apartment', bedrooms: 2, areaSqft: 1090, priceAed: 2350000 },
  { id: 't6', kind: 'sold', date: '2026-05-24', community: 'JVC', building: 'Binghatti Amber', propertyType: 'Studio', bedrooms: 0, areaSqft: 405, priceAed: 610000 },
  { id: 't7', kind: 'sold', date: '2026-05-20', community: 'Dubai Creek Harbour', building: 'Creek Edge', propertyType: 'Apartment', bedrooms: 2, areaSqft: 1150, priceAed: 2780000 },
  { id: 't8', kind: 'sold', date: '2026-05-15', community: 'Arabian Ranches', building: 'Alvorada', propertyType: 'Villa', bedrooms: 5, areaSqft: 6050, priceAed: 9450000 },
];

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getTransactions(
  filters: { kind?: 'sold' | 'rented'; q?: string } = {},
): Promise<Transaction[]> {
  if (isSupabaseConfigured()) {
    try {
      const { supabase } = await import('@/lib/supabase');
      let query = supabase
        .from('transactions')
        .select('id,kind,occurred_on,community,building,property_type,bedrooms,area_sqft,price_aed')
        .order('occurred_on', { ascending: false })
        .limit(50);
      if (filters.kind) query = query.eq('kind', filters.kind);
      if (filters.q) query = query.ilike('community', `%${filters.q}%`);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return (data as unknown as Array<Record<string, unknown>>).map((r) => ({
          id: String(r.id),
          kind: r.kind as 'sold' | 'rented',
          date: String(r.occurred_on),
          community: (r.community as string) ?? '',
          building: (r.building as string) ?? null,
          propertyType: String(r.property_type),
          bedrooms: (r.bedrooms as number) ?? null,
          areaSqft: (r.area_sqft as number) ?? null,
          priceAed: Number(r.price_aed),
        }));
      }
    } catch {
      // fall through to seed
    }
  }
  let out = SEED_TRANSACTIONS;
  if (filters.kind) out = out.filter((t) => t.kind === filters.kind);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    out = out.filter((t) => `${t.community} ${t.building ?? ''}`.toLowerCase().includes(q));
  }
  return out;
}
