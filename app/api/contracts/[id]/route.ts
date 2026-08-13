import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrgContext } from '@/lib/auth/get-org-context';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const orgContext = await getOrgContext();
  if (!orgContext) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

  const supabase = createClient();

  const { data: contract } = await supabase
    .from('contract_documents')
    .select('storage_path')
    .eq('contract_id', params.id)
    .maybeSingle();

  if (contract?.storage_path) {
    await supabase.storage.from('contracts').remove([contract.storage_path]);
  }

  // RLS scopes this delete to the caller's organization — a request for a
  // contract belonging to a different org simply matches zero rows.
  const { error } = await supabase.from('contracts').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
