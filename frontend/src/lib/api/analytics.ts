// src/lib/api/analytics.ts
/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Analytics API (Admin)
 * ──────────────────────────────────────────────────────────────────────────────
 * Handles fetching analytics dashboard data for admin users
 */

import { API_BASE } from './client'

export interface KPIData {
  total_queries: number
  simple_queries: number
  ai_resolved_queries: number
}

export interface ChoiceOption {
  label: string
  count: number
}

export interface ChoiceAnalyticsItem {
  question: string
  type: 'single' | 'multi'
  options: ChoiceOption[]
}

export interface AnalyticsData {
  kpi: KPIData
  questions: ChoiceAnalyticsItem[]
}

/**
 * Fetch analytics dashboard data from the backend
 * @param token - Optional authentication token for admin access
 * @returns Analytics data with KPIs and question statistics
 */
export async function fetchAnalytics(token?: string): Promise<AnalyticsData> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}/analytics`, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.statusText}`)
  }

  return response.json()
}
