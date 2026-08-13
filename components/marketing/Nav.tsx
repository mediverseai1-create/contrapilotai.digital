'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BrandMark } from './BrandMark';

export function Nav({ mode = 'dark', signedIn = false }: { mode?: 'dark' | 'light'; signedIn?: boolean }) {
  const [open, setOpen] = useState(false);
  const cls = `nav${mode === 'light' ? ' on-light' : ''}${open ? ' open' : ''}`;

  return (
    <div className={cls}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="ContractPilot AI">
          <BrandMark dark={mode !== 'light'} />
          <span>ContractPilot</span>
        </Link>
        <div className="nav-links">
          <Link href="/#how">How it works</Link>
          <Link href="/#catches">What it catches</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/#faq">Questions</Link>
        </div>
        <div className="nav-actions">
          {!signedIn && (
            <Link
              href="/signin"
              className="btn btn-sm btn-quiet"
              style={{ color: mode === 'light' ? 'var(--ink)' : 'var(--vellum-soft)', padding: '8px 0' }}
            >
              Sign in
            </Link>
          )}
          <Link href={signedIn ? '/app' : '/signup'} className="btn btn-sm btn-vellum">
            {signedIn ? 'Open dashboard' : 'Start reviewing'}
          </Link>
          <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            ≡
          </button>
        </div>
      </div>
    </div>
  );
}
