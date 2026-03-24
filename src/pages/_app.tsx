import React, { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";
import { Toast } from "../components/ui/Toast";
import { BottomNav } from "../components/layout/BottomNav";
import { useFinanceStore } from "../store/useFinanceStore";
import { usePlanStore } from "../store/usePlanStore";
import { useWarehouseStore } from "../store/useWarehouseStore";
import { diagnoseTelegram } from "../services/telegramService";
import "../index.css";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Init Telegram SDK
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
    diagnoseTelegram();

    // Load all data from API
    Promise.all([
      useFinanceStore.getState().init(),
      usePlanStore.getState().init(),
      useWarehouseStore.getState().init(),
    ]).finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.7)",
          fontSize: 18,
        }}
      >
        <span>Завантаження...</span>
      </div>
    );
  }

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AnimatedBackground />
      <Toast />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <AppInitializer>
          <div
            className="relative flex flex-col flex-1 overflow-hidden bg-transparent"
            style={{ minHeight: 0 }}
          >
            <main className="flex-1 overflow-y-auto overscroll-y-contain pb-[72px]">
              <Component {...pageProps} />
            </main>
            <BottomNav />
          </div>
        </AppInitializer>
      </div>
    </div>
  );
}
