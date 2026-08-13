import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrgContext } from '@/lib/auth/get-org-context';

function csvEscape(value: string | null | undefined): string {
  const str = (value ?? '').replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const orgContext = await getOrgContext();
  if (!orgContext) return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });

  if (orgContext.organization.plan !== 'business' && orgContext.organization.plan !== 'firm') {
    return NextResponse.json(
      { error: 'Exporting findings is available on the Business and Firm plans.' },
      { status: 403 }
    );
  }

  const supabase = createClient();

  const { data: contract } = await supabase.from('contracts').select('*').eq('id', params.id).maybeSingle();
  if (!contract) return NextResponse.json({ error: 'Contract not found.' }, { status: 404 });

  const { data: findings } = await supabase
    .from('risk_findings')
    .select('*')
    .eq('contract_id', params.id)
    .order('created_at');

  const header = ['Category', 'Severity', 'Title', 'Explanation', 'Quote', 'Section', 'Suggestion'];
  const rows = (findings ?? []).map((f) =>
    [f.category, f.severity, f.title, f.explanation, f.quote, f.section_ref, f.suggestion].map(csvEscape).join(',')
  );
  const csv = [header.join(','), ...rows].join('\n');

  await supabase.from('reports').insert({
    contract_id: params.id,
    organization_id: orgContext.organization.id,
    generated_by: orgContext.userId,
    format: 'csv',
  });

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${(contract.title || 'contract').replace(/[^a-z0-9]/gi, '_')}-findings.csv"`,
    },
  });
}
