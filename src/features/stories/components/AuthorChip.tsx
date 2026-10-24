export function AuthorChip({ name, detail, tone = 'dark' }: { name: string; detail?: string; tone?: 'dark' | 'light' }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-pill font-display text-sm font-semibold ${
          tone === 'dark' ? 'bg-gold-light text-maroon' : 'bg-cream/20 text-cream'
        }`}
        aria-hidden
      >
        {initials}
      </span>
      <span className="leading-tight">
        <span className={`block text-sm font-semibold ${tone === 'dark' ? 'text-ink' : 'text-cream'}`}>{name}</span>
        {detail && <span className={`block text-xs ${tone === 'dark' ? 'text-muted' : 'text-cream/75'}`}>{detail}</span>}
      </span>
    </span>
  );
}
