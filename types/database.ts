export type ContractStatus = 'uploaded' | 'processing' | 'analyzing' | 'complete' | 'failed';
export type RiskLevel = 'high' | 'medium' | 'low';
export type Severity = 'high' | 'medium' | 'low' | 'informational';
export type DateType = 'renewal' | 'expiration' | 'notice_deadline' | 'payment' | 'termination' | 'other';
export type OrgRole = 'owner' | 'admin' | 'member';
export type PlanId = 'solo' | 'team' | 'business' | 'firm';

export interface Profile {
  id: string;
  full_name: string | null;
  job_role: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  company_size: string | null;
  plan: PlanId;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
}

export interface Contract {
  id: string;
  organization_id: string;
  uploaded_by: string;
  title: string;
  doc_type: string | null;
  counterparty: string | null;
  source_type: 'file' | 'paste';
  status: ContractStatus;
  risk_level: RiskLevel | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractDocument {
  id: string;
  contract_id: string;
  organization_id: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  storage_path: string | null;
  extracted_text: string | null;
  created_at: string;
}

export interface ContractAnalysis {
  id: string;
  contract_id: string;
  organization_id: string;
  summary: string | null;
  overall_risk: RiskLevel | null;
  model: string;
  raw_response: unknown;
  created_at: string;
}

export interface RiskFinding {
  id: string;
  contract_id: string;
  organization_id: string;
  analysis_id: string;
  category: string;
  severity: Severity;
  title: string;
  explanation: string;
  quote: string | null;
  section_ref: string | null;
  suggestion: string | null;
  created_at: string;
}

export interface Obligation {
  id: string;
  contract_id: string;
  organization_id: string;
  analysis_id: string;
  description: string;
  obligated_party: string | null;
  due_date: string | null;
  created_at: string;
}

export interface ImportantDate {
  id: string;
  contract_id: string;
  organization_id: string;
  analysis_id: string;
  label: string;
  date_value: string | null;
  date_type: DateType;
  created_at: string;
}

export interface Report {
  id: string;
  contract_id: string;
  organization_id: string;
  generated_by: string | null;
  format: 'pdf' | 'csv';
  storage_path: string | null;
  created_at: string;
}

export interface UsageRecord {
  id: string;
  organization_id: string;
  user_id: string | null;
  action: 'contract_upload' | 'contract_analysis';
  contract_id: string | null;
  created_at: string;
}

export interface ContractWithFindings extends Contract {
  contract_documents: ContractDocument[];
  contract_analysis: ContractAnalysis | null;
  risk_findings: RiskFinding[];
  obligations: Obligation[];
  important_dates: ImportantDate[];
}
