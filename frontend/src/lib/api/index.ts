// src/lib/api/index.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * API Module - Main Entry Point
 * ──────────────────────────────────────────────────────────────────────────────
 * Centralized exports for all API modules
 */

// Re-export types (for chat flow)
export type { Question, QuestionType, Option, FinalizeResponse, EscalateResponse } from './types'

// Re-export client utilities
export { API_BASE, api } from './client'

// Re-export auth API
export type { LoginRequest, LoginResponse } from './auth'
export { login } from './auth'

// Re-export templates API
export { getTemplate } from './templates'

// Re-export chats API
export { startChat, submitAnswers } from './chats'

// Re-export uploads API
export { uploadFile } from './uploads'

// Re-export finalize API
export { finalize } from './finalize'

// Re-export escalations API
export { escalate } from './escalations'

// Re-export analytics API (admin)
export type { KPIData, ChoiceOption, ChoiceAnalyticsItem, AnalyticsData } from './analytics'
export { fetchAnalytics } from './analytics'

// Re-export form questions API (admin)
export type { FormQuestionOption, FormQuestion } from './formQuestions'
export { API_ENDPOINTS, fetchQuestions, reorderQuestions, updateQuestions } from './formQuestions'

// Re-export config API (admin)
export type { EmailConfig } from './config'
export { updateEmailConfig } from './config'
