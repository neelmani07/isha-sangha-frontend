import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, EyeOff, PenLine, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Form';
import { adminApi, type ManageKind, type ManageRow } from '../api/adminApi';
import { CentreEditPanel, CityEditPanel, TeacherEditPanel } from '../components/EditPanels';

const tabs: { value: ManageKind; label: string }[] = [
  { value: 'CENTER', label: 'Centres' },
  { value: 'TEACHER', label: 'Teachers' },
  { value: 'CITY', label: 'Cities' },
  { value: 'MEDITATOR', label: 'Meditators' },
  { value: 'INITIATIVE', label: 'Initiatives' },
  { value: 'RESOURCE', label: 'Links' },
  { value: 'STORY', label: 'Stories' },
  { value: 'PRODUCT', label: 'Shop' },
];

const editable: ManageKind[] = ['CENTER', 'TEACHER', 'CITY'];

/** Admin screen to find any entry, fix its details or pin, and hide or unhide it. */
export function AdminManagePage() {
  const [kind, setKind] = useState<ManageKind>('CENTER');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const rows = useQuery({ queryKey: ['manage', kind, debounced], queryFn: () => adminApi.manageSearch(kind, debounced) });

  return (
    <main className="min-h-screen bg-cream p-6 text-ink sm:p-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Admin dashboard
        </Link>
        <h1 className="mt-4 font-display text-4xl">Manage</h1>
        <p className="mt-2 text-muted">Find anything on the site, fix its details or map pin, or hide it. Hidden entries keep their data and can be shown again.</p>

        <div className="mt-6 flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={kind === tab.value}
              onClick={() => {
                setKind(tab.value);
                setEditing(null);
              }}
              className={`rounded-pill border px-4 py-1.5 text-sm font-semibold ${kind === tab.value ? 'border-ink bg-ink text-cream' : 'border-border bg-white text-muted hover:text-ink'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4 max-w-md">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name…" />
        </div>

        <div className="mt-6 grid gap-3">
          {rows.isError && (
            <p className="rounded-md bg-saffron-light p-4 text-ember">
              Could not load. <Link to="/admin/login" className="font-semibold underline">Sign in as admin</Link>.
            </p>
          )}
          {rows.data?.length === 0 && <p className="text-muted">Nothing found.</p>}
          {rows.data?.map((row) => (
            <Row key={row.id} row={row} editing={editing === row.id} onEdit={() => setEditing(editing === row.id ? null : row.id)} />
          ))}
          {rows.data?.length === 50 && <p className="text-sm text-muted">Showing the first 50. Search to narrow it down.</p>}
        </div>
      </div>
    </main>
  );
}

function Row({ row, editing, onEdit }: { row: ManageRow; editing: boolean; onEdit: () => void }) {
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: () => adminApi.setVisibility(row.kind, row.id, !row.active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['manage'] }),
  });
  const featured = row.kind === 'STORY' && (row.subtitle ?? '').endsWith('· featured');
  const feature = useMutation({
    mutationFn: () => adminApi.setFeatured(row.id, !featured),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['manage'] }),
  });

  return (
    <div className={`rounded-lg border bg-white p-4 shadow-card ${row.active ? 'border-border' : 'border-dashed border-ember/40'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold">
            {row.name}
            {!row.active && <span className="ml-2 rounded-pill bg-saffron-light px-2 py-0.5 text-xs text-ember">Hidden</span>}
            {row.status && row.status !== 'APPROVED' && (
              <span className="ml-2 rounded-pill bg-gold-light px-2 py-0.5 text-xs text-maroon">{row.status === 'PENDING' ? 'Waiting for review' : 'Sent back'}</span>
            )}
          </p>
          {row.subtitle && <p className="truncate text-sm text-muted">{row.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {row.publicPath && row.active && row.status !== 'PENDING' && (
            <Link to={row.publicPath} className="px-2 py-1.5 text-saffron-dark hover:text-saffron">View</Link>
          )}
          {row.kind === 'STORY' && row.status === 'APPROVED' && (
            <button
              type="button"
              onClick={() => feature.mutate()}
              disabled={feature.isPending}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 ${featured ? 'border-gold bg-gold-light text-maroon' : 'border-border hover:border-ink/30'}`}
            >
              <Star size={14} /> {featured ? 'Featured' : 'Feature'}
            </button>
          )}
          {editable.includes(row.kind) && (
            <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-ink/30">
              <PenLine size={14} /> {editing ? 'Close' : 'Edit'}
            </button>
          )}
          <button
            type="button"
            onClick={() => toggle.mutate()}
            disabled={toggle.isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-ink/30"
          >
            {row.active ? <EyeOff size={14} /> : <Eye size={14} />} {row.active ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      {editing && row.kind === 'CENTER' && <CentreEditPanel row={row} onDone={onEdit} />}
      {editing && row.kind === 'TEACHER' && <TeacherEditPanel row={row} onDone={onEdit} />}
      {editing && row.kind === 'CITY' && <CityEditPanel row={row} onDone={onEdit} />}
    </div>
  );
}
