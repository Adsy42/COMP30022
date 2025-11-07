/**
 * @file Admin endpoints for reading and writing escalation email configuration.
 * Surfaces typed helpers so the email-config screen can focus on UI logic.
 */

// src/lib/api/config.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Config API (Admin)
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles admin configuration settings
 */

import { API_BASE } from './client'

export interface EmailConfig {
  email_address: string
}

/**
 * Fetch current email recipient configuration
 * @param token - Admin authentication token
 * @returns Email configuration object
 */
export async function fetchEmailConfig(token: string): Promise<EmailConfig> {
  const response = await fetch(`${API_BASE}/config/email-recipient`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.')
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.message ||
        `Failed to fetch email config: ${response.statusText}`
    )
  }

  return response.json()
}

/**
 * Update escalation recipient email address (admin only)
 * @param emailAddress - New recipient email address
 * @param token - Admin authentication token
 */
export async function updateEmailConfig(
  emailAddress: string,
  token: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE}/config/email-recipient`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email_address: emailAddress }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update email config: ${response.statusText}`)
  }

  return response.json()
}
