'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function OrganizationForm({
  organizationId,
  initialName,
  initialIndustry,
  initialCountry,
  initialCompanySize,
  editable,
}: {
  organizationId: string;
  initialName: string;
  initialIndustry: string;
  initialCountry: string;
  initialCompanySize: string;
  editable: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [industry, setIndustry] = useState(initialIndustry);
  const [country, setCountry] = useState(initialCountry);
  const [companySize, setCompanySize] = useState(initialCompanySize);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from('organizations')
      .update({ name, industry, country, company_size: companySize })
      .eq('id', organizationId);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <div className="field">
        <label htmlFor="orgName">Organization name</label>
        <input id="orgName" value={name} onChange={(e) => setName(e.target.value)} disabled={!editable} />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="industry">Industry</label>
          <input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!editable} />
        </div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled={!editable} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="companySize">Company size</label>
        <input id="companySize" value={companySize} onChange={(e) => setCompanySize(e.target.value)} disabled={!editable} />
      </div>
      {editable && (
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      )}
      {saved && <span style={{ marginLeft: 12, color: 'var(--sage)', fontSize: 13 }}>Saved</span>}
    </div>
  );
}
