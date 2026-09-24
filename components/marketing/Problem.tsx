const PROBLEMS = [
  {
    label: 'No legal expertise in the room',
    body: 'Non-lawyers review contracts for the company, which means organizational risk gets missed.',
  },
  {
    label: 'No review process',
    body: 'Each contract is reviewed once, in isolation, often before the meeting it’s needed for even ends.',
  },
  {
    label: 'No record of what was signed',
    body: 'Signature happens, and institutional knowledge of what the business actually committed to disappears with it.',
  },
  {
    label: 'Renewals scattered everywhere',
    body: 'Notice periods and obligations live across email threads and file folders — easy for the business to lose track of.',
  },
  {
    label: 'Problems surface too late',
    body: 'The organization discovers an issue months later, when fixing it costs resources, time, and the relationship.',
  },
];

export function Problem() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-body">
            <div className="eyebrow">Why your business is at risk</div>
            <h2>You don&apos;t have in-house legal. So your organization manages legal risk without the expertise.</h2>
          </div>
        </div>
        <div className="two-col">
          <div className="secondary" style={{ borderTop: '2px solid var(--ink)', paddingTop: 24 }}>
            <dl>
              {PROBLEMS.map((p) => (
                <div key={p.label} style={{ display: 'contents' }}>
                  <dt>{p.label}</dt>
                  <dd>{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="primary">
            <p style={{ fontSize: '16.5px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              Most mid-market and growing companies lack in-house counsel, so legal exposure just
              compounds — quietly, contract by contract.
            </p>
            <p style={{ fontSize: '16.5px', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
              ContractPilot AI isn&apos;t a lawyer. It&apos;s the legal intelligence layer your
              organization is missing — reading every clause, ranking what&apos;s actually at stake,
              and keeping a record of what the business has signed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
