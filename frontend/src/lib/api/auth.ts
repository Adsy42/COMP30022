// src/lib/api/auth.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Auth API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles admin authentication
 */

import { api } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
}

/**
 * Login with username and password
 * @param username - Admin username
 * @param password - Admin password
 * @returns Login response with JWT token if successful
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return api<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}
