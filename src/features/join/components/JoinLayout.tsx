import { ArrowLeft, LogIn } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Ornament } from '../../../components/brand/Ornament';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { useAuth } from '../../auth/context/AuthContext';

/** Frame for the "join the map" pages: heading band, back link, and a sign-in gate. */
export function JoinLayout({
  title,
  subtitle,
  intro,
  back = { to: '/join', label: 'Join the map' },
  requireSignIn = true,
  children,
}: {
  title: string;
  subtitle: string;
  intro?: ReactNode;
  back?: { to: string; label: string } | null;
  requireSignIn?: boolean;
  children: ReactNode;
}) {
  const { user, loading, openSignIn } = useAuth();

  return (
    <main className="font-body text-ink">
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
          {back && (
            <Link to={back.to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
              <ArrowLeft size={16} /> {back.label}
            </Link>
          )}
          <TwoToneHeading as="h1" size="lg" className="mt-5" title={title} subtitle={subtitle} />
          <Ornament className="mt-5" />
          {intro && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</div>}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {requireSignIn && !loading && !user ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center shadow-card">
            <p className="font-display text-2xl">Please sign in first</p>
            <p className="mt-2 text-muted">It only takes a minute: use Google or a code sent to your email.</p>
            <button
              type="button"
              onClick={openSignIn}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream hover:bg-saffron-dark"
            >
              <LogIn size={16} /> Sign in
            </button>
          </div>
        ) : (
          children
        )}
      </section>
    </main>
  );
}

/** A labelled form section with an optional hint. */
export function FormSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-border bg-white p-5 shadow-card sm:p-6">
      <legend className="sr-only">{title}</legend>
      <p className="font-display text-xl">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </fieldset>
  );
}
