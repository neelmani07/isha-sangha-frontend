type TwoToneHeadingProps = {
  title: string;
  /** Second line in a lighter, gold voice, e.g. "is a way of giving back". */
  subtitle?: string;
  eyebrow?: string;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
  className?: string;
};

export function TwoToneHeading({
  title,
  subtitle,
  eyebrow,
  as: Tag = 'h2',
  align = 'left',
  tone = 'dark',
  size = 'md',
  className = '',
}: TwoToneHeadingProps) {
  const titleSize = size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl';
  const subtitleSize = size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.24em] ${tone === 'dark' ? 'text-saffron' : 'text-gold-light/90'}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`font-display font-normal leading-[1.1] tracking-tight ${titleSize} ${tone === 'dark' ? 'text-ink' : 'text-cream'}`}>
        {title}
        {subtitle && (
          <span className={`mt-1 block italic ${subtitleSize} ${tone === 'dark' ? 'text-gold' : 'text-gold-light'}`}>{subtitle}</span>
        )}
      </Tag>
    </div>
  );
}
