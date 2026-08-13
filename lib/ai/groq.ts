import OpenAI from 'openai';
import { contractAnalysisSchema, type ContractAnalysisResult } from './schema';

export class AIConfigError extends Error {
  constructor() {
    super('GROQ_API_KEY is not configured on the server.');
    this.name = 'AIConfigError';
  }
}

export const AI_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_INSTRUCTION = `You are a contract review assistant for ContractPilot AI, a B2B tool that helps
business teams (not lawyers) understand risk in commercial contracts before signing.

Read the contract text provided and produce a structured analysis grounded strictly in what the
text actually says. Rules:
- Never invent clauses, dates, parties, or obligations that are not present in the text.
- Every finding must be traceable to an actual quote from the provided text, OR explicitly note
  that it concerns something the contract is missing (in which case quote should be null).
- Use cautious, non-definitive language ("potential risk", "may expose", "consider reviewing") —
  never state a clause is legally invalid or unenforceable. You are not a lawyer and this is not
  legal advice.
- Severity: "high" = could cause significant financial/legal exposure; "medium" = worth
  negotiating; "low" = minor; "informational" = neutral observation worth noting.
- Return ONLY valid JSON matching the exact schema described in the response format. No markdown,
  no commentary outside the JSON.`;

export async function analyzeContractText(text: string): Promise<ContractAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AIConfigError();
  }

  const client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });

  const userPrompt = `Analyze this contract and return JSON with exactly this shape:
{
  "doc_type": string,               // e.g. "Vendor MSA", "NDA", "Employment agreement"
  "counterparty": string | null,    // the other party's name if identifiable
  "summary": string,                // 2-4 sentence plain-English overview
  "overall_risk": "high" | "medium" | "low",
  "findings": [
    {
      "category": string,          // e.g. "Auto-renewal", "Indemnification", "Liability cap"
      "severity": "high" | "medium" | "low" | "informational",
      "title": string,
      "explanation": string,       // plain English, why this matters
      "quote": string | null,      // exact text from the contract, or null if this is a missing-term finding
      "section_ref": string | null,
      "suggestion": string | null  // what to review or consider negotiating
    }
  ],
  "obligations": [
    { "description": string, "obligated_party": string | null, "due_date": string | null }
  ],
  "important_dates": [
    { "label": string, "date_value": string | null, "date_type": "renewal" | "expiration" | "notice_deadline" | "payment" | "termination" | "other" }
  ]
}

Contract text:
"""
${text.slice(0, 100_000)}
"""`;

  const completion = await client.chat.completions.create({
    model: AI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'user', content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '';

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI response was not valid JSON.');
  }

  return contractAnalysisSchema.parse(parsed);
}
