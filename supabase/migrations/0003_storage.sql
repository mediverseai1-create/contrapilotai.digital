-- ContractPilot AI — Storage bucket + policies
-- Uploaded contract files live in a private bucket, path-namespaced by
-- organization: {organization_id}/{contract_id}/{filename}

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "contracts_storage_select_org" on storage.objects
  for select using (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1]::uuid in (select public.get_user_org_ids())
  );

create policy "contracts_storage_insert_org" on storage.objects
  for insert with check (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1]::uuid in (select public.get_user_org_ids())
  );

create policy "contracts_storage_delete_org" on storage.objects
  for delete using (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1]::uuid in (select public.get_user_org_ids())
  );
