-- ContractPilot AI — Row Level Security
-- Every table that holds organization data is isolated by organization membership.
-- These policies are the real access-control boundary — the frontend never decides
-- who can see what, Postgres does.

-- =========================================================
-- Helper functions (SECURITY DEFINER so they can read
-- organization_members without triggering RLS recursion)
-- =========================================================
create or replace function public.get_user_org_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select organization_id from public.organization_members where user_id = auth.uid();
$$;

create or replace function public.get_user_role_in_org(org_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.organization_members
  where organization_id = org_id and user_id = auth.uid()
  limit 1;
$$;

-- =========================================================
-- profiles
-- =========================================================
alter table public.profiles enable row level security;

create policy "profiles_select_self_or_org_mates" on public.profiles
  for select using (
    id = auth.uid()
    or id in (
      select user_id from public.organization_members
      where organization_id in (select public.get_user_org_ids())
    )
  );

create policy "profiles_update_self" on public.profiles
  for update using (id = auth.uid());

-- =========================================================
-- organizations
-- =========================================================
alter table public.organizations enable row level security;

create policy "organizations_select_member" on public.organizations
  for select using (id in (select public.get_user_org_ids()));

create policy "organizations_update_owner_admin" on public.organizations
  for update using (
    public.get_user_role_in_org(id) in ('owner', 'admin')
  );

-- Inserts happen exclusively through the create_organization_with_owner()
-- function below (security definer), so no direct insert policy is granted.

-- =========================================================
-- organization_members
-- =========================================================
alter table public.organization_members enable row level security;

create policy "org_members_select_self_or_org" on public.organization_members
  for select using (
    user_id = auth.uid()
    or organization_id in (select public.get_user_org_ids())
  );

create policy "org_members_manage_owner_admin" on public.organization_members
  for all using (
    public.get_user_role_in_org(organization_id) in ('owner', 'admin')
  );

-- =========================================================
-- contracts
-- =========================================================
alter table public.contracts enable row level security;

create policy "contracts_select_org" on public.contracts
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "contracts_insert_org" on public.contracts
  for insert with check (organization_id in (select public.get_user_org_ids()));

create policy "contracts_update_org" on public.contracts
  for update using (organization_id in (select public.get_user_org_ids()));

create policy "contracts_delete_org" on public.contracts
  for delete using (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- contract_documents
-- =========================================================
alter table public.contract_documents enable row level security;

create policy "contract_documents_select_org" on public.contract_documents
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "contract_documents_insert_org" on public.contract_documents
  for insert with check (organization_id in (select public.get_user_org_ids()));

create policy "contract_documents_delete_org" on public.contract_documents
  for delete using (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- contract_analysis
-- =========================================================
alter table public.contract_analysis enable row level security;

create policy "contract_analysis_select_org" on public.contract_analysis
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "contract_analysis_insert_org" on public.contract_analysis
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- risk_findings
-- =========================================================
alter table public.risk_findings enable row level security;

create policy "risk_findings_select_org" on public.risk_findings
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "risk_findings_insert_org" on public.risk_findings
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- obligations
-- =========================================================
alter table public.obligations enable row level security;

create policy "obligations_select_org" on public.obligations
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "obligations_insert_org" on public.obligations
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- important_dates
-- =========================================================
alter table public.important_dates enable row level security;

create policy "important_dates_select_org" on public.important_dates
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "important_dates_insert_org" on public.important_dates
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- reports
-- =========================================================
alter table public.reports enable row level security;

create policy "reports_select_org" on public.reports
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "reports_insert_org" on public.reports
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- usage_records
-- =========================================================
alter table public.usage_records enable row level security;

create policy "usage_records_select_org" on public.usage_records
  for select using (organization_id in (select public.get_user_org_ids()));

create policy "usage_records_insert_org" on public.usage_records
  for insert with check (organization_id in (select public.get_user_org_ids()));

-- =========================================================
-- Onboarding RPC — atomically create an organization and make
-- the calling user its owner. Called from the onboarding flow
-- instead of separate inserts, so a user can never create a
-- membership row in an organization they didn't just create.
-- =========================================================
create or replace function public.create_organization_with_owner(
  org_name text,
  org_industry text,
  org_country text,
  org_company_size text,
  user_job_role text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name, industry, country, company_size)
  values (org_name, org_industry, org_country, org_company_size)
  returning id into new_org_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (new_org_id, auth.uid(), 'owner');

  update public.profiles set job_role = user_job_role where id = auth.uid();

  return new_org_id;
end;
$$;
