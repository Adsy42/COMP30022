import { render, screen, waitFor } from '@testing-library/react'
import FormConfigPage from '../page'
import { fetchQuestions } from '@/lib/api'

jest.mock('@/lib/api', () => ({
  fetchQuestions: jest.fn(),
  updateQuestions: jest.fn(),
  reorderQuestions: jest.fn(),
}))

const mockFetchQuestions = fetchQuestions as jest.MockedFunction<
  typeof fetchQuestions
>

beforeEach(() => {
  mockFetchQuestions.mockResolvedValue({ data: [] })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('FormConfigPage', () => {
  it('shows loading spinner and message initially', async () => {
    render(<FormConfigPage />)
    expect(screen.getByText(/Loading questions/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(mockFetchQuestions).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(screen.getByText(/No questions found/i)).toBeInTheDocument()
    })
  })
})
