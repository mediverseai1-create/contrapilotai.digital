import { redirect } from 'next/navigation';
import { getOrgContext } from '@/lib/auth/get-org-context';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const orgContext = await getOrgContext();
  if (!orgContext) redirect('/onboarding');

  const name = orgContext.profile?.full_name || '';
  const email = orgContext.userEmail || '';

  return (
    <div className="app-shell">
      <Sidebar name={name} email={email} />
      <main className="app-main">{children}</main>
    </div>
  );
}
