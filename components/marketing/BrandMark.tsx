export function BrandMark({ dark = true }: { dark?: boolean }) {
  return (
    <span className="mark" style={{ color: dark ? 'var(--vellum-soft)' : 'var(--ink)' }}>
      <span className="page" />
      <span className="title-rule" />
      <span className="redline" />
    </span>
  );
}
