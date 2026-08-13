import Link from 'next/link';

export function CTABand() {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="eyebrow on-dark" style={{ marginBottom: 20 }}>Ready when you are</div>
        <h2 className="display">
          Upload your first contract.
          <br />
          <em>See what you&apos;ve been missing.</em>
        </h2>
        <p>Free plan includes three contracts a month, forever. No credit card required to start.</p>
        <div className="hero-cta">
          <Link href="/signup" className="btn btn-vellum">Review a contract</Link>
          <Link href="/pricing" className="btn btn-ghost-dark">See pricing</Link>
        </div>
      </div>
    </section>
  );
}
