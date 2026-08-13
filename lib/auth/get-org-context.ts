import { createClient } from '@/lib/supabase/server';
import type { Organization, Profile } from '@/types/database';

export interface OrgContext {
  userId: string;
  userEmail: string | null;
  profile: Profile | null;
  organization: Organization;
  role: 'owner' | 'admin' | 'member';
}

/**
 * Resolves the signed-in user's organization + role for server components
 * and route handlers. Returns null if the user isn't signed in or hasn't
 * completed onboarding — callers decide whether to redirect.
 */
export async function getOrgContext(): Promise<OrgContext | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership } = await supabase
    .from('organization_members')
    .select('organization_id, role, organizations(*)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!membership || !membership.organizations) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

  return {
    userId: user.id,
    userEmail: user.email ?? null,
    profile: profile as Profile | null,
    organization: membership.organizations as unknown as Organization,
    role: membership.role as OrgContext['role'],
  };
}
