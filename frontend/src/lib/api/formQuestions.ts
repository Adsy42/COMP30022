// src/lib/api/formQuestions.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Form Questions API (Admin)
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles admin configuration for form questions
 */

import { API_BASE } from './client'

export interface FormQuestionOption {
  label: string
  followUp?: FormQuestion[]
}

export interface FormQuestion {
  id: string
  question: string
  type: 'text' | 'single' | 'multi'
  options?: FormQuestionOption[]
  order: number
}

export const API_ENDPOINTS = {
  QUESTIONS: '/api/form-questions',
  REORDER: '/api/form-questions/reorder',
} as const

/**
 * Fetch all form questions from the backend
 * @returns Object containing array of form questions
 */
export async function fetchQuestions(): Promise<{ data: FormQuestion[] }> {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.QUESTIONS}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Reorder form questions (admin only)
 * @param order - Array of question IDs in desired order
 * @param token - Admin authentication token
 */
export async function reorderQuestions(
  order: string[],
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.REORDER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order }),
  })

  if (!response.ok) {
    throw new Error(`Failed to reorder questions: ${response.statusText}`)
  }
}

/**
 * Create or update form questions (admin only)
 * @param questions - Array of form questions to create/update
 * @param token - Admin authentication token
 */
export async function updateQuestions(
  questions: FormQuestion[],
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.QUESTIONS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questions }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update questions: ${response.statusText}`)
  }
}
