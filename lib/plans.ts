export type PlanId = 'solo' | 'team' | 'business' | 'firm';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceLabel: string;
  cycle?: string;
  cta: string;
  seats: number | null;
  contractsPerMonth: number | null;
  featured?: boolean;
  features: string[];
  paymentLinkEnv?: 'NEXT_PUBLIC_TEAM_PAYMENT_LINK' | 'NEXT_PUBLIC_BUSINESS_PAYMENT_LINK' | 'NEXT_PUBLIC_FIRM_PAYMENT_LINK';
}

export const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'For occasional reviews.',
    priceLabel: 'Free',
    cta: 'Start reviewing',
    seats: 1,
    contractsPerMonth: 3,
    features: [
      '3 contracts per month',
      'PDF, DOCX, and text input',
      'Full findings with plain-English explanations',
      'Suggestions for what to review further',
      '1 user',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For small ops teams.',
    priceLabel: '$47',
    cycle: '/ month',
    cta: 'Start 7-day trial',
    seats: 5,
    contractsPerMonth: null,
    features: [
      'Unlimited contracts',
      'Up to 5 seats',
      'Shared workspace and history',
      'Comment and share findings',
      'Email support',
    ],
    paymentLinkEnv: 'NEXT_PUBLIC_TEAM_PAYMENT_LINK',
  },
  {
    id: 'business',
    name: 'Business · Most popular',
    tagline: 'For procurement and mid-size operations.',
    priceLabel: '$57',
    cycle: '/ month',
    cta: 'Start 7-day trial',
    seats: 15,
    contractsPerMonth: null,
    featured: true,
    features: [
      'Everything in Team',
      'Up to 15 seats',
      'Export findings as PDF or CSV',
      'Custom risk categories',
      'Priority support',
      'Slack notifications',
    ],
    paymentLinkEnv: 'NEXT_PUBLIC_BUSINESS_PAYMENT_LINK',
  },
  {
    id: 'firm',
    name: 'Firm',
    tagline: 'For legal teams and firms.',
    priceLabel: '$97',
    cycle: '/ month',
    cta: 'Start 7-day trial',
    seats: null,
    contractsPerMonth: null,
    features: [
      'Everything in Business',
      'Unlimited seats',
      'SSO (SAML) — coming soon',
      'Audit trail and API access — coming soon',
      'Custom contract policies',
      'Dedicated onboarding',
    ],
    paymentLinkEnv: 'NEXT_PUBLIC_FIRM_PAYMENT_LINK',
  },
];

export function getPaymentLink(plan: Plan): string | null {
  if (!plan.paymentLinkEnv) return null;
  const value = process.env[plan.paymentLinkEnv];
  return value && value.trim().length > 0 ? value : null;
}

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

/** Solo is the only plan with a hard monthly contract cap; everything else is unlimited. */
export function getMonthlyContractLimit(planId: string): number | null {
  return planId === 'solo' ? 3 : null;
}
