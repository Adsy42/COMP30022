import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Omit priority from img attributes to avoid DOM warnings
    const { priority, ...imgProps } = props
    return <img {...imgProps} />
  },
}))

// Mock BackgroundIllustration component
jest.mock('@/components/BackgroundIllustration', () => ({
  BackgroundIllustration: () => <div data-testid="background-illustration" />,
}))

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('renders all form elements correctly', () => {
    render(<LoginPage />)

    // Check for main elements
    expect(screen.getByText('Administrator Sign In')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('admin@grants2contracts.example')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument()
    expect(screen.getByTestId('background-illustration')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    render(<LoginPage />)

    // Fill form with correct credentials
    fireEvent.change(
      screen.getByPlaceholderText('admin@grants2contracts.example'),
      {
        target: { value: 'admin@grants2contracts.example' },
      }
    )
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Check loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()

    // Verify redirect and token storage
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'mock_jwt_token'
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/admin')
    })
  })

  it('handles failed login attempt', async () => {
    render(<LoginPage />)

    // Fill form with incorrect credentials
    fireEvent.change(
      screen.getByPlaceholderText('admin@grants2contracts.example'),
      {
        target: { value: 'wrong@example.com' },
      }
    )
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })

    // Verify no redirect or token storage
    expect(mockRouter.push).not.toHaveBeenCalled()
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })

  it('disables form elements during submission', async () => {
    render(<LoginPage />)

    // Fill form
    fireEvent.change(
      screen.getByPlaceholderText('admin@grants2contracts.example'),
      {
        target: { value: 'admin@grants2contracts.example' },
      }
    )
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Check disabled states
    expect(
      screen.getByPlaceholderText('admin@grants2contracts.example')
    ).toBeDisabled()
    expect(screen.getByPlaceholderText('Password')).toBeDisabled()
    expect(screen.getByLabelText('Remember Me')).toBeDisabled()
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })
})
