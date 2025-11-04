// src/lib/api/client.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * HTTP Client
 * ──────────────────────────────────────────────────────────────────────────────
 */

const FALLBACK_API_BASE = 'http://localhost:5001'

const resolveApiBase = () => {
  const envValue = process.env.NEXT_PUBLIC_API_URL

  if (typeof window !== 'undefined') {
    const browserValue = (window as any)?.ENV?.NEXT_PUBLIC_API_URL
    return browserValue ?? envValue ?? FALLBACK_API_BASE
  }

  return envValue ?? FALLBACK_API_BASE
}

export const API_BASE = resolveApiBase()

/**
 * Generic HTTP helper for making API requests
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
