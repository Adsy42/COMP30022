import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'

// Mock the login API
const mockLogin = jest.fn()
jest.mock('@/lib/api', () => ({
  login: (...args: any[]) => mockLogin(...args),
}))

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
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
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
    mockLogin.mockImplementation((username: string, password: string) => {
      if (username === 'admin@unimelb.edu.au' && password === 'password') {
        return Promise.resolve({ success: true, token: 'mock_jwt_token' })
      }
      return Promise.reject(new Error('Invalid credentials'))
    })
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
      screen.getByPlaceholderText('admin@unimelb.edu.au')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument()
    expect(screen.getByTestId('background-illustration')).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    render(<LoginPage />)

    // Fill form with correct credentials
    fireEvent.change(screen.getByPlaceholderText('admin@unimelb.edu.au'), {
      target: { value: 'admin@unimelb.edu.au' },
    })
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
        'token',
        'mock_jwt_token'
      )
      expect(mockRouter.push).toHaveBeenCalledWith('/admin')
    })
  })

  it('handles failed login attempt', async () => {
    render(<LoginPage />)

    // Fill form with incorrect credentials
    fireEvent.change(screen.getByPlaceholderText('admin@unimelb.edu.au'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Check for error message
    await waitFor(() => {
      expect(
        screen.getByText('Invalid username or password')
      ).toBeInTheDocument()
    })

    // Verify no redirect or token storage
    expect(mockRouter.push).not.toHaveBeenCalled()
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })

  // TODO: Fix race condition in disabled state test
  it.skip('disables form elements during submission', async () => {
    render(<LoginPage />)

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('admin@unimelb.edu.au'), {
      target: { value: 'admin@unimelb.edu.au' },
    })
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Check disabled states
    expect(screen.getByPlaceholderText('admin@unimelb.edu.au')).toBeDisabled()
    expect(screen.getByPlaceholderText('Password')).toBeDisabled()
    expect(screen.getByLabelText('Remember Me')).toBeDisabled()
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
  })
})
