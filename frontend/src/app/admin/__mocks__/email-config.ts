// Mock data type
export interface EmailConfig {
  recipientEmail: string
}

// Simulate fetching email config
export async function fetchMockEmailConfig(): Promise<EmailConfig> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return { recipientEmail: 'admin@university.edu.au' }
}

// Simulate updating email config
export async function updateMockEmailConfig(email: string): Promise<EmailConfig> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return { recipientEmail: email }
}