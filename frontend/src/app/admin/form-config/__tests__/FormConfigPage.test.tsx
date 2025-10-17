import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import FormConfigPage from '../page'

describe('FormConfigPage', () => {
  it('shows loading spinner and message initially', () => {
    render(<FormConfigPage />)
    expect(screen.getByText(/Loading questions/i)).toBeInTheDocument()
  })
}) 