import { appEnv } from "../lib/env";

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${appEnv.apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

