'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push('/app');
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1 className="display">Set a new password.</h1>
      <p className="auth-sub">Follow the link in your email, then set a new password here.</p>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label htmlFor="password">New password</label>
        <input
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="hint">At least 8 characters.</div>
      </div>
      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  );
}
