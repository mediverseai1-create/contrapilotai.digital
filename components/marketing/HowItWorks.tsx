export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="sec-head">
          <div className="sec-head-body">
            <div className="eyebrow">Three steps · roughly thirty seconds</div>
            <h2>Upload once. Review anywhere. Sign with the whole picture.</h2>
            <p className="lede">
              You don&apos;t need to change your review process. You just need someone who reads every
              clause without skipping — and that&apos;s what ContractPilot AI does.
            </p>
          </div>
        </div>
        <div className="steps">
          <div className="step">
            <h3>Upload the contract</h3>
            <p>
              Drop a PDF, DOCX, or paste plain text. Vendor MSAs, SaaS terms, NDAs, employment
              agreements, leases — anything with clauses that matter.
            </p>
          </div>
          <div className="step">
            <h3>ContractPilot AI reads every line</h3>
            <p>
              The model scans for risks, missing terms, and language that reads unusual for the
              document type — comparing against how most agreements handle each provision.
            </p>
          </div>
          <div className="step">
            <h3>You get a redlined view</h3>
            <p>
              Each finding is categorised, ranked by severity, quoted from the contract, and
              explained in plain English with a specific suggestion for what to review.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
