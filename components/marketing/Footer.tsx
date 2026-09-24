import Link from 'next/link';
import { BrandMark } from './BrandMark';

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-brand-block">
            <Link href="/" className="nav-brand" style={{ color: 'var(--ink)' }}>
              <BrandMark dark={false} />
              <span>ContractPilot</span>
            </Link>
            <p className="tagline">
              Contract intelligence that gives your business the legal protection an organization
              can&apos;t get on its own.
            </p>
          </div>
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/#catches">What it catches</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/#faq">Questions</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="mailto:contact@contractpilotai.digital">contact@contractpilotai.digital</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <ul>
              <li><Link href="/legal/terms">Terms of use</Link></li>
              <li><Link href="/legal/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© ContractPilot AI · {new Date().getFullYear()}</span>
          <span>contractpilotai.digital</span>
        </div>
      </div>
    </footer>
  );
}
