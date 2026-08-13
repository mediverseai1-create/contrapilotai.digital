'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BrandMark } from '@/components/marketing/BrandMark';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/new', label: 'New review' },
  { href: '/app/settings', label: 'Settings' },
];

export function Sidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const initial = (name || email || '?')[0].toUpperCase();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <aside className="app-sidebar">
      <Link href="/" className="brand" style={{ color: 'var(--vellum-soft)' }}>
        <BrandMark dark />
        <span>ContractPilot</span>
      </Link>
      <nav>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={pathname === item.href ? 'active' : ''}>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="side-footer">
        <div className="user">
          <div className="avatar">{initial}</div>
          <div className="who">
            <div className="name">{name || 'You'}</div>
            <div className="email">{email}</div>
          </div>
        </div>
        <button className="signout" onClick={handleSignOut}>
          Sign out ↗
        </button>
      </div>
    </aside>
  );
}
