export interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'single select' | 'multi select';
  required: boolean;
  options?: string[];
  order: number;
}

export const MOCK_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    text: 'Grant Scheme',
    type: 'single select',
    required: true,
    options: ['NHMRC', 'MRFF', 'ARC', 'Other'],
    order: 0
  },
  {
    id: '2',
    text: 'Involves MRI',
    type: 'single select',
    required: true,
    options: ['Yes', 'No', 'Other'],
    order: 1
  },
  {
    id: '3',
    text: 'Type of Query',
    type: 'single select',
    required: true,
    options: ['Contractual clause review', 'Support with negotiations', 'Advice on agreement type', 'Compliance advice', 'Other'],
    order: 2
  },
  {
    id: '4',
    text: 'Mark as Urgent',
    type: 'single select',
    required: false,
    options: ['Yes', 'No'],
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