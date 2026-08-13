import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from './OnboardingForm';

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (membership) redirect('/app');

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <div className="step-label">Step 1 of 1 · Set up your workspace</div>
        <h1 className="display">Tell us about your organization.</h1>
        <p className="sub">
          This creates your ContractPilot AI workspace — contracts and findings stay isolated to
          your organization only.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
