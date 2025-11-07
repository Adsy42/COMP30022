/**
 * @file Shared TypeScript definitions for chat templates, options, and finalize/escalation responses.
 * Keeps the frontend builder and client helpers aligned with the backend contract.
 */

// src/lib/api/types.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Shared Types
 * ──────────────────────────────────────────────────────────────────────────────
 */

export type QuestionType = 'freeform' | 'single' | 'multi'

export type Question = {
  id: string
  question: string
  type: QuestionType
  /**
   * For 'freeform', this MUST be null.
   * For 'single'/'multi', this MUST be an array of Option.
   */
  options: Option[] | null
}

export type Option = {
  label: string
  /**
   * Optional follow-up question that should be asked immediately after this
   * option is selected. Same exact structure as any other Question.
   * NOTE: A "follow up question" is EXACTLY the same shape as a template question.
   */
  followUp?: Question
}

export type FinalizeResponse = {
  chat_id: string
  status: 'simple' | 'complex'
  ai_response: string | null
}

export type EscalateResponse = { ok: true } | { ok: false; error?: string }
