'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ProfileForm({
  initialName,
  initialJobRole,
  email,
}: {
  initialName: string;
  initialJobRole: string;
  email: string;
}) {
  const [name, setName] = useState(initialName);
  const [jobRole, setJobRole] = useState(initialJobRole);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ full_name: name, job_role: jobRole }).eq('id', user.id);
    }
    setSaving(false);
    setSaved(true);
  }

  return (
    <div>
      <div className="field">
        <label>Email</label>
        <input value={email} disabled style={{ opacity: 0.6 }} />
      </div>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="jobRole">Role</label>
        <input id="jobRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      {saved && <span style={{ marginLeft: 12, color: 'var(--sage)', fontSize: 13 }}>Saved</span>}
    </div>
  );
}
