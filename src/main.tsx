import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { App } from "./app/App";
import { initTelegramWebApp } from "./lib/telegram";
import "./styles/index.css";

initTelegramWebApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster theme="dark" richColors position="top-center" />
    </BrowserRouter>
  </StrictMode>,
);

