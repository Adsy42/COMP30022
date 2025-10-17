
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

export const MOCK_ANALYTICS: AnalyticsData = {
  kpi: {
    total_queries: 234,
    simple_queries: 187,
    ai_resolved_queries: 156
  },
  
  questions: [
    {
      question: 'Grant Team',
      type: 'single',
      options: [
        { label: 'Health and Medical', count: 98 },
        { label: 'International', count: 45 },
        { label: 'ARC-D', count: 56 },
        { label: 'RDS', count: 20 },
        { label: 'Research Infrastructure', count: 15 }
      ]
    },
    {
      question: 'Stage of Query',
      type: 'single',
      options: [
        { label: 'Pre-Award', count: 155 },
        { label: 'Post-Award', count: 79 },
        { label: 'Other', count: 0 }
      ]
    },
    {
      question: 'Is this a simple query or complex referral?',
      type: 'single',
      options: [
        { label: 'Simple', count: 187 },
        { label: 'Complex', count: 47 }
      ]
    },
    {
      question: 'Select Grant Scheme',
      type: 'single',
      options: [
        { label: 'NHMRC', count: 93 },
        { label: 'MRFF', count: 57 },
        { label: 'ARC', count: 43 },
        { label: 'ECR', count: 25 },
        { label: 'NIH', count: 10 },
        { label: 'Other', count: 6 }
      ]
    },
    {
      question: 'Does this involve an MRI?',
      type: 'single',
      options: [
        { label: 'Yes', count: 89 },
        { label: 'No', count: 95 },
        { label: 'Other', count: 3 }
      ]
    },
    {
      question: 'Type of Query',
      type: 'single',
      options: [
        { label: 'Review of contractual clause', count: 89 },
        { label: 'Support with negotiations', count: 45 },
        { label: 'Advice on appropriate agreement', count: 32 },
        { label: 'Advice on compliance with grant obligations', count: 18 },
        { label: 'Other', count: 3 }
      ]
    },
    {
      question: 'Select clauses to review',
      type: 'multi',
      options: [
        { label: 'Background IP', count: 45 },
        { label: 'Project IP', count: 42 },
        { label: 'Liability', count: 38 },
        { label: 'Indemnity', count: 35 },
        { label: 'Warranty', count: 25 },
        { label: 'Insurance', count: 20 },
        { label: 'Publication', count: 15 },
        { label: 'Moral Rights', count: 12 },
        { label: 'Other', count: 5 }
      ]
    },
    {
      question: 'Is UoM the lead?',
      type: 'single',
      options: [
        { label: 'Lead', count: 28 },
        { label: 'Non-Lead', count: 19 }
      ]
    },
    {
      question: 'Other Party Role in the project',
      type: 'single',
      options: [
        { label: 'Funder', count: 12 },
        { label: 'Administering Organisation', count: 10 },
        { label: 'Collaborator', count: 15 },
        { label: 'Incoming party', count: 5 },
        { label: 'Outgoing party', count: 3 },
        { label: 'Other', count: 2 }
      ]
    },
    {
      question: 'Type of Agreement for review',
      type: 'multi',
      options: [
        { label: 'Multi-institutional agreement', count: 15 },
        { label: 'Collaboration agreement', count: 12 },
        { label: 'Partner organisation letter', count: 8 },
        { label: 'Acquisition of services agreement', count: 5 },
        { label: 'Novation agreement', count: 2 },
        { label: 'Other', count: 5 }
      ]
    }
  ]
}

export async function fetchMockAnalytics(): Promise<AnalyticsData> {
  await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
  return MOCK_ANALYTICS
}