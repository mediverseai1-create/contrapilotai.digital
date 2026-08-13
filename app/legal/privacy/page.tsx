import { Nav } from '@/components/marketing/Nav';
import { Footer } from '@/components/marketing/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Nav mode="light" />
      <section className="section">
        <div className="wrap wrap-narrow">
          <div className="eyebrow" style={{ marginBottom: 12 }}>Legal</div>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 3.6vw, 42px)', marginBottom: 24 }}>
            Privacy policy
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6 }}>
            Coming soon. ContractPilot AI&apos;s privacy policy is being finalized — this page will
            explain exactly how contract data and account information are handled before the app
            accepts paying customers.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
