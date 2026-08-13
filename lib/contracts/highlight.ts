import type { RiskFinding } from '@/types/database';

export type TextSegment =
  | { type: 'text'; content: string }
  | { type: 'highlight'; content: string; severity: RiskFinding['severity']; findingId: string };

/**
 * Locates each finding's quoted text inside the full contract text and
 * splits the document into plain/highlighted segments for rendering.
 * Findings without a quote (missing-term findings) or whose quote can't be
 * located verbatim are simply not highlighted in the document body.
 */
export function buildHighlightedSegments(text: string, findings: RiskFinding[]): TextSegment[] {
  const matches: { start: number; end: number; severity: RiskFinding['severity']; id: string }[] = [];

  for (const f of findings) {
    if (!f.quote) continue;
    const idx = text.indexOf(f.quote);
    if (idx === -1) continue;
    matches.push({ start: idx, end: idx + f.quote.length, severity: f.severity, id: f.id });
  }

  matches.sort((a, b) => a.start - b.start);

  const filtered: typeof matches = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const m of filtered) {
    if (m.start > cursor) segments.push({ type: 'text', content: text.slice(cursor, m.start) });
    segments.push({ type: 'highlight', content: text.slice(m.start, m.end), severity: m.severity, findingId: m.id });
    cursor = m.end;
  }
  if (cursor < text.length) segments.push({ type: 'text', content: text.slice(cursor) });

  return segments;
}
