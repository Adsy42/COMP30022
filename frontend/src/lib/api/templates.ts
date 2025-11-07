/**
 * @file Fetch helper for retrieving predefined question templates (common/simple/complex).
 * Exposes a typed wrapper so chat flows can request template variants without repeating fetch logic.
 */

// src/lib/api/templates.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Templates API
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles fetching chat flow templates (common, simple, complex)
 */

import { api } from './client'
import { Question } from './types'

/**
 * Fetch a specific template from the database
 * @param template - The template type to fetch
 * @returns Array of questions for the specified template
 */
export async function getTemplate(
  template: 'common' | 'simple' | 'complex'
): Promise<Question[]> {
  return api(`/templates?template=${template}`, { method: 'GET' })
}
