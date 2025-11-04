'use client'

import { useEffect, useRef, useState } from 'react'

type Role = 'user' | 'bot'

type Props = {
  role: Role
  text: string
  className?: string
  bubbleClassName?: string
  showLabel?: boolean
  /** Enable character-by-character animation for bot messages */
  animate?: boolean
  /** Milliseconds per character (default 24) */
  typewriterSpeed?: number
  /** Called as text reveals (for auto-scroll) */
  onChunk?: () => void
  /** Called once when the message has fully rendered */
  onComplete?: () => void
}

export default function ChatBubble({
  role,
  text,
  className = '',
  bubbleClassName = '',
  showLabel = true,
  animate = false,
  typewriterSpeed = 24,
  onChunk,
  onComplete,
}: Props) {
  const isUser = role === 'user'
  const label = isUser ? 'You' : 'Support Assistant'

  // same colors, font, ring, spacing as before
  const bubbleTone = isUser
    ? 'bg-[#EAF2FC] text-[#033F85] ring-1 ring-[#D6E8FF]'
    : 'bg-[#F1F5F9] text-[#033F85] ring-1 ring-slate-200/80'

  // --- animation state ---
  const shouldAnimate = animate && role === 'bot'
  const [shown, setShown] = useState<string>(shouldAnimate ? '' : text)
  const timerRef = useRef<number | null>(null)
  const chunkCallbackRef = useRef(onChunk)
  const completeCallbackRef = useRef(onComplete)
  const completionCalledRef = useRef(false)
  const cleanupPendingRef = useRef(false)
  const cleanupTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    chunkCallbackRef.current = onChunk
  }, [onChunk])

  useEffect(() => {
    completeCallbackRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    completionCalledRef.current = false
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current)
      cleanupTimeoutRef.current = null
    }
    cleanupPendingRef.current = false

    const signalComplete = () => {
      if (completionCalledRef.current) return
      completionCalledRef.current = true
      cleanupPendingRef.current = false
      completeCallbackRef.current?.()
    }

    if (!shouldAnimate) {
      setShown(text)
      signalComplete()
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        signalComplete()
      }
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    setShown('')
    let i = 0
    const step = () => {
      i++
      setShown(text.slice(0, i))
      chunkCallbackRef.current?.()
      if (i < text.length) {
        timerRef.current = window.setTimeout(step, typewriterSpeed)
      } else {
        timerRef.current = null
        signalComplete()
      }
    }
    timerRef.current = window.setTimeout(step, typewriterSpeed)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      cleanupPendingRef.current = true
      cleanupTimeoutRef.current = window.setTimeout(() => {
        if (cleanupPendingRef.current && !completionCalledRef.current) {
          signalComplete()
        }
        cleanupTimeoutRef.current = null
      }, 0)
    }
  }, [text, shouldAnimate, typewriterSpeed])

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div
          className={`mb-2 text-xs ${
            isUser ? 'text-right' : 'text-left'
          } text-slate-600 font-semibold`}
        >
          {label}
        </div>
      )}

      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={[
            // width & wrapping
            'max-w-[75%] whitespace-pre-wrap break-words text-base leading-6',
            // pill shape + same padding
            'rounded-2xl px-5 py-2 shadow-sm',
            bubbleTone,
            bubbleClassName,
          ].join(' ')}
        >
          {shown}
        </div>
      </div>
    </div>
  )
}
