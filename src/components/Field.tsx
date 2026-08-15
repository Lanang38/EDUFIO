import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink/50">{hint}</p>}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 ' +
        (props.className ?? 'border-line')
      }
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={
        'w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 ' +
        (props.className ?? 'border-line')
      }
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={
          "w-full appearance-none rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20 " +
          (props.className ?? "")
        }
      />
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
        size={16}
        strokeWidth={2.2}
      />
    </div>
  );
}

export function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div
      className={`grid gap-2`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              'rounded-xl border px-3 py-2.5 text-sm font-semibold transition ' +
              (active
                ? 'border-teal bg-teal text-white'
                : 'border-line bg-white text-ink/70 hover:border-teal-light')
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function RadioCard<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={
              'flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ' +
              (active
                ? 'border-teal bg-teal/5'
                : 'border-line bg-white hover:border-teal-light')
            }
          >
            <span
              className={
                'mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 ' +
                (active ? 'border-teal' : 'border-line')
              }
            >
              {active && <span className="h-2 w-2 rounded-full bg-teal" />}
            </span>
            <span>
              <span className="block text-[15px] font-medium text-ink">
                {opt.label}
              </span>
              {opt.description && (
                <span className="mt-0.5 block text-xs text-ink/50">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
  },
) {
  const { fullWidth = true, className, ...rest } = props;
  return (
    <button
      {...rest}
      className={
        `${fullWidth ? 'w-full' : ''} rounded-xl bg-navy px-5 py-3.5 text-[15px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:bg-teal ` +
        (className ?? '')
      }
    />
  );
}

export function SecondaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
  },
) {
  const { fullWidth = true, className, ...rest } = props;
  return (
    <button
      {...rest}
      className={
        `${fullWidth ? 'w-full' : ''} rounded-xl border border-navy/20 bg-white px-5 py-3.5 text-[15px] font-semibold text-navy transition enabled:hover:bg-blue-pastel/20 disabled:cursor-not-allowed disabled:opacity-40 ` +
        (className ?? '')
      }
    />
  );
}
