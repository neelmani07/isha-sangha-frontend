import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppFooter } from '../components/layout/AppFooter';
import { AppHeader, isOverlayRoute } from '../components/layout/AppHeader';
import { SampleDataNotice } from '../components/layout/SampleDataNotice';

export function PublicLayout() {
  const location = useLocation();

  // New page starts at the top (deep links like /#nearby scroll themselves into place).
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      {/* The header is fixed; light pages get a spacer, dark-header pages slide underneath it. */}
      {!isOverlayRoute(location.pathname) && <div className="h-[var(--header-h)] shrink-0" aria-hidden />}
      {/* Keyed by path so each page fades in, while the header and footer stay mounted. */}
      <div key={location.pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </div>
      <AppFooter />
      <SampleDataNotice />
    </div>
  );
}
