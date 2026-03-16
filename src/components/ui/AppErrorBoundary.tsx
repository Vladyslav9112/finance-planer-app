import type { ReactNode } from "react";
import { Component } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg px-4 py-8 text-slate-100">
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-panel p-4">
            <h1 className="text-lg font-semibold">Сталася помилка інтерфейсу</h1>
            <p className="mt-2 text-sm text-slate-400">
              Оновіть Mini App. Якщо проблема повторюється, відкрийте пізніше.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

