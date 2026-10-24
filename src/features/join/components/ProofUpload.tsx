import { CheckCircle2, FileUp } from 'lucide-react';
import { useRef, useState } from 'react';
import { joinApi } from '../api/joinApi';

/**
 * Uploads a proof document (certificate, letter, ID card from Isha) and reports its key.
 * Proofs are private: only admins reviewing the listing can open them.
 */
export function ProofUpload({ value, onChange }: { value: string | null; onChange: (key: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { proofKey } = await joinApi.uploadProof(file);
      setFileName(file.name);
      onChange(proofKey);
    } catch (err) {
      onChange(null);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-gold/60 bg-gold-light/30 p-4">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className="sr-only"
        id="proof-upload"
        onChange={(event) => handle(event.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm">
          {value ? (
            <p className="inline-flex items-center gap-2 font-semibold text-leaf">
              <CheckCircle2 size={16} /> {fileName ?? 'Proof attached'}
            </p>
          ) : (
            <p className="text-muted">PDF, JPG, PNG or WebP, up to 5 MB. Only our reviewers can see it.</p>
          )}
        </div>
        <label
          htmlFor="proof-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-saffron/40"
        >
          <FileUp size={16} /> {busy ? 'Uploading…' : value ? 'Replace file' : 'Choose file'}
        </label>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-ember">{error}</p>}
    </div>
  );
}
