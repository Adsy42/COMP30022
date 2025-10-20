// src/lib/api/escalations.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Escalations API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles escalating complex queries to human experts
 */

import { api } from './client'
import { EscalateResponse } from './types'

/**
 * Escalate a chat session to a human expert
 * @param chat_id - The chat session ID
 * @param reason - Optional reason for escalation
 * @returns Escalation response status
 */
export async function escalate(
  chat_id: string,
  reason?: string
): Promise<EscalateResponse> {
  return api<EscalateResponse>(`/escalations`, {
    method: 'POST',
    body: JSON.stringify({ chat_id, escalate: true, reason }),
  })
}
