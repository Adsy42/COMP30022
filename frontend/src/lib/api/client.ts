/**
 * @file Centralized API base URL and lightweight fetch wrapper for the frontend.
 * Ensures every helper shares headers, error handling, and env-aware base resolution.
 */

// src/lib/api/client.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * HTTP Client
 * ──────────────────────────────────────────────────────────────────────────────
 */

export const API_BASE =
  (typeof window !== 'undefined'
    ? (window as any).ENV?.NEXT_PUBLIC_API_URL
    : '') || 'http://localhost:5001'

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
