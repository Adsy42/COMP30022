export interface Option {
  label: string
  followUps?: FormQuestion[]
}

export interface FormQuestion {
  id: string
  question: string
  type: 'text' | 'single' | 'multi'
  options?: Option[]
  order: number
}

export const MOCK_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    question: 'Your name',
    type: 'text',
    order: 0,
  },
  {
    id: '2',
    question: 'Your email',
    type: 'text',
    order: 1,
  },
  {
    id: '3',
    question: 'Grant Team',
    type: 'single',
    options: [
      { label: 'Health and Medical' },
      { label: 'International' },
      { label: 'ARC-D' },
      { label: 'RDS' },
      { label: 'Research Infrastructure' },
    ],
    order: 2,
  },
  {
    id: '4',
    question: 'Stage of Query',
    type: 'single',
    options: [
      { label: 'Pre-Award' },
      { label: 'Post-Award' },
      { label: 'Other' },
    ],
    order: 3,
  },
  {
    id: '5',
    question: 'Is this a simple query or complex referral?',
    type: 'single',
    options: [
      {
        label: 'Simple',
        followUps: [
          {
            id: '5.1',
            question: 'Select Grant Scheme',
            type: 'single',
            options: [
              { label: 'NHMRC' },
              { label: 'MRFF' },
              { label: 'ARC' },
              { label: 'ECR' },
              { label: 'NIH' },
              { label: 'Other' },
            ],
            order: 0,
          },
          {
            id: '5.2',
            question: 'Does this involve an MRI?',
            type: 'single',
            options: [{ label: 'Yes' }, { label: 'No' }, { label: 'Other' }],
            order: 1,
          },
          {
            id: '5.3',
            question: 'Type of Query',
            type: 'single',
            options: [
              {
                label: 'Review of contractual clause',
                followUps: [
                  {
                    id: '5.3.1',
                    question: 'Select clauses to review',
                    type: 'multi',
                    options: [
                      { label: 'Background IP' },
                      { label: 'Project IP' },
                      { label: 'Liability' },
                      { label: 'Indemnity' },
                      { label: 'Warranty' },
                      { label: 'Insurance' },
                      { label: 'Publication' },
                      { label: 'Moral Rights' },
                      { label: 'Other' },
                    ],
                    order: 0,
                  },
                ],
              },
              { label: 'Support with negotiations' },
              { label: 'Advice on appropriate agreement' },
              { label: 'Advice on compliance with grant obligations' },
              { label: 'Other' },
            ],
            order: 2,
          },
        ],
      },
      {
        label: 'Complex',
        followUps: [
          {
            id: '5.4',
            question: 'Select Grant Scheme',
            type: 'single',
            options: [
              { label: 'NHMRC' },
              { label: 'MRFF' },
              { label: 'ARC' },
              { label: 'ECR' },
              { label: 'NIH' },
              { label: 'Other' },
            ],
            order: 0,
          },
          {
            id: '5.5',
            question: 'Does this involve an MRI?',
            type: 'single',
            options: [{ label: 'Yes' }, { label: 'No' }, { label: 'Other' }],
            order: 1,
          },
          {
            id: '5.6',
            question: 'Chief Investigator Name',
            type: 'text',
            order: 2,
          },
          {
            id: '5.7',
            question: 'Faculty and Department',
            type: 'text',
            order: 3,
          },
          {
            id: '5.8',
            question: 'Project Title',
            type: 'text',
            order: 4,
          },
          {
            id: '5.9',
            question: 'Is UoM the lead?',
            type: 'single',
            options: [{ label: 'Lead' }, { label: 'Non-Lead' }],
            order: 5,
          },
          {
            id: '5.10',
            question: 'Are there other parties involved in the Project?',
            type: 'single',
            options: [
              {
                label: 'Yes',
                followUps: [
                  {
                    id: '5.10.1',
                    question: 'Other Party 1 - Name',
                    type: 'text',
                    order: 0,
                  },
                  {
                    id: '5.10.2',
                    question: 'Other Party 1 - Role in the project',
                    type: 'single',
                    options: [
                      { label: 'Funder' },
                      { label: 'Administering Organisation' },
                      { label: 'Collaborator' },
                      { label: 'Incoming party' },
                      { label: 'Outgoing party' },
                      { label: 'Other' },
                    ],
                    order: 1,
                  },
                ],
              },
              { label: 'No' },
            ],
            order: 6,
          },
          {
            id: '5.11',
            question: 'Type of Agreement for review',
            type: 'multi',
            options: [
              { label: 'Multi-institutional agreement' },
              { label: 'Collaboration agreement' },
              { label: 'Partner organisation letter' },
              { label: 'Acquisition of services agreement' },
              { label: 'Novation agreement' },
              { label: 'Accession agreement' },
              { label: 'Subaward agreement' },
              { label: 'Subcontract agreement' },
              { label: 'Variation agreement' },
              { label: 'Funding agreement' },
              { label: 'Other' },
            ],
            order: 7,
          },
          {
            id: '5.12',
            question: 'HPECM reference',
            type: 'text',
            order: 8,
          },
          {
            id: '5.13',
            question: 'Are there other agreements that relate to this project?',
            type: 'text',
            order: 9,
          },
          {
            id: '5.14',
            question: 'How can we help?',
            type: 'text',
            order: 10,
          },
          {
            id: '5.15',
            question: 'Other notes',
            type: 'text',
            order: 11,
          },
          {
            id: '5.16',
            question: 'Attach all relevant documents',
            type: 'text',
            order: 12,
          },
          {
            id: '5.17',
            question: 'Is there urgency on this request?',
            type: 'single',
            options: [
              {
                label: 'Yes',
                followUps: [
                  {
                    id: '5.17.1',
                    question: 'Provide urgency date',
                    type: 'text',
                    order: 0,
                  },
                ],
              },
              { label: 'No' },
            ],
            order: 13,
          },
        ],
      },
    ],
    order: 4,
  },
]

// Mock API endpoints
export const API_ENDPOINTS = {
  QUESTIONS: '/api/form-questions',
  REORDER: '/api/form-questions/reorder',
} as const

// Mock API functions
export async function fetchMockQuestions(): Promise<{ data: FormQuestion[] }> {
  await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
  return { data: MOCK_QUESTIONS }
}
