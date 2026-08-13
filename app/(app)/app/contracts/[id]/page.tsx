import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getOrgContext } from '@/lib/auth/get-org-context';
import { buildHighlightedSegments } from '@/lib/contracts/highlight';
import { ReviewClient } from './ReviewClient';
import { DeleteReviewButton } from './DeleteReviewButton';
import { AutoRefresh } from './AutoRefresh';

export default async function ContractReviewPage({ params }: { params: { id: string } }) {
  const orgContext = await getOrgContext();
  if (!orgContext) return null;

  const supabase = createClient();

  const { data: contract } = await supabase.from('contracts').select('*').eq('id', params.id).maybeSingle();
  if (!contract) notFound();

  const [{ data: documents }, { data: findings }, { data: obligations }, { data: importantDates }] = await Promise.all([
    supabase.from('contract_documents').select('*').eq('contract_id', params.id),
    supabase.from('risk_findings').select('*').eq('contract_id', params.id).order('created_at'),
    supabase.from('obligations').select('*').eq('contract_id', params.id).order('due_date', { nullsFirst: false }),
    supabase.from('important_dates').select('*').eq('contract_id', params.id).order('date_value', { nullsFirst: false }),
  ]);

  const documentText = documents?.[0]?.extracted_text ?? '';
  const allFindings = findings ?? [];
  const segments = buildHighlightedSegments(documentText, allFindings);

  const highCount = allFindings.filter((f) => f.severity === 'high').length;
  const medCount = allFindings.filter((f) => f.severity === 'medium').length;
  const lowCount = allFindings.filter((f) => f.severity === 'low' || f.severity === 'informational').length;
  const canExport = orgContext.organization.plan === 'business' || orgContext.organization.plan === 'firm';

  return (
    <>
      <div className="review-header">
        <div>
          <div className="breadcrumb">
            <Link href="/app">Dashboard</Link>
            <span className="sep">/</span>
            {contract.title || 'Untitled'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {contract.status === 'complete' && canExport && (
            <a className="btn btn-sm btn-ghost" href={`/api/contracts/${contract.id}/report?format=csv`}>
              Export CSV
            </a>
          )}
          {contract.status === 'complete' && !canExport && (
            <Link href="/pricing" className="btn btn-sm btn-quiet" title="Available on Business and Firm plans">
              Export CSV — upgrade to unlock
            </Link>
          )}
          <DeleteReviewButton contractId={contract.id} />
        </div>
      </div>

      {contract.status !== 'complete' && contract.status !== 'failed' && (
        <div className="analyzing" style={{ marginBottom: 24 }}>
          <div className="spinner" />
          <h3>
            {contract.status === 'uploaded' && 'Contract uploaded. Getting ready…'}
            {contract.status === 'processing' && 'Contract uploaded. Extracting text…'}
            {contract.status === 'analyzing' && 'AI analysis in progress…'}
          </h3>
          <p>This page will update automatically once the review is ready.</p>
          <AutoRefresh />
        </div>
      )}

      {contract.status === 'failed' && (
        <div className="form-error" style={{ marginBottom: 24 }}>
          {contract.error_message || 'Analysis failed.'}
        </div>
      )}

      {contract.status === 'complete' && (
        <>
          <div className="stat-row" style={{ marginBottom: 24 }}>
            <div className="stat">
              <div className="label">Document type</div>
              <div className="val" style={{ fontSize: 20 }}>{contract.doc_type || 'Agreement'}</div>
            </div>
            <div className="stat">
              <div className="label">Counterparty</div>
              <div className="val" style={{ fontSize: 18 }}>{contract.counterparty || '—'}</div>
            </div>
            <div className="stat">
              <div className="label">Total findings</div>
              <div className="val">{allFindings.length}</div>
            </div>
            <div className="stat">
              <div className="label">High severity</div>
              <div className="val risk">{highCount}</div>
            </div>
          </div>

          <ReviewClient
            documentTitle={contract.title}
            documentLength={documentText.length}
            docType={contract.doc_type}
            segments={segments}
            findings={allFindings}
            highCount={highCount}
            medCount={medCount}
            lowCount={lowCount}
            obligations={obligations ?? []}
            importantDates={importantDates ?? []}
          />
        </>
      )}
    </>
  );
}
