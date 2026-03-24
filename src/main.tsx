import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { diagnoseTelegram } from "./services/telegramService";

// Call tg.ready() BEFORE React renders so Telegram doesn't
// keep showing the loading placeholder if React is slow or throws
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();

  // Set a CSS variable that the stylesheet uses for the app height.
  // Prefer viewportStableHeight (doesn't bounce during scroll) over viewportHeight.
  // Do NOT use window.innerHeight — it returns the full device height including
  // system bars, which is larger than the Telegram WebView's actual visible area.
  const setAppHeight = () => {
    const h = tg.viewportStableHeight || tg.viewportHeight;
    if (h > 0) {
      document.documentElement.style.setProperty("--tg-app-height", `${h}px`);
    }
  };
  setAppHeight();
  tg.onEvent("viewportChanged", setAppHeight);
}

// Verify bot token + channel in console on every load
diagnoseTelegram();

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            color: "#f87171",
            fontFamily: "monospace",
            fontSize: 13,
          }}
        >
          <b>Помилка рендеру:</b>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>
            {this.state.error.message}
            {"\n"}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
