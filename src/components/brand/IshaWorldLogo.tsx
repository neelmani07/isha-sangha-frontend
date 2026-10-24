type LogoSize = 'sm' | 'md' | 'header' | 'lg';

const sizes: Record<LogoSize, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  header: 'h-12 w-12 sm:h-14 sm:w-14',
  lg: 'h-16 w-16',
};

// Temporary logo: the copper serpent ring photo. Swap the file (or this component) before launch.
const LOGO_SRC = '/images/brand/logo-ring.jpg';

export function IshaWorldLogo({ size = 'md', className = '' }: { size?: LogoSize; className?: string }) {
  return (
    <span className={`relative block shrink-0 rounded-pill p-[2px] ring-1 ring-gold/60 ${sizes[size]} ${className}`} aria-hidden>
      <img src={LOGO_SRC} alt="" className="h-full w-full rounded-pill object-cover" />
    </span>
  );
}

/**
 * Site name set as a two-tone serif wordmark: the first word upright, the rest in vermilion italic,
 * with a small letter-spaced descriptor underneath.
 */
export function SiteWordmark({
  name,
  descriptor = 'a volunteer community',
  tone = 'dark',
  size = 'md',
  className = '',
}: {
  name: string;
  descriptor?: string | null;
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
  className?: string;
}) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const nameSize = size === 'lg' ? 'text-4xl' : 'text-[1.55rem] sm:text-[1.8rem]';

  return (
    <span className={`flex min-w-0 flex-col leading-none ${className}`}>
      <span className={`truncate font-display tracking-tight ${nameSize}`}>
        <span className={`font-semibold ${tone === 'dark' ? 'text-ink' : 'text-cream'}`}>{first}</span>
        {rest.length > 0 && (
          <span className={`ml-1.5 font-normal italic ${tone === 'dark' ? 'text-saffron-dark' : 'text-gold-light'}`}>{rest.join(' ')}</span>
        )}
      </span>
      {descriptor && (
        <span
          className={`mt-1.5 hidden text-[10px] font-semibold uppercase tracking-[0.34em] sm:block ${
            tone === 'dark' ? 'text-gold' : 'text-cream/50'
          }`}
        >
          {descriptor}
        </span>
      )}
    </span>
  );
}
