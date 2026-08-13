import Link from 'next/link';
import { getOrgContext } from '@/lib/auth/get-org-context';
import { getPlan, getMonthlyContractLimit } from '@/lib/plans';
import { createClient } from '@/lib/supabase/server';
import { ProfileForm } from './ProfileForm';
import { OrganizationForm } from './OrganizationForm';

export default async function SettingsPage() {
  const orgContext = await getOrgContext();
  if (!orgContext) return null;

  const { organization, profile, role, userEmail } = orgContext;
  const plan = getPlan(organization.plan);
  const limit = getMonthlyContractLimit(organization.plan);

  const supabase = createClient();
  let usedThisMonth = 0;
  if (limit !== null) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const { count } = await supabase
      .from('usage_records')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organization.id)
      .eq('action', 'contract_upload')
      .gte('created_at', monthStart.toISOString());
    usedThisMonth = count ?? 0;
  }

  const canEditOrg = role === 'owner' || role === 'admin';

  return (
    <>
      <div className="app-header">
        <div>
          <div className="breadcrumb">
            <Link href="/app">Dashboard</Link>
            <span className="sep">/</span>Settings
          </div>
          <h1 style={{ marginTop: 8 }}>Settings</h1>
        </div>
      </div>

      <div className="settings-page">
        <div className="settings-block">
          <h3>Profile</h3>
          <p className="block-sub">Your account details.</p>
          <ProfileForm initialName={profile?.full_name ?? ''} initialJobRole={profile?.job_role ?? ''} email={userEmail ?? ''} />
        </div>

        <div className="settings-block">
          <h3>Organization</h3>
          <p className="block-sub">
            {canEditOrg ? 'Shared across everyone in your workspace.' : 'Only owners and admins can edit these details.'}
          </p>
          <OrganizationForm
            organizationId={organization.id}
            initialName={organization.name}
            initialIndustry={organization.industry ?? ''}
            initialCountry={organization.country ?? ''}
            initialCompanySize={organization.company_size ?? ''}
            editable={canEditOrg}
          />
        </div>

        <div className="settings-block">
          <h3>Plan</h3>
          <p className="block-sub">Your organization&apos;s current subscription.</p>
          <div className="status-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="lbl">Current plan</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>{plan.name.split(' ·')[0]}</span>
          </div>
          {limit !== null && (
            <div className="status-row">
              <span className="lbl">Contracts this month</span>
              <span className={usedThisMonth >= limit ? 'status-bad' : ''}>
                {usedThisMonth} / {limit}
              </span>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Link href="/pricing" className="btn btn-primary">
              {organization.plan === 'solo' ? 'Upgrade plan' : 'Change plan'}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
