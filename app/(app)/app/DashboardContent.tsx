'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Contract, ContractStatus, RiskLevel } from '@/types/database';

type Row = Contract & { risk_findings: { severity: string; category: string }[] };

const STATUS_LABEL: Record<ContractStatus, string> = {
  uploaded: 'Uploaded',
  processing: 'Processing',
  analyzing: 'Analyzing',
  complete: 'Complete',
  failed: 'Failed',
};

export function DashboardContent({ contracts }: { contracts: Row[] }) {
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');

  const totalFindings = contracts.reduce((a, c) => a + c.risk_findings.length, 0);
  const highCount = contracts.reduce((a, c) => a + c.risk_findings.filter((f) => f.severity === 'high').length, 0);
  const catCount = new Set(contracts.flatMap((c) => c.risk_findings.map((f) => f.category))).size;

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      if (riskFilter !== 'all' && c.risk_level !== riskFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${c.title} ${c.counterparty ?? ''} ${c.doc_type ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [contracts, query, riskFilter, statusFilter]);

  return (
    <>
      <div className="stat-row">
        <div className="stat">
          <div className="label">Contracts</div>
          <div className="val">{contracts.length}</div>
        </div>
        <div className="stat">
          <div className="label">Total findings</div>
          <div className="val">{totalFindings}</div>
        </div>
        <div className="stat">
          <div className="label">High severity</div>
          <div className="val risk">{highCount}</div>
        </div>
        <div className="stat">
          <div className="label">Risk categories</div>
          <div className="val">{catCount}</div>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="empty">
          <div className="empty-mark">§</div>
          <h3>No contracts reviewed yet.</h3>
          <p>
            Upload your first agreement — a vendor MSA, an offer letter, an NDA — and ContractPilot
            AI will flag the risks.
          </p>
          <Link href="/app/new" className="btn btn-primary">
            Review a contract
          </Link>
        </div>
      ) : (
        <>
          <div className="filter-bar" style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search contracts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: '9px 12px',
                border: '1px solid var(--rule)',
                background: 'var(--white)',
                fontSize: 13,
                minWidth: 220,
              }}
            />
            {(['all', 'high', 'medium', 'low'] as const).map((r) => (
              <button
                key={r}
                className={`filter-btn${riskFilter === r ? ' active' : ''}`}
                onClick={() => setRiskFilter(r)}
              >
                {r === 'all' ? 'All risk' : r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
            {(['all', 'uploaded', 'processing', 'analyzing', 'complete', 'failed'] as const).map((s) => (
              <button
                key={s}
                className={`filter-btn${statusFilter === s ? ' active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All status' : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="contract-list">
            <div className="cl-row header">
              <div>Contract</div>
              <div className="cl-col">Type</div>
              <div className="cl-col">Findings</div>
              <div className="cl-col">High</div>
              <div className="cl-col">Reviewed</div>
              <div />
            </div>
            {filtered.map((c) => {
              const fCount = c.risk_findings.length;
              const hCount = c.risk_findings.filter((f) => f.severity === 'high').length;
              const date = new Date(c.created_at);
              const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <Link href={`/app/contracts/${c.id}`} className="cl-row" key={c.id}>
                  <div>
                    <div className="cl-title">{c.title || 'Untitled contract'}</div>
                    <div className="cl-meta">
                      {c.status !== 'complete' ? STATUS_LABEL[c.status] : c.counterparty || 'No counterparty identified'}
                    </div>
                  </div>
                  <div className="cl-col">
                    <span className="pill neutral">{c.doc_type || 'Agreement'}</span>
                  </div>
                  <div className="cl-col">
                    <span className="pill neutral">{fCount}</span>
                  </div>
                  <div className="cl-col">
                    {hCount > 0 ? <span className="pill high">{hCount} High</span> : <span className="pill low">None</span>}
                  </div>
                  <div className="cl-col" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mute)' }}>
                    {dateStr}
                  </div>
                  <div className="cl-arrow">→</div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
