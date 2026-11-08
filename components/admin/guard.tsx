"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TriangleAlert } from "lucide-react";

/**
 * Admin-wide helpers:
 *  - useConfirm(): a proper dialog instead of the browser's confirm() popup
 *  - useUnsavedGuard(dirty): warns before closing/refreshing the tab or switching admin
 *    sections while a form has unsaved changes
 *
 * The dialog uses the native <dialog> element: focus trap, Esc to close and
 * screen-reader semantics come from the browser, with no extra packages.
 */

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

interface Pending extends ConfirmOptions {
  resolve: (ok: boolean) => void;
}

interface AdminGuardContextValue {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  /** Resolves true when it is OK to leave (nothing unsaved, or the admin chose to discard). */
  confirmDiscard: () => Promise<boolean>;
  registerDirty: (id: string, dirty: boolean) => void;
}

const AdminGuardContext = createContext<AdminGuardContextValue | null>(null);

export function AdminGuardProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const pendingRef = useRef<Pending | null>(null);
  const dirtyIds = useRef<Set<string>>(new Set());
  const dialogRef = useRef<HTMLDialogElement>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        pendingRef.current?.resolve(false); // a newer question replaces an unanswered one
        const next = { ...opts, resolve };
        pendingRef.current = next;
        setPending(next);
      }),
    []
  );

  const registerDirty = useCallback((id: string, dirty: boolean) => {
    if (dirty) dirtyIds.current.add(id);
    else dirtyIds.current.delete(id);
  }, []);

  const confirmDiscard = useCallback(async () => {
    if (dirtyIds.current.size === 0) return true;
    const ok = await confirm({
      title: "Discard unsaved changes?",
      message: "You have changes that haven't been saved. If you leave now they will be lost.",
      confirmLabel: "Discard changes",
      cancelLabel: "Keep editing",
      destructive: true,
    });
    if (ok) dirtyIds.current.clear();
    return ok;
  }, [confirm]);

  // Open / close the native dialog in step with state.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (pending && !el.open) el.showModal();
    if (!pending && el.open) el.close();
  }, [pending]);

  const settle = useCallback((ok: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    current?.resolve(ok);
    setPending(null);
  }, []);

  // Warn when the whole tab is closed / refreshed / navigated away.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyIds.current.size > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const value = useMemo(
    () => ({ confirm, confirmDiscard, registerDirty }),
    [confirm, confirmDiscard, registerDirty]
  );

  return (
    <AdminGuardContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          settle(false);
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) settle(false); // click on the backdrop
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/40"
      >
        {pending && (
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  pending.destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                }`}
              >
                <TriangleAlert className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold leading-tight">{pending.title}</h2>
                {pending.message && (
                  <p className="mt-2 text-sm text-muted-foreground break-words">{pending.message}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => settle(false)}
                className="min-h-11 px-5 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                {pending.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => settle(true)}
                className={`min-h-11 px-5 rounded-xl font-medium inline-flex items-center justify-center gap-2 transition-colors ${
                  pending.destructive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {pending.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </AdminGuardContext.Provider>
  );
}

function useGuard(): AdminGuardContextValue {
  const ctx = useContext(AdminGuardContext);
  if (!ctx) throw new Error("Admin guard hooks must be used inside <AdminGuardProvider>");
  return ctx;
}

/** `const confirm = useConfirm(); if (!(await confirm({ title: "Delete?" }))) return;` */
export function useConfirm() {
  return useGuard().confirm;
}

/** Ask before throwing away unsaved edits, e.g. when switching admin sections. */
export function useConfirmDiscard() {
  return useGuard().confirmDiscard;
}

let guardCounter = 0;

/** Call with `true` while the form has unsaved changes. Cleans up automatically on unmount. */
export function useUnsavedGuard(dirty: boolean) {
  const { registerDirty } = useGuard();
  const idRef = useRef<string>("");
  if (!idRef.current) idRef.current = `guard-${++guardCounter}`;

  useEffect(() => {
    registerDirty(idRef.current, dirty);
  }, [dirty, registerDirty]);

  useEffect(() => {
    const id = idRef.current;
    return () => registerDirty(id, false);
  }, [registerDirty]);
}

/** Shallow "has this form changed since it was opened" check. */
export function isDirty(current: unknown, baseline: unknown): boolean {
  return JSON.stringify(current) !== JSON.stringify(baseline);
}
