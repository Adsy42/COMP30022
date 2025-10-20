// src/lib/api/chats.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Chats API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles chat session creation and answer submission
 */

import { api } from './client'

/**
 * Start a new chat session
 * @returns Object containing the new chat_id
 */
export async function startChat() {
  return api<{ chat_id: string }>('/chats', { method: 'POST' })
}

/**
 * Submit answers for a specific chat session
 * @param chat_id - The chat session ID
 * @param body - The answers payload
 */
export async function submitAnswers(chat_id: string, body: any) {
  return api(`/chats/${chat_id}/answers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
