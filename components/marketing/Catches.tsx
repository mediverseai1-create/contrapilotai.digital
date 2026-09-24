const CATCHES = [
  {
    title: 'Auto-renewal traps',
    body: 'Your company gets locked in for another year because the organization missed a 90-day notice window. ContractPilot AI flags the term length and the notice period side-by-side.',
    example: '"…shall automatically renew for successive twelve (12) month terms unless notice is given at least ninety (90) days prior…"',
  },
  {
    title: 'One-sided indemnity',
    body: 'Your business ends up agreeing to defend the vendor — legal bills that should be theirs become your company’s liability. We surface both the scope and what you’d normally see instead.',
    example: '"Client shall indemnify, defend and hold harmless Vendor from any and all claims…"',
  },
  {
    title: 'Liability that isn’t actually capped',
    body: 'Carve-outs broad enough that your organization is exposed to damages beyond what a cap — or your insurance — actually covers. We call out both the cap and the exclusions.',
    example: '"…except for breach of confidentiality, gross negligence, IP infringement, or breach of Section 4…"',
  },
  {
    title: 'Broad IP assignments',
    body: 'Assignments that sweep in your company’s background IP, tooling, or general know-how alongside the actual deliverables. We separate what’s fair from what’s aggressive.',
    example: '"All work product, related materials, and any improvements thereto shall be the sole property of…"',
  },
  {
    title: 'Missing standard clauses',
    body: 'Sometimes the risk is what your organization isn’t protected by — no liability cap in an MSA, no data return in a SaaS agreement, no cure period before termination.',
    example: '"No limitation of liability clause detected in this Master Services Agreement."',
  },
  {
    title: 'Language that reads unusual',
    body: 'Wording that reads non-standard for the document type — often a sign the counterparty’s lawyer rewrote a clause to favor them, hoping it wouldn’t get noticed.',
    example: '"Vendor may modify these Terms at any time upon posting revised Terms on its website…"',
  },
];

export function Catches() {
  return (
    <section className="section" id="catches">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-body">
            <div className="eyebrow">Where organizational risk actually hides</div>
            <h2>What an AI contract review catches for your business.</h2>
            <p className="lede">
              The biggest risks in commercial contracts aren&apos;t the ones that sound alarming —
              they&apos;re the ones nobody in the organization notices until the damage is done. Every
              category below is something ContractPilot AI actively looks for, measured against how
              similar agreements typically read. Findings are ranked{' '}
              <span style={{ color: 'var(--redline)' }}>high</span>,{' '}
              <span style={{ color: '#9C7A2A' }}>medium</span>, or{' '}
              <span style={{ color: 'var(--sage)' }}>low</span> to support — not replace — your own
              review.
            </p>
          </div>
        </div>

        <div className="catches">
          {CATCHES.map((c) => (
            <div className="catch" key={c.title}>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
              <div className="catch-example">{c.example}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
