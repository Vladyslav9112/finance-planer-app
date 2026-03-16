import type { ReactNode } from "react";

interface ModalFormProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function ModalForm({ open, title, onClose, children }: ModalFormProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 px-3 pb-4 pt-8 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-panel p-4 shadow-soft animate-fade-in-up">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg border border-border px-2 py-1 text-xs text-slate-300 hover:bg-white/5">
            Закрити
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

