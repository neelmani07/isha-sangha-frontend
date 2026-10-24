import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { Button } from '../../../components/ui/Button';
import { FormField, Input } from '../../../components/ui/Form';
import { Card } from '../../../components/ui/Card';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ishaworld.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await adminApi.login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cream p-6 text-ink">
      <Card className="w-full max-w-sm p-6">
        <form onSubmit={submit}>
          <h1 className="font-display text-3xl font-semibold">Admin Login</h1>
          <p className="mt-3 text-sm text-muted">
            Use the seeded local admin credentials or configure your own environment values.
          </p>
          <div className="mt-6 grid gap-3">
            <FormField label="Email">
              <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" />
            </FormField>
            <FormField label="Password">
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
              />
            </FormField>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {error && <p className="text-sm text-ember">{error}</p>}
          </div>
        </form>
      </Card>
    </main>
  );
}
