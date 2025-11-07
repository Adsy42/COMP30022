/**
 * @file Tests for the email configuration UI.
 * Cover the read-only state, edit toggles, and validation paths for the save button.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmailConfigPage from '../page'

describe('EmailConfigPage', () => {
  it('renders the email input after loading', async () => {
    render(<EmailConfigPage />)
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Notification Recipient Email/i)
      ).toBeInTheDocument()
    )
    expect(
      screen.getByDisplayValue('admin@university.edu.au')
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Notification Recipient Email/i)
    ).toBeDisabled()
  })

  it('enables editing when edit button is clicked', async () => {
    render(<EmailConfigPage />)
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Notification Recipient Email/i)
      ).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: /edit email/i }))
    expect(
      screen.getByLabelText(/Notification Recipient Email/i)
    ).not.toBeDisabled()
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).toBeInTheDocument()
  })

  it('disables save button for invalid email', async () => {
    render(<EmailConfigPage />)
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Notification Recipient Email/i)
      ).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: /edit email/i }))
    const input = screen.getByLabelText(/Notification Recipient Email/i)
    fireEvent.change(input, { target: { value: 'invalidemail' } })
    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
  })

  it('enables save button for valid email', async () => {
    render(<EmailConfigPage />)
    await waitFor(() =>
      expect(
        screen.getByLabelText(/Notification Recipient Email/i)
      ).toBeInTheDocument()
    )
    fireEvent.click(screen.getByRole('button', { name: /edit email/i }))
    const input = screen.getByLabelText(/Notification Recipient Email/i)
    fireEvent.change(input, { target: { value: 'user@example.com' } })
    expect(
      screen.getByRole('button', { name: /save changes/i })
    ).not.toBeDisabled()
  })
})
