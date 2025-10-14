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
  displayable: boolean;
}

export const MOCK_QUESTIONS: FormQuestion[] = [
  {
    id: '1',
    question: 'Your name',
    type: 'text',
    order: 0,
    displayable: true
  },
  {
    id: '2',
    question: 'Your email',
    type: 'text',
    order: 1,
    displayable: true
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
      { label: 'Research Infrastructure' }
    ],
    order: 2,
    displayable: true
  },
  {
    id: '4',
    question: 'Stage of Query',
    type: 'single',
    options: [
      { label: 'Pre-Award' },
      { label: 'Post-Award' },
      { label: 'Other' }
    ],
    order: 3,
    displayable: true
  },
  {
    id: '5',
    question: 'Is this a simple query or complex referral?',
    type: 'single',
    options: [
      {
        label: 'Simple',
        followUp: {
          id: '5.1',
          question: 'Simple Query Details',
          type: 'multi',
          options: [
            {
              label: 'Grant Scheme',
              followUp: {
                id: '5.1.1',
                question: 'Select Grant Scheme',
                type: 'single',
                options: [
                  { label: 'NHMRC' },
                  { label: 'MRFF' },
                  { label: 'ARC' },
                  { label: 'ECR' },
                  { label: 'NIH' },
                  { label: 'Other' }
                ],
                order: 0,
                displayable: true
              }
            },
            {
              label: 'MRI Involvement',
              followUp: {
                id: '5.1.2',
                question: 'Does this involve an MRI?',
                type: 'single',
                options: [
                  { label: 'Yes' },
                  { label: 'No' },
                  { label: 'Other' }
                ],
                order: 1,
                displayable: true
              }
            },
            {
              label: 'Query Type',
              followUp: {
                id: '5.1.3',
                question: 'Type of Query',
                type: 'single',
                options: [
                  {
                    label: 'Review of contractual clause',
                    followUp: {
                      id: '5.1.3.1',
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
                        { label: 'Other' }
                      ],
                      order: 0,
                      displayable: true
                    }
                  },
                  { label: 'Support with negotiations' },
                  { label: 'Advice on appropriate agreement' },
                  { label: 'Advice on compliance with grant obligations' },
                  { label: 'Other' }
                ],
                order: 2,
                displayable: true
              }
            }
          ],
          order: 0,
          displayable: true
        }
      },
      {
        label: 'Complex',
        followUp: {
          id: '5.2',
          question: 'Complex Referral Details',
          type: 'multi',
          options: [
            {
              label: 'Grant Scheme',
              followUp: {
                id: '5.2.1',
                question: 'Select Grant Scheme',
                type: 'single',
                options: [
                  { label: 'NHMRC' },
                  { label: 'MRFF' },
                  { label: 'ARC' },
                  { label: 'ECR' },
                  { label: 'NIH' },
                  { label: 'Other' }
                ],
                order: 0,
                displayable: true
              }
            },
            {
              label: 'MRI Involvement',
              followUp: {
                id: '5.2.2',
                question: 'Does this involve an MRI?',
                type: 'single',
                options: [
                  { label: 'Yes' },
                  { label: 'No' },
                  { label: 'Other' }
                ],
                order: 1,
                displayable: true
              }
            },
            {
              label: 'Chief Investigator',
              followUp: {
                id: '5.2.3',
                question: 'Chief Investigator Name',
                type: 'text',
                order: 2,
                displayable: true
              }
            },
            {
              label: 'Faculty Details',
              followUp: {
                id: '5.2.4',
                question: 'Faculty and Department',
                type: 'text',
                order: 3,
                displayable: true
              }
            },
            {
              label: 'Project Title',
              followUp: {
                id: '5.2.5',
                question: 'Project Title',
                type: 'text',
                order: 4,
                displayable: true
              }
            },
            {
              label: 'UoM Lead Status',
              followUp: {
                id: '5.2.6',
                question: 'Is UoM the lead?',
                type: 'single',
                options: [
                  { label: 'Lead' },
                  { label: 'Non-Lead' }
                ],
                order: 5,
                displayable: true
              }
            },
            {
              label: 'Other Parties',
              followUp: {
                id: '5.2.7',
                question: 'Are there other parties involved in the Project?',
                type: 'single',
                options: [
                  {
                    label: 'Yes',
                    followUp: {
                      id: '5.2.7.1',
                      question: 'Other Party Details',
                      type: 'multi',
                      options: [
                        {
                          label: 'Party Name',
                          followUp: {
                            id: '5.2.7.1.1',
                            question: 'Other Party 1 - Name',
                            type: 'text',
                            order: 0,
                            displayable: true
                          }
                        },
                        {
                          label: 'Party Role',
                          followUp: {
                            id: '5.2.7.1.2',
                            question: 'Other Party 1 - Role in the project',
                            type: 'single',
                            options: [
                              { label: 'Funder' },
                              { label: 'Administering Organisation' },
                              { label: 'Collaborator' },
                              { label: 'Incoming party' },
                              { label: 'Outgoing party' },
                              { label: 'Other' } 
                            ],
                            order: 1,
                            displayable: true
                          }
                        }
                      ],
                      order: 0,
                      displayable: true
                    }
                  },
                  { label: 'No' }
                ],
                order: 6,
                displayable: true
              }
            },
            {
              label: 'Agreement Type',
              followUp: {
                id: '5.2.8',
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
                  { label: 'Other' }
                ],
                order: 7,
                displayable: true
              }
            },
            {
              label: 'HPECM Reference',
              followUp: {
                id: '5.2.9',
                question: 'HPECM reference',
                type: 'text',
                order: 8,
                displayable: true
              }
            },
            {
              label: 'Related Agreements',
              followUp: {
                id: '5.2.10',
                question: 'Are there other agreements that relate to this project?',
                type: 'text',
                order: 9,
                displayable: true
              }
            },
            {
              label: 'Help Request',
              followUp: {
                id: '5.2.11',
                question: 'How can we help?',
                type: 'text',
                order: 10,
                displayable: true
              }
            },
            {
              label: 'Additional Notes',
              followUp: {
                id: '5.2.12',
                question: 'Other notes',
                type: 'text',
                order: 11,
                displayable: false
              }
            },
            {
              label: 'Document Attachments',
              followUp: {
                id: '5.2.13',
                question: 'Attach all relevant documents',
                type: 'text',
                order: 12,
                displayable: true
              }
            },
            {
              label: 'Urgency',
              followUp: {
                id: '5.2.14',
                question: 'Is there urgency on this request?',
                type: 'single',
                options: [
                  {
                    label: 'Yes',
                    followUp: {
                      id: '5.2.14.1',
                      question: 'Provide urgency date',
                      type: 'text',
                      order: 0,
                      displayable: true
                    }
                  },
                  { label: 'No' }
                ],
                order: 13,
                displayable: true
              }
            }
          ],
          order: 1,
          displayable: true
        }
      }
    ],
    order: 4,
    displayable: true
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