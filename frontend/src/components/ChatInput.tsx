'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function ChatInput({
  onSend,
  allowEmptySubmit = false,
  requireText = false,
  externalBusy = false,
}: {
  onSend?: (message: string) => void
  allowEmptySubmit?: boolean
  requireText?: boolean
  externalBusy?: boolean
}) {
  const [text, setText] = useState('') // contents state with empty default
  const [isWaiting, setIsWaiting] = useState(false) // waiting state with false default
  const busy = isWaiting || externalBusy
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Helpers to use later
  const toggleOn = () => setIsWaiting(true)
  const toggleOff = () => setIsWaiting(false)

  // Take focus on re-enable
  useEffect(() => {
    if (!busy) {
      textareaRef.current?.focus()
    }
  }, [busy])

  function submit() {
    const input = text.trim() // copy contents into input variable
    if (!input && !allowEmptySubmit) return

    // Send to parent
    if (onSend) onSend(input)

    // clear the input box
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    toggleOn() // disable input

    // TODO: Remove this later. Fake bot reply after 1s → re-enable
    setTimeout(() => {
      toggleOff()
    }, 1000)
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
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            busy ? '' : requireText ? 'Please specify...' : 'Start typing...'
          }
          disabled={busy} // greys out & locks input
          className="flex-1 max-h-24 bg-transparent text-[15px] leading-6 text-slate-800 outline-none
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
