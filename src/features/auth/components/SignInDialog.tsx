import { ArrowLeft, Mail, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { IshaWorldLogo } from '../../../components/brand/IshaWorldLogo';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Form';
import { useSiteConfig } from '../../site/useSiteConfig';
import { authApi, type AuthResponse } from '../api/authApi';
import { GoogleSignInButton } from './GoogleSignInButton';

type Step = { kind: 'email' } | { kind: 'code'; email: string };

export function SignInDialog({
  onClose,
  onSignedIn,
}: {
  onClose: () => void;
  onSignedIn: (response: AuthResponse) => void;
}) {
  const site = useSiteConfig();
  const [step, setStep] = useState<Step>({ kind: 'email' });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [step.kind]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function requestCode(event?: FormEvent) {
    event?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    void run(async () => {
      await authApi.requestOtp(trimmed);
      setCode('');
      setNotice(`We sent a 6-digit code to ${trimmed}.`);
      setStep({ kind: 'code', email: trimmed });
    });
  }

  function verifyCode(event: FormEvent) {
    event.preventDefault();
    if (step.kind !== 'code') return;
    void run(async () => {
      onSignedIn(await authApi.verifyOtp(step.email, code.trim()));
    });
  }

  function handleGoogle(credential: string) {
    void run(async () => {
      onSignedIn(await authApi.google(credential));
    });
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm animate-fade-in" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sign-in-title"
        className="relative w-full max-w-sm animate-slide-up rounded-xl border border-border bg-white p-6 shadow-panel sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-muted hover:bg-sand hover:text-ink"
          aria-label="Close sign in"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <IshaWorldLogo size="md" />
          <h2 id="sign-in-title" className="mt-4 font-display text-2xl font-semibold text-ink">
            {step.kind === 'email' ? `Sign in to ${site.name}` : 'Enter your code'}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {step.kind === 'email'
              ? 'Share stories, like posts and list your initiatives.'
              : notice}
          </p>
        </div>

        {step.kind === 'email' ? (
          <div className="mt-6 space-y-5">
            {site.googleClientId && (
              <>
                <GoogleSignInButton clientId={site.googleClientId} onCredential={handleGoogle} />
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={requestCode} className="space-y-3">
              <label className="grid gap-2 text-sm font-medium text-ink/80">
                Email
                <Input
                  ref={firstFieldRef}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <Button type="submit" className="w-full" disabled={busy || !email.trim()}>
                <Mail size={16} />
                {busy ? 'Sending…' : 'Email me a sign-in code'}
              </Button>
            </form>
          </div>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-3">
            <Input
              ref={firstFieldRef}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              aria-label="6-digit code"
              className="text-center font-display text-2xl tracking-[0.5em]"
            />
            <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>
              {busy ? 'Checking…' : 'Sign in'}
            </Button>
            <div className="flex items-center justify-between pt-1 text-sm">
              <button
                type="button"
                className="inline-flex items-center gap-1 font-semibold text-muted hover:text-ink"
                onClick={() => {
                  setStep({ kind: 'email' });
                  setError(null);
                }}
              >
                <ArrowLeft size={14} /> Change email
              </button>
              <button type="button" className="font-semibold text-saffron-dark hover:text-saffron" disabled={busy} onClick={() => requestCode()}>
                Resend code
              </button>
            </div>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-md border border-ember/30 bg-saffron-light px-3 py-2 text-sm text-ember">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
