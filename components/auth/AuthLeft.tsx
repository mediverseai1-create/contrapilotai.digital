import Link from 'next/link';
import { BrandMark } from '@/components/marketing/BrandMark';

const QUOTES = {
  signin: {
    q: 'The auto-renewal clause in our supplier MSA would have cost us $84,000 if it had triggered. We found it in a ContractPilot AI review the week before.',
    who: 'Head of Operations · Regional logistics firm',
  },
  signup: {
    q: 'I used to read every vendor contract front to back and still miss things. Now I read the findings first, then check the clauses that matter.',
    who: 'General Counsel · Series B SaaS',
  },
  reset: {
    q: "It's the second-set-of-eyes I always wished I had at 5pm on a Friday afternoon when procurement forwards a contract to sign.",
    who: 'Founder · Two-year-old agency',
  },
} as const;

export function AuthLeft({ kind }: { kind: keyof typeof QUOTES }) {
  const quote = QUOTES[kind];

  return (
    <div className="auth-left">
      <div className="auth-left-inner">
        <Link href="/" className="nav-brand" style={{ color: 'var(--vellum-soft)' }}>
          <BrandMark dark />
          <span>ContractPilot</span>
        </Link>
        <h2>
          See what your contracts
          <br />
          are <em>actually</em> saying.
        </h2>
      </div>
      <div className="auth-left-inner">
        <p className="quote">&quot;{quote.q}&quot;</p>
        <p className="quote-attr">{quote.who}</p>
      </div>
    </div>
  );
}
