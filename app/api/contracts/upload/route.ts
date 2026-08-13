import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOrgContext } from '@/lib/auth/get-org-context';
import { extractTextFromFile } from '@/lib/contracts/extract-text';
import { processContractAnalysis } from '@/lib/contracts/process';
import { getMonthlyContractLimit } from '@/lib/plans';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
]);
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const orgContext = await getOrgContext();
  if (!orgContext) {
    return NextResponse.json({ error: 'You need to finish onboarding before uploading contracts.' }, { status: 403 });
  }

  const supabase = createClient();
  const { organization, userId } = orgContext;

  const limit = getMonthlyContractLimit(organization.plan);
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

    if ((count ?? 0) >= limit) {
      return NextResponse.json(
        { error: `You've used all ${limit} contracts included in the Solo plan this month. Upgrade to review more.` },
        { status: 402 }
      );
    }
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const pastedText = (formData.get('pastedText') as string | null)?.trim() || null;
  const titleInput = (formData.get('title') as string | null)?.trim() || null;

  if (!file && !pastedText) {
    return NextResponse.json({ error: 'Provide a file or paste the contract text.' }, { status: 400 });
  }

  if (file) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type. Upload a PDF, DOCX, or TXT file.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File is larger than the 10 MB limit.' }, { status: 400 });
    }
  }

  const fallbackTitle = file ? file.name.replace(/\.[^/.]+$/, '') : 'Pasted contract';

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .insert({
      organization_id: organization.id,
      uploaded_by: userId,
      title: titleInput || fallbackTitle,
      source_type: file ? 'file' : 'paste',
      status: 'uploaded',
    })
    .select()
    .single();

  if (contractError || !contract) {
    return NextResponse.json({ error: contractError?.message ?? 'Failed to create contract record.' }, { status: 500 });
  }

  let extractedText = pastedText ?? '';
  let storagePath: string | null = null;

  try {
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      storagePath = `${organization.id}/${contract.id}/${file.name}`;

      const { error: uploadError } = await supabase.storage.from('contracts').upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });
      if (uploadError) throw new Error(uploadError.message);

      extractedText = await extractTextFromFile(buffer, file.type);
    }

    await supabase.from('contract_documents').insert({
      contract_id: contract.id,
      organization_id: organization.id,
      file_name: file?.name ?? null,
      file_type: file?.type ?? 'text/plain',
      file_size: file?.size ?? extractedText.length,
      storage_path: storagePath,
      extracted_text: extractedText,
    });

    await supabase.from('usage_records').insert({
      organization_id: organization.id,
      user_id: userId,
      action: 'contract_upload',
      contract_id: contract.id,
    });

    await supabase.from('contracts').update({ status: 'processing' }).eq('id', contract.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to process the uploaded document.';
    await supabase.from('contracts').update({ status: 'failed', error_message: message }).eq('id', contract.id);
    return NextResponse.json({ contractId: contract.id, error: message }, { status: 200 });
  }

  await processContractAnalysis(supabase, contract.id, organization.id, extractedText);

  return NextResponse.json({ contractId: contract.id });
}
