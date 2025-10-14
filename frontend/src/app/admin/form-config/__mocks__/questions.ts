export interface Option {
  label: string;
  followUp?: FormQuestion;
}

export interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'single' | 'multi';
  options?: Option[];
  order: number;
  displayable: boolean;  // Add displayable field
}

export const MOCK_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    question: 'Grant Scheme',
    type: 'single',
    options: [
      { label: 'NHMRC' },
      { label: 'MRFF' },
      { label: 'ARC' },
      { label: 'Other' }
    ],
    order: 0,
    displayable: true  // Show in breakdowns
  },
  {
    id: '2',
    question: 'Involves MRI',
    type: 'single',
    options: [
      { 
        label: 'Yes',
        followUp: {
          id: '2.1',
          question: 'MRI Access Type',
          type: 'single',
          options: [
            { label: 'Full access' },
            { label: 'Viewing only' }
          ],
          order: 0,
          displayable: false
        }
      },
      { label: 'No' },
      { label: 'Other' }
    ],
    order: 1,
    displayable: true
  },
  {
    id: '3',
    question: 'Type of Query',
    type: 'single',
    options: [
      { label: 'Contractual clause review' },
      { label: 'Support with negotiations' },
      { label: 'Advice on agreement type' },
      { label: 'Compliance advice' },
      { label: 'Other' }
    ],
    order: 2,
    displayable: true
  },
  {
    id: '4',
    question: 'Mark as Urgent',
    type: 'single',
    options: [
      { label: 'Yes' },
      { label: 'No' }
    ],
    order: 3,
    displayable: false  // Don't show in breakdowns
  }
];

// Mock API endpoints
export const API_ENDPOINTS = {
  QUESTIONS: '/api/form-questions',
  REORDER: '/api/form-questions/reorder'
} as const;

// Mock API functions
export async function fetchMockQuestions(): Promise<{ data: FormQuestion[] }> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return { data: MOCK_QUESTIONS };
}

export async function reorderMockQuestions(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
}