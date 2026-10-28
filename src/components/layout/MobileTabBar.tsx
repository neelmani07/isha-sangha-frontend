import { Link, useLocation } from 'react-router-dom';
import { navItems } from './AppHeader';

// Donate stays as the button in the top bar; the five sections sit at the bottom.
const tabs = navItems.filter((item) => item.to !== '/donate');

/** Phones only (hidden from tablet width up): the main sections, always one tap away at the bottom of the screen. */
export function MobileTabBar() {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid h-16 grid-cols-5">
        {tabs.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                  active ? 'text-saffron' : 'text-muted hover:text-ink'
                }`}
              >
                {active && <span className="absolute inset-x-4 top-0 h-0.5 rounded-b bg-saffron" aria-hidden />}
                <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
