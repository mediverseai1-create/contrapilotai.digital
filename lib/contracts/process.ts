import type { SupabaseClient } from '@supabase/supabase-js';
import { analyzeContractText, AIConfigError, AI_MODEL } from '@/lib/ai/groq';

/**
 * Runs AI analysis against already-extracted contract text and persists the
 * structured results. Called synchronously from the upload route after the
 * document + text are stored — status transitions (`processing` -> `analyzing`
 * -> `complete`/`failed`) are visible to the client via polling/refetch.
 *
 * `supabase` must be a client whose session belongs to the uploading user
 * (RLS enforces org scoping normally) — we still pass organizationId
 * explicitly since it's stamped onto every child row.
 */
export async function processContractAnalysis(
  supabase: SupabaseClient,
  contractId: string,
  organizationId: string,
  text: string
): Promise<void> {
  await supabase.from('contracts').update({ status: 'analyzing' }).eq('id', contractId);

  if (!text || text.trim().length < 20) {
    await supabase
      .from('contracts')
      .update({ status: 'failed', error_message: "We couldn't extract readable text from this document." })
      .eq('id', contractId);
    return;
  }

  try {
    const analysis = await analyzeContractText(text);

    const { data: analysisRow, error: analysisError } = await supabase
      .from('contract_analysis')
      .insert({
        contract_id: contractId,
        organization_id: organizationId,
        summary: analysis.summary,
        overall_risk: analysis.overall_risk,
        model: AI_MODEL,
        raw_response: analysis,
      })
      .select()
      .single();

    if (analysisError || !analysisRow) throw new Error(analysisError?.message ?? 'Failed to store analysis');

    if (analysis.findings.length > 0) {
      await supabase.from('risk_findings').insert(
        analysis.findings.map((f) => ({
          contract_id: contractId,
          organization_id: organizationId,
          analysis_id: analysisRow.id,
          category: f.category,
          severity: f.severity,
          title: f.title,
          explanation: f.explanation,
          quote: f.quote ?? null,
          section_ref: f.section_ref ?? null,
          suggestion: f.suggestion ?? null,
        }))
      );
    }

    if (analysis.obligations.length > 0) {
      await supabase.from('obligations').insert(
        analysis.obligations.map((o) => ({
          contract_id: contractId,
          organization_id: organizationId,
          analysis_id: analysisRow.id,
          description: o.description,
          obligated_party: o.obligated_party ?? null,
          due_date: o.due_date ?? null,
        }))
      );
    }

    if (analysis.important_dates.length > 0) {
      await supabase.from('important_dates').insert(
        analysis.important_dates.map((d) => ({
          contract_id: contractId,
          organization_id: organizationId,
          analysis_id: analysisRow.id,
          label: d.label,
          date_value: d.date_value ?? null,
          date_type: d.date_type,
        }))
      );
    }

    await supabase
      .from('contracts')
      .update({
        status: 'complete',
        risk_level: analysis.overall_risk,
        doc_type: analysis.doc_type,
        counterparty: analysis.counterparty ?? null,
      })
      .eq('id', contractId);
  } catch (err) {
    const message =
      err instanceof AIConfigError
        ? 'AI analysis is not configured yet. An administrator needs to add a GROQ_API_KEY.'
        : err instanceof Error
          ? err.message
          : 'Analysis failed unexpectedly.';

    await supabase.from('contracts').update({ status: 'failed', error_message: message }).eq('id', contractId);
  }
}
