'use client';

import { useState } from 'react';
import type { ImportantDate, Obligation, RiskFinding } from '@/types/database';
import type { TextSegment } from '@/lib/contracts/highlight';

type Filter = 'all' | 'high' | 'medium' | 'low';

const DATE_TYPE_LABEL: Record<ImportantDate['date_type'], string> = {
  renewal: 'Renewal',
  expiration: 'Expiration',
  notice_deadline: 'Notice deadline',
  payment: 'Payment',
  termination: 'Termination',
  other: 'Other',
};

export function ReviewClient({
  documentTitle,
  documentLength,
  docType,
  segments,
  findings,
  highCount,
  medCount,
  lowCount,
  obligations,
  importantDates,
}: {
  documentTitle: string;
  documentLength: number;
  docType: string | null;
  segments: TextSegment[];
  findings: RiskFinding[];
  highCount: number;
  medCount: number;
  lowCount: number;
  obligations: Obligation[];
  importantDates: ImportantDate[];
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleFindings =
    filter === 'all'
      ? findings
      : findings.filter((f) => (filter === 'low' ? f.severity === 'low' || f.severity === 'informational' : f.severity === filter));

  return (
    <>
      <div className="review-layout">
        <div className="review-doc">
          <h2>{documentTitle || 'Untitled contract'}</h2>
          <div className="doc-meta">
            {docType || 'Agreement'} · {documentLength.toLocaleString()} characters
          </div>
          <div className="doc-text">
            {segments.map((seg, i) =>
              seg.type === 'text' ? (
                <span key={i}>{seg.content}</span>
              ) : (
                <span
                  key={i}
                  className={`highlight ${seg.severity}${activeId === seg.findingId ? ' active' : ''}`}
                  onClick={() => setActiveId(seg.findingId)}
                >
                  {seg.content}
                </span>
              )
            )}
          </div>
        </div>
        <aside className="review-findings">
          <div className="rf-head">
            <span className="label">Findings</span>
            <span className="total">{findings.length}</span>
          </div>
          <div className="filter-bar">
            <button className={`filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>
              All · {findings.length}
            </button>
            <button className={`filter-btn${filter === 'high' ? ' active' : ''}`} onClick={() => setFilter('high')}>
              High · {highCount}
            </button>
            <button className={`filter-btn${filter === 'medium' ? ' active' : ''}`} onClick={() => setFilter('medium')}>
              Medium · {medCount}
            </button>
            <button className={`filter-btn${filter === 'low' ? ' active' : ''}`} onClick={() => setFilter('low')}>
              Low · {lowCount}
            </button>
          </div>
          <div>
            {visibleFindings.map((f) => (
              <div
                key={f.id}
                className={`review-finding ${f.severity}${activeId === f.id ? ' active' : ''}`}
                onClick={() => setActiveId(f.id)}
              >
                <div className="rf-title">
                  <span className="cat">
                    {f.category}
                    {f.section_ref ? ` · ${f.section_ref}` : ''}
                  </span>
                  <span className="sev">{f.severity}</span>
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 16, marginBottom: 6, lineHeight: 1.3, letterSpacing: '-0.005em' }}>
                  {f.title}
                </div>
                {f.quote && <div className="rf-quote">&quot;{f.quote.slice(0, 240)}{f.quote.length > 240 ? '…' : ''}&quot;</div>}
                <div className="rf-explain">{f.explanation}</div>
                {f.suggestion && (
                  <div className="rf-suggest">
                    <span className="label">Suggest</span>
                    <span>{f.suggestion}</span>
                  </div>
                )}
              </div>
            ))}
            {visibleFindings.length === 0 && (
              <p style={{ color: 'var(--ink-mute)', fontSize: 14, padding: '20px 0' }}>No findings in this category.</p>
            )}
          </div>
        </aside>
      </div>

      {(obligations.length > 0 || importantDates.length > 0) && (
        <div className="two-col" style={{ marginTop: 40 }}>
          {obligations.length > 0 && (
            <div className="secondary" style={{ borderTop: '2px solid var(--ink)', paddingTop: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Obligations</div>
              <dl>
                {obligations.map((o) => (
                  <div key={o.id} style={{ display: 'contents' }}>
                    <dt>{o.obligated_party || 'Party'}</dt>
                    <dd>
                      {o.description}
                      {o.due_date && <span style={{ color: 'var(--ink-mute)' }}> — due {o.due_date}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {importantDates.length > 0 && (
            <div className="secondary" style={{ borderTop: '2px solid var(--ink)', paddingTop: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Important dates</div>
              <dl>
                {importantDates.map((d) => (
                  <div key={d.id} style={{ display: 'contents' }}>
                    <dt>{DATE_TYPE_LABEL[d.date_type]}</dt>
                    <dd>
                      {d.label}
                      {d.date_value && <span style={{ color: 'var(--ink-mute)' }}> — {d.date_value}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </>
  );
}
