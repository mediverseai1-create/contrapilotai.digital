import Link from 'next/link';
import { PLANS, getPaymentLink } from '@/lib/plans';

export function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-body">
            <div className="eyebrow">Four plans · monthly · cancel anytime</div>
            <h2>Priced per team, not per document.</h2>
            <p className="lede">
              Start free with three contracts a month. Upgrade when you&apos;re routing every
              agreement through ContractPilot AI before it reaches the signer.
            </p>
          </div>
        </div>

        <div className="plans">
          {PLANS.map((plan) => {
            const paymentLink = getPaymentLink(plan);
            const isFree = plan.id === 'solo';
            const ctaHref = isFree ? '/signup' : paymentLink ?? '/signup';
            const ctaLabel = isFree ? plan.cta : paymentLink ? plan.cta : 'Coming soon';
            const ctaClass = plan.featured ? 'btn btn-vellum plan-cta' : 'btn btn-ghost plan-cta';
            const ctaStyle = plan.featured ? { background: 'var(--vellum-soft)', color: 'var(--ink)' } : undefined;

            return (
              <div className={`plan${plan.featured ? ' feature' : ''}`} key={plan.id}>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  <span className="amt">{plan.priceLabel}</span>
                  {plan.cycle && <span className="cyc">{plan.cycle}</span>}
                </div>
                <div className="plan-tagline">{plan.tagline}</div>
                {!isFree && !paymentLink ? (
                  <span className={ctaClass} style={{ ...ctaStyle, opacity: 0.6, cursor: 'default' }}>
                    {ctaLabel}
                  </span>
                ) : (
                  <Link href={ctaHref} className={ctaClass} style={ctaStyle}>
                    {ctaLabel}
                  </Link>
                )}
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
