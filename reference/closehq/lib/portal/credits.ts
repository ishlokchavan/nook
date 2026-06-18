/** Credit economics: 1 credit = 0.5 AED. */
export const CREDIT_AED_RATE = 0.5;

export function creditsToAed(credits: number): number {
  return credits * CREDIT_AED_RATE;
}
export function aedToCredits(aed: number): number {
  return Math.round(aed / CREDIT_AED_RATE);
}

export type IconKey = 'building' | 'users' | 'tag' | 'badge' | 'wallet' | 'gift' | 'receipt' | 'bank';

export interface CreditMethod {
  iconKey: IconKey;
  title: string;
  body: string;
}

/** Ways to earn credits. */
export const EARN_METHODS: CreditMethod[] = [
  { iconKey: 'building', title: 'Invest in off-plan', body: 'Earn credits when you reserve an off-plan property through iClose — on top of special pricing.' },
  { iconKey: 'users', title: 'Refer a friend', body: 'Share your referral link. When someone you refer transacts, you both earn credits.' },
  { iconKey: 'tag', title: 'Buy or sell on iClose', body: 'Every completed deal returns value — buyers get cashback, and credits stack on top.' },
  { iconKey: 'badge', title: 'Complete verification', body: 'Verify your profile and documents to unlock bonus credits and higher limits.' },
];

/** Ways to redeem credits. */
export const REDEEM_METHODS: CreditMethod[] = [
  { iconKey: 'building', title: 'Off-plan payments', body: 'Apply credits toward an off-plan reservation or instalment.' },
  { iconKey: 'bank', title: 'Cashback to your bank', body: 'Withdraw eligible credits as AED cashback to your bank account.' },
  { iconKey: 'receipt', title: 'Service fees', body: 'Offset conveyancing, mortgage, or other service fees on your transaction.' },
  { iconKey: 'gift', title: 'Gift to a friend', body: 'Transfer credits to someone else on iClose.' },
];
