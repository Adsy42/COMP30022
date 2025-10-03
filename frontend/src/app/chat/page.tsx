/**
 * ChatPage Component
 * ------------------
 * Main chat screen combining Navbar, ChoiceGroup, and ChatInput.
 * WIP. Needs chat bubbles and API wiring.
 *
 * State:
 * - q_type: 'freeform' | 'single' | 'multi'
 *   Determines whether the user answers with free text, single-choice, or multi-choice.
 *
 * - input: string[]
 *   Final submitted value (collected answer).
 *
 * - tempChoices: string[]
 *   Temporary selections from ChoiceGroup before being confirmed.
 *
 * Derived State:
 * - allowEmptySubmit: boolean
 *   True if non-freeform and at least one choice selected.
 *
 * - needsOtherText: boolean
 *   True if "Other (please specify)" is selected, requiring user to type text.
 *
 * - forceBusy: boolean
 *   Keeps ChatInput disabled until freeform input is provided for "Other".
 *
 * Behavior:
 * - Logs submitted input to console on change.
 * - `handleSend`:
 *   • Freeform mode: sets trimmed message as input.
 *   • Choice mode: uses tempChoices, replacing "Other" with typed text if provided.
 *   • Clears tempChoices after commit.
 *
 * UI Layout:
 * - Navbar at top.
 * - Fixed bottom section with ChoiceGroup (if not freeform) + ChatInput.
 * - Responsive container with max-width constraints.
 */

'use client'

import Navbar from '@/components/Navbar'
import ChatInput from '@/components/ChatInput'
import ChoiceGroup from '@/components/ChoiceGroup'
import ChatBubble from '@/components/ChatBubble'
import TypingBubble from '@/components/TypingBubble'
import { useState, useEffect } from 'react'

export default function ChatPage() {
  const OTHER = 'Other (please specify)'
  const [q_type, setQType] = useState<'freeform' | 'single' | 'multi'>('single')
  const [input, setInput] = useState<string[]>([])
  const [tempChoices, setTempChoices] = useState<string[]>([])
  const [botTyping, setBotTyping] = useState(false)
  const allowEmptySubmit = q_type !== 'freeform' && tempChoices.length > 0
  const needsOtherText = q_type !== 'freeform' && tempChoices.includes(OTHER)
  const forceBusy = q_type !== 'freeform' && !tempChoices.includes(OTHER)

  useEffect(() => {
    console.log(input)
  }, [input])

  const handleSend = (msg: string, _files: File[] = []) => {
    if (q_type === 'freeform') {
      if (!msg.trim()) return
      setInput([msg.trim()])
      return
    }
    if (tempChoices.length === 0) return // extra guard, will never happen anyway

    // If OTHER is selected and user typed something, replace OTHER with the text
    const hasOther = tempChoices.includes(OTHER)
    const base = hasOther ? tempChoices.filter(o => o !== OTHER) : tempChoices
    const final = hasOther && msg.trim() ? [...base, msg.trim()] : tempChoices
    setInput(final)
    setTempChoices([])

    // Show typing bubble when bot processes the response
    setBotTyping(true)
    // TODO: Replace with real API call later
    setTimeout(() => {
      setBotTyping(false)
      // when i add real bot message, push it here
    }, 2000)
  }



  return (
    <>
      <Navbar />

      {/* Full-height canvas below the navbar.
         If your navbar height is ~64px (h-16), this keeps the page from over/underflowing. */}
      <main className="mx-auto max-w-4xl px-6">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-4xl flex-col">
          {/* Transcript grows/shrinks automatically. It scrolls if content is tall. */}
          <section className="flex-1 overflow-y-auto pt-6 pb-1 px-1 sm:px-2">
            <div className="mx-auto flex max-w-4xl flex-col gap-10 overflow-x-visible">
              <ChatBubble role="bot" text="what’s your name?" />
              <ChatBubble role="user" text="Sarah Johnson" />

              <ChatBubble
                role="bot"
                text="Thanks, Sarah. What’s your email address? (required)"
              />
              <ChatBubble role="user" text="sarah.johnson@unimelb.edu.au" />

              <ChatBubble
                role="bot"
                text="Great — which Grants team are you from? (required)"
              />
              <ChatBubble role="user" text="RDS" />

              <ChatBubble
                role="bot"
                text="Got it, What’s the stage of your query? (required)"
              />
              <ChatBubble
                role="bot"
                text="An extremely long message. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec imperdiet enim velit, eu porttitor est ultricies molestie. Cras et arcu ultricies, rutrum sapien ac, sodales arcu. Vestibulum mattis felis dolor, sit amet tincidunt felis commodo in. Nullam ante nibh, lacinia non aliquam in, euismod eu risus. Aliquam consectetur tincidunt lacus."
              />
              {botTyping && <TypingBubble />}
            </div>
          </section>

          {/* Footer stays in normal flow; no clipping. When it gets taller, the transcript above
             just gets a bit shorter because of flex. 'sticky' keeps it hugging the bottom. */}
          <footer className="sticky bottom-0 bg-transparent pt-3 pb-8">
            <div className="mx-auto max-w-3xl">
              {q_type !== 'freeform' && (
                <div className="mb-3 flex justify-center">
                  <ChoiceGroup
                    mode={q_type === 'single' ? 'single' : 'multi'}
                    options={['Pre-Award', 'Post-Award', OTHER]}
                    onChange={selected => setTempChoices(selected)}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <ChatInput
                  onSend={handleSend}
                  allowEmptySubmit={allowEmptySubmit}
                  requireText={needsOtherText}
                  externalBusy={forceBusy}
                  showAttachButton={true}
                  onFilesSelected={(files) => console.log(files)}
                />
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
