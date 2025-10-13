export interface Option {
  label: string;
  followUp?: FormQuestion;
}

export interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'single select' | 'multi select';
  required: boolean;
  options?: Option[];
  order: number;
}

export const MOCK_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    text: 'Grant Scheme',
    type: 'single select',
    required: true,
    options: [
      { label: 'NHMRC' },
      { label: 'MRFF' },
      { label: 'ARC' },
      { label: 'Other' }
    ],
    order: 0
  },
  {
    id: '2',
    text: 'Involves MRI',
    type: 'single select',
    required: true,
    options: [
      { 
        label: 'Yes',
        followUp: {
          id: '2.1',
          text: 'MRI Access Type',
          type: 'single select',
          required: true,
          options: [
            { label: 'Full access' },
            { label: 'Viewing only' }
          ],
          order: 0
        }
      },
      { label: 'No' },
      { label: 'Other' }
    ],
    order: 1
  },
  {
    id: '3',
    text: 'Type of Query',
    type: 'single select',
    required: true,
    options: [
      { label: 'Contractual clause review' },
      { label: 'Support with negotiations' },
      { label: 'Advice on agreement type' },
      { label: 'Compliance advice' },
      { label: 'Other' }
    ],
    order: 2
  },
  {
    id: '4',
    text: 'Mark as Urgent',
    type: 'single select',
    required: false,
    options: [
      { label: 'Yes' },
      { label: 'No' }
    ],
    order: 3
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