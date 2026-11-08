"use client";

import { ReactNode } from "react";
import { Loader2, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";

// Shared, mobile-first building blocks for the admin tabs.
// font-size 16px on inputs prevents iOS Safari from zooming on focus.
export const inputClass =
  "w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1.5">{hint}</span>}
    </label>
  );
}

export function TabHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 min-h-12 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 px-6 min-h-12 rounded-xl border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

export function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-foreground">
      <p className="font-semibold text-destructive mb-1">Couldn&apos;t load this section</p>
      <p className="text-muted-foreground break-words">{message}</p>
      <p className="text-muted-foreground mt-2">
        If you haven&apos;t yet, run the SQL files in the <code className="font-mono">supabase/migrations</code>{" "}
        folder in the Supabase SQL Editor (see <code className="font-mono">supabase/README.md</code>).
      </p>
    </div>
  );
}

/** Edit / delete / move up / move down — big tap targets for touch screens. */
export function RowActions({
  onEdit,
  onDelete,
  onUp,
  onDown,
  disableUp,
  disableDown,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onUp: () => void;
  onDown: () => void;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  const btn =
    "p-2.5 min-w-10 min-h-10 inline-flex items-center justify-center rounded-lg hover:bg-secondary transition-colors disabled:opacity-30 disabled:pointer-events-none";
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button type="button" onClick={onUp} disabled={disableUp} className={btn} title="Move up" aria-label="Move up">
        <ArrowUp className="w-4 h-4" />
      </button>
      <button type="button" onClick={onDown} disabled={disableDown} className={btn} title="Move down" aria-label="Move down">
        <ArrowDown className="w-4 h-4" />
      </button>
      <button type="button" onClick={onEdit} className={btn} title="Edit" aria-label="Edit">
        <Pencil className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className={`${btn} text-destructive hover:bg-destructive/10`}
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/** Trim every entry and drop the empty ones (used before saving list fields). */
export const cleanList = (a: string[]): string[] => a.map((l) => l.trim()).filter(Boolean);

export function errMsg(e: unknown): string {
  if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
  return "Unknown error";
}

/** Progress bar for uploads. `percent` null = just started / unknown. */
export function UploadBar({
  percent,
  retrying,
  label = "Uploading",
}: {
  percent: number | null;
  retrying?: boolean;
  label?: string;
}) {
  const pct = percent ?? 0;
  return (
    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label} className="space-y-1.5">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{retrying ? "Connection lost — retrying, nothing is lost…" : `${label}…`}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-200 ${retrying ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
