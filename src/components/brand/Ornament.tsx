/** Hand-drawn style divider: two tapered strokes meeting at a small lotus bud. */
export function Ornament({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'light' }) {
  const color = tone === 'gold' ? '#b8862b' : '#f3e6c8';

  return (
    <svg className={className} width="220" height="24" viewBox="0 0 220 24" fill="none" aria-hidden>
      <path d="M4 12 C40 12 70 9 96 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M216 12 C180 12 150 15 124 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="12" r="1.6" fill={color} />
      <circle cx="210" cy="12" r="1.6" fill={color} />
      <path d="M110 3 C104 8 104 15 110 21 C116 15 116 8 110 3 Z" fill={color} opacity="0.9" />
      <path d="M110 21 C102 19 97 14 96 9 C102 10 107 14 110 21 Z" fill={color} opacity="0.55" />
      <path d="M110 21 C118 19 123 14 124 9 C118 10 113 14 110 21 Z" fill={color} opacity="0.55" />
    </svg>
  );
}
