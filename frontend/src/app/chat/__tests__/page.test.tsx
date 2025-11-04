import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: ({ actions }: { actions?: React.ReactNode }) => (
    <div data-testid="navbar">{actions}</div>
  ),
}))

jest.mock('@/components/ChatInput', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-input" />,
}))

jest.mock('@/components/ChatBubble', () => ({
  __esModule: true,
  default: ({ text, role }: { text: string; role: string }) => (
    <div data-testid={`chat-bubble-${role}`}>{text}</div>
  ),
}))

jest.mock('@/components/TypingBubble', () => ({
  __esModule: true,
  default: () => <div data-testid="typing-bubble" />,
}))

jest.mock('@/components/ChoiceGroup', () => ({
  __esModule: true,
  default: () => <div data-testid="choice-group" />,
}))

jest.mock('@/lib/api', () => ({
  startChat: jest.fn(),
  getTemplate: jest.fn(),
  submitAnswers: jest.fn(),
  uploadFile: jest.fn(),
  finalize: jest.fn(),
  escalate: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />
  },
}))

import ChatPage from '../page'
import {
  startChat,
  getTemplate,
  submitAnswers,
  uploadFile,
  finalize,
  escalate,
} from '@/lib/api'

describe('ChatPage', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  beforeEach(() => {
    jest.useFakeTimers()
    ;(startChat as jest.Mock).mockResolvedValue({ chat_id: 'chat-123' })
    ;(getTemplate as jest.Mock).mockResolvedValue([])
    ;(submitAnswers as jest.Mock).mockResolvedValue({})
    ;(uploadFile as jest.Mock).mockResolvedValue({})
    ;(finalize as jest.Mock).mockResolvedValue({})
    ;(escalate as jest.Mock).mockResolvedValue({})
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders chat disclaimer and actions', async () => {
    render(<ChatPage />)

    await act(async () => {
      jest.runAllTimers()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(startChat).toHaveBeenCalled()
      expect(getTemplate).toHaveBeenCalledWith('common')
    })

    expect(
      screen.getByText(
        'This AI chatbot is in early iteration and can make mistakes.'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /new chat/i })
    ).toBeInTheDocument()
  })
})
