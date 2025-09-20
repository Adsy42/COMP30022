import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to your next\.js app/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Home />)

    const description = screen.getByText(
      /this is a minimal react\/next\.js setup/i
    )
    expect(description).toBeInTheDocument()
  })

  it('renders main element', () => {
    render(<Home />)

    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
