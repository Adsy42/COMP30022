/**
 * ChatInput Component
 * -------------------
 * A controlled text input area with auto-expanding rows and a submit button.
 *
 * Props:
 * - onSend?: (message: string) => void
 *   Callback invoked when a message is submitted. Receives the trimmed input string.
 *
 * - allowEmptySubmit?: boolean (default: false)
 *   If true, allows submitting even when the input is empty.
 *
 * - requireText?: boolean (default: false)
 *   If true, submission requires a non-empty string. Overrides allowEmptySubmit.
 *
 * - externalBusy?: boolean (default: false)
 *   External signal that disables input (e.g. waiting for a bot reply).
 *
 * Behavior:
 * - Expands textarea height to fit content while typing.
 * - Auto-focuses the textarea whenever it is re-enabled.
 * - Submits message when:
 *   • Enter is pressed without Shift
 *   • Submit button is clicked
 * - Clears input after submit, disables temporarily (`isWaiting`).
 *
 * Implementation Notes:
 * - Uses internal `isWaiting` state + externalBusy to determine disabled state.
 * - `textareaRef` is used to dynamically resize and refocus input.
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function ChatInput({
  onSend,
  allowEmptySubmit = false,
  requireText = false,
  externalBusy = false,
  // NEW: attachment controls
  showAttachButton = false,
  onFilesSelected,
  accept = 'image/*,application/pdf',
  multiple = true,
}: {
  onSend?: (message: string, files: File[]) => void
  allowEmptySubmit?: boolean
  requireText?: boolean
  externalBusy?: boolean
  // NEW: attachment controls
  showAttachButton?: boolean
  onFilesSelected?: (files: File[]) => void
  accept?: string
  multiple?: boolean
}) {
  const [text, setText] = useState('') // contents state with empty default
  const [isWaiting, setIsWaiting] = useState(false) // waiting state with false default
  const busy = isWaiting || externalBusy
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // NEW: hold selected files locally (MVP)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helpers to use later
  const toggleOn = () => setIsWaiting(true)
  const toggleOff = () => setIsWaiting(false)

  // Take focus on re-enable
  useEffect(() => {
    if (!busy) {
      textareaRef.current?.focus()
    }
  }, [busy])

  // NEW: expose files upwards if requested
  useEffect(() => {
    onFilesSelected?.(files)
  }, [files, onFilesSelected])

  function submit() {
    const input = text.trim() // copy contents into input variable
    if (!input && !allowEmptySubmit) return

    // Send to parent
    if (onSend) onSend(input, files)

    // clear the input box
    setText('')
    setFiles([])
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    toggleOn() // disable input

    // TODO: Remove this later. Fake bot reply after 1s → re-enable
    setTimeout(() => {
      toggleOff()
    }, 1000)
  }

  // NEW: open native file picker
  function openFilePicker() {
    if (busy) return
    fileInputRef.current?.click()
  }

  // NEW: handle chosen files
  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files || [])
    if (chosen.length) {
      setFiles(prev => [...prev, ...chosen])
    }
    // allow re-selecting the same file again
    e.target.value = ''
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault() // override default page refresh behavior
        submit()
      }}
      className="w-full"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg ring-1 ring-black/5">
        {/* NEW: left attach button inside the box (icon to be swapped later) */}
        {showAttachButton && (
          <>
            <button
              type="button"
              onClick={openFilePicker}
              disabled={busy}
              aria-label="Attach files"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black
                        enabled:hover:bg-gray-100 active:scale-[.98] transition disabled:opacity-50"
            >
              {/* paperclip or svg goes here */}
              <Image
                src="/attach.svg"
                alt="Attach"
                width={20}
                height={20}
                className="h-5 w-5 pointer-events-none"
              />

              {/* NEW: little badge */}
              {files.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-medium text-white">
                  {files.length}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={accept}
              multiple={multiple}
              onChange={handleFilesSelected}
            />
          </>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            busy ? '' : requireText ? 'Please specify...' : 'Start typing...'
          }
          disabled={busy} // greys out & locks input
          className="flex-1 max-h-24 bg-transparent text-base leading-6 text-slate-800 outline-none
                        placeholder:text-slate-400 resize-none overflow-hidden
                        disabled:opacity-60"
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto' // reset height
            el.style.height = `${el.scrollHeight}px` // grow to fit content
          }}
          // Submit if Enter + !Shift
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault() // override default newline behavior
              if (!requireText || text.trim() !== '') {
                submit()
              }
            }
          }}
        />

        <button
          type="submit"
          disabled={
            isWaiting ||
            (!allowEmptySubmit && text.trim() === '') ||
            (requireText && text.trim() === '')
          }
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black
                            enabled:hover:bg-gray-100 active:scale-[.98] transition
                            disabled:opacity-50"
        >
          <Image
            src="/send.svg"
            alt="Send"
            width={28}
            height={28}
            className="h-7 w-7 -translate-x-[2.5px] pointer-events-none"
          />
        </button>
      </div>
    </form>
  )
}
