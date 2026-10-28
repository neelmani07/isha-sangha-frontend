import { BookHeart, Globe2, HandCoins, Library, Lightbulb, LogOut, MapPinPlus, Menu, Store, UserRound, X } from 'lucide-react';
import { nav } from '../../content/copy';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useSiteConfig } from '../../features/site/useSiteConfig';
import { IshaWorldLogo, SiteWordmark } from '../brand/IshaWorldLogo';

// Everything that belongs to the Explore section (globe, nearby, search and detail pages).
const explorePrefixes = ['/nearby', '/search', '/city', '/teacher', '/center'];

export const navItems = [
  { to: '/', label: nav.explore, icon: Globe2, isActive: (path: string) => path === '/' || explorePrefixes.some((p) => path.startsWith(p)) },
  { to: '/stories', label: nav.stories, icon: BookHeart, isActive: (path: string) => path.startsWith('/stories') },
  { to: '/initiatives', label: nav.initiatives, icon: Lightbulb, isActive: (path: string) => path.startsWith('/initiatives') },
  { to: '/resources', label: nav.resources, icon: Library, isActive: (path: string) => path.startsWith('/resources') },
  { to: '/shop', label: nav.shop, icon: Store, isActive: (path: string) => path.startsWith('/shop') },
  { to: '/donate', label: nav.donate, icon: HandCoins, isActive: (path: string) => path.startsWith('/donate') },
];

// Donate is rendered as a call-to-action button, not a plain tab.
const tabItems = navItems.filter((item) => item.to !== '/donate');

/** Pages that open with a dark, full-bleed header: the top bar floats over them until the visitor scrolls. */
export function isOverlayRoute(path: string) {
  return (
    path === '/' ||
    path.startsWith('/stories') ||
    path.startsWith('/initiatives') ||
    path.startsWith('/donate') ||
    path === '/resources' ||
    path === '/shop'
  );
}

export function AppHeader() {
  const location = useLocation();
  const site = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const transparent = isOverlayRoute(location.pathname) && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        transparent
          ? 'border-transparent bg-gradient-to-b from-ink/45 to-transparent'
          : 'border-border bg-cream/95 shadow-card backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center sm:h-20 justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label={`${site.name} home`}>
          <IshaWorldLogo size="header" />
          <SiteWordmark name={site.name} tone={transparent ? 'light' : 'dark'} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {tabItems.map((item) => {
            const active = item.isActive(location.pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`relative inline-flex items-center gap-2 px-3 py-2 text-[15px] font-semibold transition after:absolute after:inset-x-3 after:-bottom-[22px] after:h-0.5 after:rounded-pill ${
                  active
                    ? `${transparent ? 'text-cream' : 'text-ink'} after:bg-saffron`
                    : `${transparent ? 'text-cream/75 hover:text-cream' : 'text-muted hover:text-ink'} after:bg-transparent`
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/donate"
            className="hidden items-center gap-2 rounded-md bg-saffron px-4 py-2 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark sm:inline-flex"
          >
            <HandCoins size={16} />
            Donate
          </Link>
          <AccountControl transparent={transparent} />
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center rounded-md border md:hidden ${
              transparent ? 'border-cream/30 text-cream' : 'border-border text-ink'
            }`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-white px-4 py-3 md:hidden" aria-label="Main">
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold ${
                  item.isActive(location.pathname) ? 'bg-saffron-light text-saffron-dark' : 'text-ink hover:bg-sand'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function AccountControl({ transparent }: { transparent: boolean }) {
  const { user, loading, openSignIn, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  if (loading) {
    return <span className="h-10 w-10 animate-pulse rounded-pill bg-sand" aria-hidden />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={openSignIn}
        className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
          transparent
            ? 'border-cream/35 bg-cream/10 text-cream backdrop-blur-sm hover:bg-cream/20'
            : 'border-border bg-white text-ink hover:border-saffron/50 hover:text-saffron-dark'
        }`}
      >
        Sign in
      </button>
    );
  }

  const label = user.name || user.email;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="flex items-center gap-2 rounded-pill border border-border bg-white py-1 pl-1 pr-3 text-sm font-semibold text-ink hover:border-saffron/40"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        <UserAvatar name={label} url={user.avatarUrl} />
        <span className="hidden max-w-[140px] truncate sm:inline">{user.name || user.email.split('@')[0]}</span>
      </button>
      {menuOpen && (
        <div role="menu" className="absolute right-0 mt-2 w-60 animate-fade-in rounded-lg border border-border bg-white p-2 shadow-panel">
          <p className="truncate px-3 py-2 text-xs text-muted">{user.email}</p>
          <Link
            to="/me"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-sand"
          >
            <UserRound size={16} /> My profile & listings
          </Link>
          <Link
            to="/join"
            role="menuitem"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-sand"
          >
            <MapPinPlus size={16} /> Join the map
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenuOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-sand"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function UserAvatar({ name, url }: { name: string; url: string | null }) {
  const [broken, setBroken] = useState(false);

  if (url && !broken) {
    return <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-8 w-8 rounded-pill object-cover" />;
  }

  return (
    <span className="grid h-8 w-8 place-items-center rounded-pill bg-saffron-light text-sm font-bold uppercase text-saffron-dark" aria-hidden>
      {name.charAt(0)}
    </span>
  );
}
