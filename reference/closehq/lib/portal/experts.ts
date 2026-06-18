/**
 * "New Project Expert" pool. One is shown (rotated per visit) merged into the
 * New Releases grid so buyers feel they can reach a real, available expert.
 * Contact routes to the internal team (enquiry), not a third-party agent.
 */
export interface Expert {
  id: string;
  name: string;
  languages: string[];
  blurb: string;
  respondsMins: number;
}

const EXPERTS: Expert[] = [
  { id: 'e1', name: 'Asem Al Helwani', languages: ['English', 'Arabic'], blurb: '17+ years in UAE real estate, driving strategic investment, portfolio growth, and market-leading opportunities.', respondsMins: 10 },
  { id: 'e2', name: 'Ash Prakash', languages: ['English'], blurb: 'Specialises in waterfront property and off-plan portfolio strategy across Dubai.', respondsMins: 10 },
  { id: 'e3', name: 'Sara Khan', languages: ['English', 'Hindi'], blurb: 'Off-plan investment and payment-plan specialist focused on best-value launches.', respondsMins: 8 },
  { id: 'e4', name: 'Dmitry Ivanov', languages: ['English', 'Russian'], blurb: 'New launches and developer relations — early access to the most in-demand projects.', respondsMins: 12 },
  { id: 'e5', name: 'Mei Chen', languages: ['English', 'Mandarin'], blurb: 'Investor relations across Dubai and Abu Dhabi, with a focus on capital growth and ROI.', respondsMins: 9 },
];

/** Pick a rotating expert (called per request on the server, so it changes per visit). */
export function getRandomExpert(): Expert {
  return EXPERTS[Math.floor(Math.random() * EXPERTS.length)];
}
