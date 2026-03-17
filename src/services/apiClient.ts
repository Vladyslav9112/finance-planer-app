import { appEnv } from "../lib/env";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${appEnv.apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!response.ok) {
    let message = `API error: ${response.status}`;

    try {
      const payload = await response.json();
      const details = [payload?.message, payload?.error, payload?.details].filter(Boolean).join(" | ");
      if (details) message = details;
    } catch {
      // ignore non-json errors
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
