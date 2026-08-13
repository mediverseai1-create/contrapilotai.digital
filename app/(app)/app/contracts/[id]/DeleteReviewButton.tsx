'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteReviewButton({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmedDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/contracts/${contractId}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/app');
      router.refresh();
    } else {
      setDeleting(false);
      setConfirming(false);
      setError('Failed to delete this review.');
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--ink-mute)' }}>Delete this review?</span>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          style={{ background: 'var(--redline)' }}
          onClick={handleConfirmedDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Confirm delete'}
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirming(false)} disabled={deleting}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {error && <span style={{ fontSize: 12, color: 'var(--redline)' }}>{error}</span>}
      <button
        type="button"
        className="btn btn-sm btn-ghost"
        style={{ borderColor: 'var(--redline)', color: 'var(--redline)' }}
        onClick={() => setConfirming(true)}
      >
        Delete review
      </button>
    </div>
  );
}
