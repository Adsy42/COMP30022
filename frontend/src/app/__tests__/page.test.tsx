import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', {
      name: /AI support for grants and contracts/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('renders description text', () => {
    render(<Home />)
    const description = screen.getByText(
      /Our AI assistant helps researchers and grants officers handle routine processes instantly, and escalates complex queries seamlessly to the Contracts Team./i
    )
    expect(description).toBeInTheDocument()
  })

  it('renders main element', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
