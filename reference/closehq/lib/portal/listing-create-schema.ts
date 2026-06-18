import { z } from 'zod';

export const listingPurposes = ['sale'] as const;
export const listingCategories = ['residential', 'commercial'] as const;
export const listingPropertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'plot', 'office', 'retail'] as const;
export const listingCompletions = ['ready', 'off_plan'] as const;

/** Which compliant path the lister is using. */
export const listingPaths = ['owner', 'agent'] as const;
export type ListingPath = (typeof listingPaths)[number];

const phone = z
  .string()
  .min(7, 'Enter a valid phone number')
  .max(20)
  .regex(/^[+\d\s()-]+$/, 'Use digits, spaces, +, - or ()');

export const listingCreateSchema = z
  .object({
    path: z.enum(listingPaths),

    // Property details
    purpose: z.enum(listingPurposes),
    category: z.enum(listingCategories),
    propertyType: z.enum(listingPropertyTypes),
    completion: z.enum(listingCompletions),
    community: z.string().min(2, 'Enter the community').max(80),
    building: z.string().max(80).optional().or(z.literal('')),
    bedrooms: z.coerce.number().int().min(0).max(20),
    bathrooms: z.coerce.number().int().min(0).max(20),
    areaSqft: z.coerce.number().min(50, 'Enter the area in sqft').max(200000),
    priceAed: z.coerce.number().min(1, 'Enter the price in AED').max(1_000_000_000),
    title: z.string().min(6, 'Add a short title').max(120),
    description: z.string().min(20, 'Describe the property (20+ chars)').max(4000),

    // Contact (also used for de-dupe across "seller" listings)
    contactName: z.string().min(2, 'Enter your name').max(80),
    contactPhone: phone,
    contactEmail: z.string().email('Enter a valid email').max(120),

    // Uploaded document references (names; binaries upload to storage separately)
    documents: z.array(z.string()).default([]),

    // Owner / POA path
    ownerName: z.string().max(80).optional().or(z.literal('')),
    isPoa: z.boolean().optional().default(false),
    attestOwnership: z.boolean().optional().default(false),

    // RERA agent path
    reraBrn: z.string().max(40).optional().or(z.literal('')),
    agencyName: z.string().max(120).optional().or(z.literal('')),
    trakheesiPermit: z.string().max(40).optional().or(z.literal('')),
    /** Quality gate: the contact number must be the owner's, not the agent's. */
    attestOwnerContact: z.boolean().optional().default(false),

    // honeypot
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.path === 'owner') {
      if (!data.ownerName || data.ownerName.trim().length < 2) {
        ctx.addIssue({ code: 'custom', path: ['ownerName'], message: 'Enter the owner name (as on the title deed)' });
      }
      if (!data.trakheesiPermit || data.trakheesiPermit.trim().length < 3) {
        ctx.addIssue({
          code: 'custom',
          path: ['trakheesiPermit'],
          message: 'A Trakheesi permit number is required to advertise an owner listing',
        });
      }
      if (!data.attestOwnership) {
        ctx.addIssue({ code: 'custom', path: ['attestOwnership'], message: 'You must confirm ownership / POA to list' });
      }
      if (data.documents.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['documents'], message: 'Upload proof of ownership (title deed or Oqood)' });
      }
    }
    if (data.path === 'agent') {
      if (!data.reraBrn || data.reraBrn.trim().length < 3) {
        ctx.addIssue({ code: 'custom', path: ['reraBrn'], message: 'Enter your RERA BRN' });
      }
      if (data.documents.length === 0) {
        ctx.addIssue({ code: 'custom', path: ['documents'], message: 'Upload your Contract A (RERA Form A)' });
      }
      if (!data.attestOwnerContact) {
        ctx.addIssue({
          code: 'custom',
          path: ['attestOwnerContact'],
          message: "The contact number must be the owner's, not the agent's",
        });
      }
    }
  });

export type ListingCreateValues = z.infer<typeof listingCreateSchema>;
