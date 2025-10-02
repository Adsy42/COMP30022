/**
 * @file ChatBubble component tests
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import ChatBubble from '@/components/ChatBubble'

describe('ChatBubble', () => {
  test('renders a bot message with default label and left alignment', () => {
    render(<ChatBubble role="bot" text="Hello from bot" />)

    // Text is visible
    expect(screen.getByText('Hello from bot')).toBeInTheDocument()

    // Default label for bot shows
    expect(screen.getByText('Support Assistant')).toBeInTheDocument()

    // Left-aligned row
    const bubble = screen.getByText('Hello from bot')
    const row = bubble.parentElement
    expect(row?.className).toContain('justify-start')
  })

  test('renders a user message with default label and right alignment', () => {
    render(<ChatBubble role="user" text="Hi there" />)

    expect(screen.getByText('Hi there')).toBeInTheDocument()
    expect(screen.getByText('You')).toBeInTheDocument()

    const bubble = screen.getByText('Hi there')
    const row = bubble.parentElement
    expect(row?.className).toContain('justify-end')
  })

  test('can hide the sender label when showLabel=false', () => {
    render(<ChatBubble role="bot" text="No label please" showLabel={false} />)

    expect(screen.getByText('No label please')).toBeInTheDocument()
    expect(screen.queryByText('Support Assistant')).toBeNull()
    expect(screen.queryByText('You')).toBeNull()
  })
})
