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
import { useState, useEffect } from 'react'

export default function ChatPage() {
  const OTHER = 'Other (please specify)'
  const [q_type, setQType] = useState<'freeform' | 'single' | 'multi'>('single')
  const [input, setInput] = useState<string[]>([])
  const [tempChoices, setTempChoices] = useState<string[]>([])
  const allowEmptySubmit = q_type !== 'freeform' && tempChoices.length > 0
  const needsOtherText = q_type !== 'freeform' && tempChoices.includes(OTHER)
  const forceBusy = q_type !== 'freeform' && !tempChoices.includes(OTHER)

  useEffect(() => {
    console.log(input)
  }, [input])

  const handleSend = (msg: string) => {
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
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 pb-32">
        <div className="fixed inset-x-0 bottom-8 mx-auto max-w-3xl px-6">
          <div className="flex flex-col items-center gap-3">
            {q_type !== 'freeform' && (
              <ChoiceGroup
                mode={q_type === 'single' ? 'single' : 'multi'}
                options={[
                  'Pre-Award',
                  'Post-Award',
                  OTHER,
                ]}
                onChange={selected => setTempChoices(selected)}
              />
            )}

            <ChatInput
              onSend={handleSend}
              allowEmptySubmit={allowEmptySubmit}
              requireText={needsOtherText}
              externalBusy={forceBusy}
            />
          </div>
        </div>
      </main>
    </>
  )
}
