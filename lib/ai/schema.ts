import { z } from 'zod';

export const findingSchema = z.object({
  category: z.string(),
  severity: z.enum(['high', 'medium', 'low', 'informational']),
  title: z.string(),
  explanation: z.string(),
  quote: z.string().nullable().optional(),
  section_ref: z.string().nullable().optional(),
  suggestion: z.string().nullable().optional(),
});

export const obligationSchema = z.object({
  description: z.string(),
  obligated_party: z.string().nullable().optional(),
  due_date: z.string().nullable().optional(),
});

export const importantDateSchema = z.object({
  label: z.string(),
  date_value: z.string().nullable().optional(),
  date_type: z.enum(['renewal', 'expiration', 'notice_deadline', 'payment', 'termination', 'other']),
});

export const contractAnalysisSchema = z.object({
  doc_type: z.string(),
  counterparty: z.string().nullable().optional(),
  summary: z.string(),
  overall_risk: z.enum(['high', 'medium', 'low']),
  findings: z.array(findingSchema),
  obligations: z.array(obligationSchema),
  important_dates: z.array(importantDateSchema),
});

export type ContractAnalysisResult = z.infer<typeof contractAnalysisSchema>;
