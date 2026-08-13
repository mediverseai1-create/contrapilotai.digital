import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getOrgContext } from '@/lib/auth/get-org-context';
import { DashboardContent } from './DashboardContent';

export default async function DashboardPage() {
  const orgContext = await getOrgContext();
  if (!orgContext) return null;

  const supabase = createClient();
  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, risk_findings(severity, category)')
    .eq('organization_id', orgContext.organization.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="app-header">
        <div>
          <h1>Contracts reviewed</h1>
          <div className="app-sub">Dashboard</div>
        </div>
        <Link href="/app/new" className="btn btn-primary">
          Review a new contract
        </Link>
      </div>

      <DashboardContent contracts={contracts ?? []} />
    </>
  );
}
