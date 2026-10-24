import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import { mediaUrl } from '../../../api/apiClient';
import { joinApi } from '../api/joinApi';

/** Optional public photo for a listing, with a preview. */
export function ImageUpload({
  previewUrl,
  onChange,
}: {
  previewUrl: string | null;
  onChange: (upload: { key: string; url: string } | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { imageKey, url } = await joinApi.uploadImage(file);
      onChange({ key: imageKey, url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const preview = mediaUrl(previewUrl);

  return (
    <div className="grid gap-3 sm:grid-cols-[180px_1fr] sm:items-center">
      <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-sand">
        {preview ? (
          <img src={preview} alt="Chosen photo" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-muted">
            <ImagePlus size={28} />
          </div>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          id="image-upload"
          onChange={(event) => handle(event.target.files?.[0])}
        />
        <label
          htmlFor="image-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-saffron/40"
        >
          <ImagePlus size={16} /> {busy ? 'Uploading…' : preview ? 'Change photo' : 'Choose a photo'}
        </label>
        <p className="mt-2 text-sm text-muted">A real photo of your work helps people connect. JPG, PNG or WebP, up to 5 MB.</p>
        {error && <p role="alert" className="mt-2 text-sm text-ember">{error}</p>}
      </div>
    </div>
  );
}
