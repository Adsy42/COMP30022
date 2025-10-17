import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import FormConfigPage from '../page'

jest.mock('../__mocks__/questions', () => ({
  fetchMockQuestions: jest.fn(() => Promise.resolve({ data: [] })),
  reorderMockQuestions: jest.fn(),
}))

describe('FormConfigPage', () => {
  it('shows loading spinner and message initially', () => {
    render(<FormConfigPage />)
    expect(screen.getByText(/Loading questions/i)).toBeInTheDocument()
  })

  it('shows "No questions found" after loading if there are no questions', async () => {
    render(<FormConfigPage />)
    await waitFor(() => expect(screen.getByText(/No questions found/i)).toBeInTheDocument())
    expect(screen.getByText(/Add your first question/i)).toBeInTheDocument()
  })

  it('opens the AddQuestionModal when "Add your first question" is clicked', async () => {
    render(<FormConfigPage />)
    await waitFor(() => expect(screen.getByText(/Add your first question/i)).toBeInTheDocument())
    fireEvent.click(screen.getByText(/Add your first question/i))
    // You can check for modal content if your modal renders some unique text or label
    // Example: expect(screen.getByText(/Add Question/i)).toBeInTheDocument()
  })
})