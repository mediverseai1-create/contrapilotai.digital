-- ContractPilot AI — core schema
-- Run in the Supabase SQL editor, or via `supabase db push` if using the CLI.

create extension if not exists "pgcrypto";

-- =========================================================
-- profiles — one row per auth.users, created automatically
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  job_role text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- organizations
-- =========================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  country text,
  company_size text,
  plan text not null default 'solo' check (plan in ('solo', 'team', 'business', 'firm')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- organization_members — join table, one row per user per org
-- =========================================================
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_members_user_id_idx on public.organization_members (user_id);
create index if not exists organization_members_org_id_idx on public.organization_members (organization_id);

-- =========================================================
-- contracts
-- =========================================================
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  uploaded_by uuid not null references auth.users (id) on delete set null,
  title text not null default 'Untitled contract',
  doc_type text,
  counterparty text,
  source_type text not null check (source_type in ('file', 'paste')),
  status text not null default 'uploaded' check (status in ('uploaded', 'processing', 'analyzing', 'complete', 'failed')),
  risk_level text check (risk_level in ('high', 'medium', 'low')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contracts_org_id_idx on public.contracts (organization_id);
create index if not exists contracts_status_idx on public.contracts (status);
create index if not exists contracts_created_at_idx on public.contracts (created_at desc);

-- =========================================================
-- contract_documents — the uploaded file + extracted text
-- =========================================================
create table if not exists public.contract_documents (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  file_name text,
  file_type text,
  file_size bigint,
  storage_path text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create index if not exists contract_documents_contract_id_idx on public.contract_documents (contract_id);

-- =========================================================
-- contract_analysis — one row per completed AI analysis run
-- =========================================================
create table if not exists public.contract_analysis (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  summary text,
  overall_risk text check (overall_risk in ('high', 'medium', 'low')),
  model text not null,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists contract_analysis_contract_id_key on public.contract_analysis (contract_id);

-- =========================================================
-- risk_findings
-- =========================================================
create table if not exists public.risk_findings (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  analysis_id uuid not null references public.contract_analysis (id) on delete cascade,
  category text not null,
  severity text not null check (severity in ('high', 'medium', 'low', 'informational')),
  title text not null,
  explanation text not null,
  quote text,
  section_ref text,
  suggestion text,
  created_at timestamptz not null default now()
);

create index if not exists risk_findings_contract_id_idx on public.risk_findings (contract_id);
create index if not exists risk_findings_severity_idx on public.risk_findings (severity);

-- =========================================================
-- obligations
-- =========================================================
create table if not exists public.obligations (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  analysis_id uuid not null references public.contract_analysis (id) on delete cascade,
  description text not null,
  obligated_party text,
  due_date date,
  created_at timestamptz not null default now()
);

create index if not exists obligations_contract_id_idx on public.obligations (contract_id);

-- =========================================================
-- important_dates
-- =========================================================
create table if not exists public.important_dates (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  analysis_id uuid not null references public.contract_analysis (id) on delete cascade,
  label text not null,
  date_value date,
  date_type text not null check (date_type in ('renewal', 'expiration', 'notice_deadline', 'payment', 'termination', 'other')),
  created_at timestamptz not null default now()
);

create index if not exists important_dates_contract_id_idx on public.important_dates (contract_id);

-- =========================================================
-- reports — generated exports of a contract's analysis
-- =========================================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  generated_by uuid references auth.users (id) on delete set null,
  format text not null check (format in ('pdf', 'csv')),
  storage_path text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- usage_records — one row per billable/limited action, used for plan limits
-- =========================================================
create table if not exists public.usage_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  action text not null check (action in ('contract_upload', 'contract_analysis')),
  contract_id uuid references public.contracts (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists usage_records_org_created_idx on public.usage_records (organization_id, created_at desc);

-- =========================================================
-- updated_at triggers
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.organizations;
create trigger set_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.contracts;
create trigger set_updated_at before update on public.contracts
  for each row execute function public.set_updated_at();

-- =========================================================
-- auto-create a profile row whenever a new auth user signs up
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
