/**
 * @file API call for finalizing a chat and retrieving the AI or escalation outcome.
 * Used after all follow-up questions are answered so the workflow can resolve cleanly.
 */

// src/lib/api/finalize.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Finalize API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles finalizing chat sessions and getting AI responses
 */

import { api } from './client'
import { FinalizeResponse } from './types'

/**
 * Finalize a chat session and get AI response or escalation status
 * @param chat_id - The chat session ID
 * @param expected - The expected response type (simple or complex)
 * @returns Finalize response with AI answer or escalation status
 */
export async function finalize(
  chat_id: string,
  expected: 'simple' | 'complex'
): Promise<FinalizeResponse> {
  return api<FinalizeResponse>(`/chats/${chat_id}/finalize`, { method: 'POST' })
}
