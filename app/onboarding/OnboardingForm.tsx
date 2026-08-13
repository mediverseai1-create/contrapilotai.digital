'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+'];

export function OnboardingForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [companySize, setCompanySize] = useState(COMPANY_SIZES[0]);
  const [jobRole, setJobRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc('create_organization_with_owner', {
      org_name: orgName,
      org_industry: industry,
      org_country: country,
      org_company_size: companySize,
      user_job_role: jobRole,
    });

    setLoading(false);

    if (rpcError) {
      setError(rpcError.message);
      return;
    }

    router.push('/app');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label htmlFor="orgName">Company / organization name</label>
        <input
          id="orgName"
          required
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Logistics"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="industry">Industry</label>
          <input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Logistics"
          />
        </div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
          />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="companySize">Company size</label>
          <select id="companySize" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} employees
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="jobRole">Your role</label>
          <input
            id="jobRole"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="Head of Operations"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading || !orgName}>
        {loading ? 'Setting up…' : 'Continue to dashboard'}
      </button>
    </form>
  );
}
