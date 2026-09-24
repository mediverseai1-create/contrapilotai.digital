import Link from 'next/link';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="eyebrow on-dark hero-eyebrow">
          AI contract intelligence · <span className="accent">for companies without a legal department</span>
        </div>
        <h1 className="display">
          Your company is signing contracts
          <br />
          that could take <em>months</em> to unwind.
        </h1>
        <p className="hero-sub">
          When you lack in-house legal, every contract is an organizational blind spot — auto-renew
          traps that lock the business in for another year, liability clauses that exceed your
          insurance, payment terms that hand vendors pricing power. ContractPilot AI reads every
          clause, flags what&apos;s actually at stake, and puts it in front of you before signature.
        </p>
        <div className="hero-cta">
          <Link href="/signup" className="btn btn-vellum">Try it on a contract</Link>
          <Link href="/#how" className="btn btn-ghost-dark">See how it works</Link>
        </div>
        <div className="hero-meta">
          <span>No credit card</span>
          <span>Free for your team&apos;s first 3 contracts</span>
          <span>Reviewed against common contract patterns</span>
        </div>

        <div className="redline-sample" role="figure" aria-label="Example contract redline">
          <div className="redline-sample-body">
            <div className="redline-sample-head">
              <span className="section-tag">§ 8.2</span>
              <span className="clause-name">Auto-renewal</span>
              <span className="doc-label">Vendor MSA · p. 12</span>
            </div>
            <p className="redline-sample-para">
              This Agreement shall <span className="hl">automatically renew</span> for successive{' '}
              <span className="strike">twelve (12) month</span> terms unless either Party provides
              written notice of non-renewal at least <span className="anchor">ninety (90) days</span>{' '}
              prior to the then-current expiration date. In the event of renewal, all pricing
              shall be subject to <span className="strike">annual adjustment at Vendor&apos;s sole discretion</span>.
            </p>
          </div>
          <div className="redline-sample-findings">
            <div className="findings-head">
              <span className="label">Findings on this clause</span>
              <span className="count">3</span>
            </div>
            <div className="finding high">
              <div className="finding-head">
                <span className="finding-cat">Auto-renewal</span>
                <span className="finding-sev">High</span>
              </div>
              <div className="finding-explain">
                Locks you in for another year if you miss a 90-day notice window. Most teams don&apos;t
                have a system to catch this.
              </div>
              <div className="finding-ref">Suggest: negotiate to 30-day notice</div>
            </div>
            <div className="finding medium">
              <div className="finding-head">
                <span className="finding-cat">Payment terms</span>
                <span className="finding-sev">Medium</span>
              </div>
              <div className="finding-explain">
                Vendor sets pricing at renewal with no cap. You have no visibility until the invoice
                arrives.
              </div>
              <div className="finding-ref">Suggest: cap increase at CPI + 3%</div>
            </div>
            <div className="finding low">
              <div className="finding-head">
                <span className="finding-cat">Notice</span>
                <span className="finding-sev">Low</span>
              </div>
              <div className="finding-explain">
                Written notice requirement is unclear on delivery — email may not qualify.
              </div>
              <div className="finding-ref">Suggest: define &quot;written&quot; to include email</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
