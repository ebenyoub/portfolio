import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { X } from "lucide-react";

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "published" | "draft" | "info" | "success" | "warning" | "neutral";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  published: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  draft: "border-[#262626] bg-[#1A1A1A] text-[#A1A1AA]",
  info: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  neutral: "border-[#262626] bg-[#1A1A1A] text-[#A1A1AA]",
};

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded-full border ${BADGE_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const BTN_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-[#3B82F6] text-white hover:bg-[#2563EB]",
  secondary: "border border-[#262626] bg-[#111111] text-white hover:bg-[#1A1A1A] hover:border-[#363636]",
  ghost: "text-[#A1A1AA] hover:text-white hover:bg-[#111111]",
  danger: "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  disabled,
  loading,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
}) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${BTN_STYLES[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────

export function FormField({
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
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white" style={{ fontFamily: "Manrope, sans-serif" }}>
        {label}
        {required && <span className="text-[#3B82F6] ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[#A1A1AA]">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors ${className}`}
      {...props}
    />
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Textarea({
  className = "",
  rows = 4,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { rows?: number }) {
  return (
    <textarea
      rows={rows}
      className={`w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 transition-colors resize-none ${className}`}
      {...props}
    />
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${checked ? "bg-[#3B82F6]" : "bg-[#262626]"}`}
        style={{ width: 40, height: 22 }}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-[20px]" : "translate-x-[2px]"}`}
          style={{ width: 18, height: 18, top: 2 }}
        />
      </div>
      {label && <span className="text-sm text-[#A1A1AA]">{label}</span>}
    </label>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <p className="text-xs font-mono text-[#3B82F6] tracking-widest uppercase mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1
          className="text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#A1A1AA] mt-1 max-w-lg">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={`bg-[#111111] border border-[#262626] rounded-xl ${padding ? "p-5" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-xl border border-[#262626] bg-[#111111] flex items-center justify-center mb-4">
        <span className="text-[#4B4B4B] text-xl">∅</span>
      </div>
      <p className="text-sm font-medium text-white mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>
        {title}
      </p>
      {description && <p className="text-xs text-[#A1A1AA] mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Supprimer",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#111111] border border-[#262626] rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
        <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>
          {title}
        </h3>
        {description && <p className="text-sm text-[#A1A1AA] mb-5">{description}</p>}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── SkeletonRow ──────────────────────────────────────────────────────────────

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-[#1A1A1A] animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-[#1A1A1A]" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-[#1A1A1A] rounded w-1/3" />
        <div className="h-2.5 bg-[#1A1A1A] rounded w-1/5" />
      </div>
      <div className="h-5 w-16 bg-[#1A1A1A] rounded-full" />
      <div className="h-3 w-20 bg-[#1A1A1A] rounded" />
    </div>
  );
}

// ─── ListInput ────────────────────────────────────────────────────────────────

export function ListInput({
  items,
  onChange,
  placeholder = "Ajouter un élément...",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-[#262626] text-[#A1A1AA] hover:text-red-400 hover:border-red-500/30 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] font-mono transition-colors"
      >
        + Ajouter un élément
      </button>
    </div>
  );
}

// ─── SectionDivider ───────────────────────────────────────────────────────────

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1 bg-[#1E1E1E]" />
      <span className="text-[10px] font-mono text-[#4B4B4B] uppercase tracking-widest">
        {label}
      </span>
      <div className="h-px flex-1 bg-[#1E1E1E]" />
    </div>
  );
}
