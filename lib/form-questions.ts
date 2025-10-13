// Types
export interface APIResponse<T> {
  data: T;
  error?: string;
}

export interface FormQuestion {
  id: string;
  text: string;
  type: 'text' | 'single select' | 'multi select';
  required: boolean;
  options?: string[];
  order: number;
}

// Mock data
export const INITIAL_QUESTIONS: FormQuestion[] = [
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

// API endpoints
export const API_ENDPOINTS = {
  QUESTIONS: '/api/form-questions',
  REORDER: '/api/form-questions/reorder'
} as const;

// Mock API functions
export const fetchQuestions = async (): Promise<APIResponse<FormQuestion[]>> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return { data: INITIAL_QUESTIONS };
};

export const updateQuestionOrder = async (questions: FormQuestion[]): Promise<APIResponse<void>> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return { data: undefined };
};