const CATCHES = [
  {
    title: 'Auto-renewal traps',
    body: 'Clauses that renew silently unless you cancel inside a tight window. ContractPilot AI flags the term length and the notice period side-by-side.',
    example: '"…shall automatically renew for successive twelve (12) month terms unless notice is given at least ninety (90) days prior…"',
  },
  {
    title: 'One-sided indemnity',
    body: 'Indemnification obligations that only run one way, or that cover more than third-party claims. We surface both the scope and what you’d normally see instead.',
    example: '"Client shall indemnify, defend and hold harmless Vendor from any and all claims…"',
  },
  {
    title: 'Liability that isn’t actually capped',
    body: 'Liability clauses with carve-outs so broad the cap becomes meaningless — or missing entirely. We call out both the cap and the exclusions.',
    example: '"…except for breach of confidentiality, gross negligence, IP infringement, or breach of Section 4…"',
  },
  {
    title: 'Broad IP assignments',
    body: 'Assignments that sweep in your background IP, tooling, or general know-how alongside the actual deliverables. We separate what’s fair from what’s aggressive.',
    example: '"All work product, related materials, and any improvements thereto shall be the sole property of…"',
  },
  {
    title: 'Missing standard clauses',
    body: 'Sometimes the risk is what isn’t there — no limitation of liability in an MSA, no data return in a SaaS agreement, no cure period before termination.',
    example: '"No limitation of liability clause detected in this Master Services Agreement."',
  },
  {
    title: 'Language that reads unusual',
    body: 'Clauses that use non-standard wording for their type — often a sign the counterparty’s lawyer inserted something specific and hoped you wouldn’t notice.',
    example: '"Vendor may modify these Terms at any time upon posting revised Terms on its website…"',
  },
];

export function Catches() {
  return (
    <section className="section" id="catches">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-body">
            <div className="eyebrow">Categories · with real examples</div>
            <h2>The things that hurt you months after signature.</h2>
            <p className="lede">
              Every category below is something ContractPilot AI actively looks for. Findings are
              ranked <span style={{ color: 'var(--redline)' }}>high</span>,{' '}
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
