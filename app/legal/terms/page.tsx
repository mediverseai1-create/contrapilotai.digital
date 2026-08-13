import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export default function TermsPage() {
  return (
    <>
      <Nav mode="light" />
      <section className="section">
        <div className="wrap wrap-narrow">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Legal</div>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 3.6vw, 42px)', marginBottom: 24 }}>
            Terms of use
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6 }}>
            Coming soon. ContractPilot AI&apos;s terms of use are being finalized — this page will
            hold the real terms before the app accepts paying customers.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
