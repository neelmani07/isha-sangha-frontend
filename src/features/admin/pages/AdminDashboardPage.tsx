import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { clearAdminToken } from '../../../api/apiClient';
import { adminApi } from '../api/adminApi';

export function AdminDashboardPage() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.dashboard,
  });

  return (
    <main className="min-h-screen bg-cream p-8 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-ink/70">Manage places, teachers, centers and member submissions.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/review" className="bg-saffron px-4 py-3 text-sm font-semibold text-cream">Review submissions</Link>
          <Link to="/" className="border border-ink/15 px-4 py-3 text-sm font-semibold">Public site</Link>
          <button onClick={clearAdminToken} className="bg-ink px-4 py-3 text-sm font-semibold text-cloud">Logout</button>
        </div>
      </div>

      {isLoading && <p className="mt-8">Loading dashboard...</p>}
      {isError && (
        <div className="mt-8 border border-ember/30 bg-white p-5">
          <p className="font-semibold text-ember">Admin data is unavailable.</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-saffron" to="/admin/login">Login again</Link>
        </div>
      )}

      {data && (
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <Metric label="Countries" value={data.countries.totalElements} />
          <Metric label="Cities" value={data.cities.totalElements} />
          <Metric label="Teachers" value={data.teachers.totalElements} />
          <Metric label="Centres" value={data.centers.totalElements} />
          <Metric label="Programmes" value={data.programs.totalElements} />
        </div>
      )}

      {data && (
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel title="Latest cities" items={data.cities.content.map((city) => city.name)} />
          <Panel title="Latest teachers" items={data.teachers.content.map((teacher) => teacher.name)} />
          <Panel title="Latest centres" items={data.centers.content.map((center) => center.name)} />
          <Panel title="Programmes" items={data.programs.content.map((program) => program.name)} />
        </section>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink/10 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold">{value}</p>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-ink/10 bg-white p-5">
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.length === 0 && <p className="text-sm text-ink/60">No records yet.</p>}
        {items.map((item) => (
          <div key={item} className="border border-ink/10 px-3 py-2 text-sm">{item}</div>
        ))}
      </div>
    </div>
  );
}
