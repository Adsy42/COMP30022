/**
 * @file API helper for uploading attachments against a chat session.
 * Wraps the FormData POST call so UI components only deal with chat IDs and File objects.
 */

// src/lib/api/uploads.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Uploads API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles file uploads for chat sessions
 */

import { API_BASE } from './client'

/**
 * Upload a file for a specific chat session
 * @param chat_id - The chat session ID
 * @param file - The file to upload
 * @returns Upload response with file metadata
 */
export async function uploadFile(chat_id: string, file: File) {
  const fd = new FormData()
  fd.append('chat_id', chat_id)
  fd.append('file', file)
  const res = await fetch(`${API_BASE}/uploads`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
