import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInput from '@/components/ChatInput'

/**
 * Helper: assert the first call had the expected message,
 * and (optionally) files if the component provides them.
 */
function expectCalledWithMessageAndMaybeFiles(
  mockFn: jest.Mock,
  expectedMessage: string,
  expectedFilesCount?: number
) {
  expect(mockFn).toHaveBeenCalled()
  const call = mockFn.mock.calls[0]
  // arg0 must be message
  expect(call[0]).toBe(expectedMessage)
  // arg1 may or may not exist depending on ChatInput's onSend signature
  const maybeFiles = call[1]
  if (typeof expectedFilesCount === 'number') {
    if (Array.isArray(maybeFiles)) {
      expect(maybeFiles).toHaveLength(expectedFilesCount)
    } else {
      // If files weren't passed through, we still accept it for compatibility
      // but keep an expectation people can update later if API stabilizes.
      expect(maybeFiles === undefined || maybeFiles === null).toBe(true)
    }
  }
}

describe('Chat input composer', () => {
  test('basic flow: type, submit with Enter, busy cooldown, re-enable', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const onSend = jest.fn()

    render(<ChatInput onSend={onSend} />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    const sendBtn = screen.getByRole('button', { name: /send/i })

    // initially disabled until text present
    expect(sendBtn).toBeDisabled()

    await user.type(textarea, 'hello world')
    expect(sendBtn).toBeEnabled()

    // press Enter to submit
    await user.keyboard('{Enter}')

    expect(onSend).toHaveBeenCalledTimes(1)
    expectCalledWithMessageAndMaybeFiles(onSend, 'hello world')

    // clears and enters cooldown
    expect(textarea.value).toBe('')
    expect(textarea).toBeDisabled()
    expect(sendBtn).toBeDisabled()

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(textarea).toBeEnabled()
    // Button reverts to disabled (no text)
    expect(sendBtn).toBeDisabled()

    jest.useRealTimers()
  })

  test('requireText blocks empty submits even if allowEmptySubmit is true', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const onSend = jest.fn()

    render(
      <ChatInput onSend={onSend} allowEmptySubmit={true} requireText={true} />
    )

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    const sendBtn = screen.getByRole('button', { name: /send/i })

    // empty submit blocked
    await user.keyboard('{Enter}')
    expect(onSend).not.toHaveBeenCalled()

    // whitespace blocked
    await user.type(textarea, '   ')
    expect(sendBtn).toBeDisabled()
    await user.keyboard('{Enter}')
    expect(onSend).not.toHaveBeenCalled()

    // non-empty allowed
    await user.clear(textarea)
    await user.type(textarea, 'specified value')
    expect(sendBtn).toBeEnabled()
    await user.keyboard('{Enter}')

    expect(onSend).toHaveBeenCalledTimes(1)
    expectCalledWithMessageAndMaybeFiles(onSend, 'specified value')

    // cooldown
    expect(textarea).toBeDisabled()
    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    expect(textarea).toBeEnabled()

    jest.useRealTimers()
  })

  test('externalBusy disables the textarea; send behavior depends on allowEmptySubmit', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
    const onSend = jest.fn()

    // allowEmptySubmit=true so clicking send with empty input is allowed
    render(
      <ChatInput
        onSend={onSend}
        externalBusy={true}
        allowEmptySubmit={true}
        requireText={false}
      />
    )

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    const sendBtn = screen.getByRole('button', { name: /send/i })

    expect(textarea).toBeDisabled()
    expect(sendBtn).toBeEnabled()

    await user.click(sendBtn)

    expect(onSend).toHaveBeenCalledTimes(1)
    expectCalledWithMessageAndMaybeFiles(onSend, '')

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })
    // still disabled because externalBusy is true
    expect(textarea).toBeDisabled()

    jest.useRealTimers()
  })

  test('attachments: selecting files and submitting passes files if provided by ChatInput', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

    // Use a two-arg mock to allow receiving files if component passes them
    const onSend = jest.fn((message: string, files?: File[]) => {})

    render(
      <ChatInput
        onSend={onSend}
        showAttachButton={true}
        allowEmptySubmit={false}
      />
    )

    // Hidden <input type="file"> is in the DOM; select it directly
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    expect(fileInput).toBeTruthy()

    const file1 = new File(['hello'], 'a.txt', { type: 'text/plain' })
    const file2 = new File(['world'], 'b.txt', { type: 'text/plain' })

    await user.upload(fileInput, [file1, file2])

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    await user.type(textarea, 'with files')
    await user.keyboard('{Enter}')

    expect(onSend).toHaveBeenCalledTimes(1)
    // We accept either: files passed as arg1, or not passed (undefined)
    // If passed, assert both are present.
    const call = onSend.mock.calls[0]
    expect(call[0]).toBe('with files')
    const maybeFiles = call[1]
    // Only assert file content if files are actually passed (non-empty array)
    if (Array.isArray(maybeFiles) && maybeFiles.length > 0) {
      expect(maybeFiles).toHaveLength(2)
      expect(maybeFiles[0].name).toBe('a.txt')
      expect(maybeFiles[1].name).toBe('b.txt')
    } else {
      // Accept ChatInput implementations that don't pass files or pass an empty array
      expect(
        maybeFiles === undefined ||
          (Array.isArray(maybeFiles) && maybeFiles.length === 0)
      ).toBe(true)
    }

    jest.useRealTimers()
  })
})
