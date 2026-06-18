export interface Agent {
  id: string;
  fullName: string;
  photoUrl: string | null;
  agencyName: string | null;
  reraNo: string | null;
  languages: string[];
  nationality: string | null;
  isVerified: boolean;
  areas: string[];
}

export interface Agency {
  id: string;
  name: string;
  logoUrl: string | null;
  agentsCount: number;
  areas: string[];
}

const SEED_AGENTS: Agent[] = [
  { id: 'a1', fullName: 'Sarah Al Mansoori', photoUrl: null, agencyName: 'Skyline Properties', reraNo: 'BRN-12045', languages: ['English', 'Arabic'], nationality: 'UAE', isVerified: true, areas: ['Downtown Dubai', 'Business Bay'] },
  { id: 'a2', fullName: 'James Whitfield', photoUrl: null, agencyName: 'Marina Estates', reraNo: 'BRN-20881', languages: ['English'], nationality: 'UK', isVerified: true, areas: ['Dubai Marina', 'JBR'] },
  { id: 'a3', fullName: 'Priya Nair', photoUrl: null, agencyName: 'Hills Realty', reraNo: 'BRN-33190', languages: ['English', 'Hindi'], nationality: 'India', isVerified: true, areas: ['Dubai Hills Estate', 'Arabian Ranches'] },
  { id: 'a4', fullName: 'Mikhail Petrov', photoUrl: null, agencyName: 'Palm Luxury', reraNo: 'BRN-41277', languages: ['English', 'Russian'], nationality: 'Russia', isVerified: false, areas: ['Palm Jumeirah'] },
  { id: 'a5', fullName: 'Li Wei', photoUrl: null, agencyName: 'Creek Harbour Homes', reraNo: 'BRN-50912', languages: ['English', 'Chinese'], nationality: 'China', isVerified: true, areas: ['Dubai Creek Harbour'] },
  { id: 'a6', fullName: 'Omar Haddad', photoUrl: null, agencyName: 'Skyline Properties', reraNo: 'BRN-60334', languages: ['English', 'Arabic'], nationality: 'Jordan', isVerified: true, areas: ['JVC', 'Business Bay'] },
];

const SEED_AGENCIES: Agency[] = [
  { id: 'ag1', name: 'Skyline Properties', logoUrl: null, agentsCount: 42, areas: ['Downtown Dubai', 'Business Bay'] },
  { id: 'ag2', name: 'Marina Estates', logoUrl: null, agentsCount: 28, areas: ['Dubai Marina', 'JBR'] },
  { id: 'ag3', name: 'Hills Realty', logoUrl: null, agentsCount: 35, areas: ['Dubai Hills Estate', 'Arabian Ranches'] },
  { id: 'ag4', name: 'Palm Luxury', logoUrl: null, agentsCount: 19, areas: ['Palm Jumeirah'] },
];

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getAgents(): Promise<Agent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('agents')
        .select('id,full_name,photo_url,rera_no,languages,nationality,areas,is_verified,agencies(name)');
      if (!error && data && data.length > 0) {
        return (data as unknown as Array<Record<string, unknown>>).map((r) => ({
          id: String(r.id),
          fullName: String(r.full_name),
          photoUrl: (r.photo_url as string) ?? null,
          agencyName: (r.agencies as { name?: string } | null)?.name ?? null,
          reraNo: (r.rera_no as string) ?? null,
          languages: (r.languages as string[]) ?? [],
          nationality: (r.nationality as string) ?? null,
          isVerified: Boolean(r.is_verified),
          areas: (r.areas as string[]) ?? [],
        }));
      }
    } catch {
      // fall through to seed
    }
  }
  return SEED_AGENTS;
}

export async function getAgencies(): Promise<Agency[]> {
  if (isSupabaseConfigured()) {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('agencies')
        .select('id,name,logo_url,areas,agents(count)')
        .eq('is_active', true);
      if (!error && data && data.length > 0) {
        return (data as unknown as Array<Record<string, unknown>>).map((r) => ({
          id: String(r.id),
          name: String(r.name),
          logoUrl: (r.logo_url as string) ?? null,
          agentsCount: Number((r.agents as Array<{ count?: number }> | undefined)?.[0]?.count ?? 0),
          areas: (r.areas as string[]) ?? [],
        }));
      }
    } catch {
      // fall through to seed
    }
  }
  return SEED_AGENCIES;
}
