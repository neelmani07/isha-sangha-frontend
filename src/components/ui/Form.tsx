import type { InputHTMLAttributes, ReactNode, Ref, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

const fieldClass =
  'w-full rounded-md border border-border bg-white px-4 py-3 text-ink outline-none transition focus:border-saffron focus:ring-2 focus:ring-saffron/20';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} min-h-40 resize-y`} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />;
}

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: 'light' | 'dark';
};

export function SearchField({ value, onChange, placeholder, variant = 'light' }: SearchFieldProps) {
  const isLight = variant === 'light';

  return (
    <label
      className={`flex h-14 items-center gap-3 rounded-lg border px-4 shadow-card ${
        isLight
          ? 'border-border bg-white'
          : 'border-border bg-white/95 shadow-panel backdrop-blur-md'
      }`}
    >
      <Search className="shrink-0 text-saffron" size={20} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink/80">
      {label}
      {children}
    </label>
  );
}
