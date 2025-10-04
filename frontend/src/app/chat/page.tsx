'use client'

import Navbar from '@/components/Navbar'
import ChatInput from '@/components/ChatInput'
import ChoiceGroup from '@/components/ChoiceGroup'
import ChatBubble from '@/components/ChatBubble'
import TypingBubble from '@/components/TypingBubble'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  startChat,
  getTemplate,
  submitAnswers,
  uploadFile,
  finalize,
  escalate,
} from '@/lib/api'

type Role = 'user' | 'bot'
type QType = 'freeform' | 'single' | 'multi'
type Question = {
  id: string
  question: string
  type: QType
  options?: Array<{ label: string; followUp?: any }> | null
}
type AnswerPayload = { q_id: string; ans: string | string[] }

type Phase =
  | 'boot'
  | 'common'
  | 'branch'
  | 'simple'
  | 'complex'
  | 'finalizing'
  | 'done'
  | 'error'
  | 'simple_ai' 
  | 'escalate_confirm'
  | 'escalate_reason' 
  | 'escalating' 

const OTHER = 'Other (please specify)'

export default function ChatPage() {
  // Transcript
  const [messages, setMessages] = useState<Array<{ role: Role; text: string }>>(
    []
  )

  // Driver state
  const [phase, setPhase] = useState<Phase>('boot')
  const [qIdx, setQIdx] = useState(0)
  const [botTyping, setBotTyping] = useState(false)
  const [showChips, setShowChips] = useState(false)

  // Data
  const [chatId, setChatId] = useState<string | null>(null)
  const [commonQs, setCommonQs] = useState<Question[] | null>(null)
  const [simpleQs, setSimpleQs] = useState<Question[] | null>(null)
  const [complexQs, setComplexQs] = useState<Question[] | null>(null)
  const [commonAnswers, setCommonAnswers] = useState<AnswerPayload[]>([])
  const [simpleAnswers, setSimpleAnswers] = useState<AnswerPayload[]>([])
  const [complexAnswers, setComplexAnswers] = useState<AnswerPayload[]>([])
  const [attachmentIds, setAttachmentIds] = useState<string[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  // UI selection buffer
  const [tempChoices, setTempChoices] = useState<string[]>([])

  function delay(ms: number) {
    return new Promise(res => setTimeout(res, ms))
  }
  async function withTyping<T>(work: Promise<T>) {
    setBotTyping(true)
    const [result] = await Promise.all([work, delay(1000)]) // ≥1s typing
    setBotTyping(false)
    return result
  }
  async function botSay(text: string, minMs = 600) {
    await withTyping(delay(minMs))   // guarantees typing bubble
    appendBot(text)
  }  
  function appendBot(text: string) {
    setMessages(prev => [...prev, { role: 'bot', text }])
  }
  function appendUser(text: string) {
    setMessages(prev => [...prev, { role: 'user', text }])
  }
  function presentQuestion(q: Question) {
    setTempChoices([])
    setShowChips(true)
    appendBot(q.question)
  }
  function logApi(label: string, payload: unknown, result: unknown) {
    // Dev-friendly structured logs
    // eslint-disable-next-line no-console
    console.log(`[API] ${label}`, { request: payload, response: result })
  }

  // Which question list are we on?
  const currQs: Question[] | null = useMemo(() => {
    if (phase === 'common') return commonQs
    if (phase === 'simple') return simpleQs
    if (phase === 'complex') return complexQs
    return null
  }, [phase, commonQs, simpleQs, complexQs])

  const currQ: Question | null = useMemo(() => {
    if (!currQs) return null
    return currQs[qIdx] ?? null
  }, [currQs, qIdx])

  // Input mode + options (append "Other" if it's a choice question)
  const mode: QType = useMemo(() => {
    if (phase === 'branch') return 'single'
    if (phase === 'escalate_confirm') return 'single'
    if (phase === 'escalate_reason') return 'freeform'
    return currQ?.type ?? 'freeform'
  }, [phase, currQ])

  const options: string[] = useMemo(() => {
    if (phase === 'branch') return ['Simple', 'Complex']
    if (phase === 'escalate_confirm') return ['Escalate', 'Finish']
    const base = (currQ?.options ?? [])?.map(o => o.label) ?? []
    if (mode === 'single' || mode === 'multi') {
      return base.includes(OTHER) ? base : [...base, OTHER]
    }
    return base
  }, [phase, currQ, mode])

  // ChatInput gating rules
  const otherSelected = mode !== 'freeform' && tempChoices.includes(OTHER)
  const allowEmptySubmit =
    mode !== 'freeform' &&
    tempChoices.length > 0 &&
    !otherSelected
  const requireText = mode !== 'freeform' && otherSelected

  // Boot: start chat + load common
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const started = await withTyping(startChat())
        if (!mounted) return
        logApi('POST /chats', null, started)
        setChatId(started.chat_id)
        appendBot("Hi — I’m here to help you fill the form.")

        const qs = await withTyping(getTemplate('common'))
        if (!mounted) return
        logApi('GET /templates?template=common', null, qs)
        setCommonQs(qs as Question[])
        setPhase('common')
        if (Array.isArray(qs) && qs.length > 0) {
          setQIdx(0)
          presentQuestion(qs[0])
        }
      } catch (err) {
        if (!mounted) return
        setPhase('error')
        appendBot('Sorry, something went wrong while starting your session.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] boot', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Build answer (adds Other: prefix if needed)
  function buildAnswerForCurrentQuestion(
    msg: string
  ): string | string[] | null {
    if (phase === 'branch' || phase === 'escalate_confirm') {
      if (tempChoices.length === 0) return null
      return tempChoices[0]
    }

    if (phase === 'escalate_reason') {
      const t = msg.trim()
      return t ? t : null
    }

    if (!currQ) return null

    if (mode === 'freeform') {
      const t = msg.trim()
      return t ? t : null
    }

    // choice-based
    if (tempChoices.length === 0) return null
    const hasOther = tempChoices.includes(OTHER)
    if (mode === 'single') {
      if (hasOther) {
        const t = msg.trim()
        if (!t) return null
        return `Other: ${t}`
      }
      return tempChoices[0]
    } else {
      // multi
      if (hasOther) {
        const t = msg.trim()
        if (!t) return null
        return [...tempChoices.filter(v => v !== OTHER), `Other: ${t}`]
      }
      return [...tempChoices]
    }
  }

  const handleSend = async (msg: string, files: File[] = []) => {
    const built = buildAnswerForCurrentQuestion(msg)
    if (built == null) return
  
    // 1) Echo user message
    const userText = Array.isArray(built) ? built.join(', ') : (built as string)
    appendUser(userText)
  
    // 2) Immediately hide chips and clear selection
    setShowChips(false)
    setTempChoices([])
  
    // ============ BRANCH ============
    if (phase === 'branch') {
      if (built === 'Simple') {
        try {
          const qs = await withTyping(getTemplate('simple'))
          logApi('GET /templates?template=simple', null, qs)
          setSimpleQs(qs as Question[])
          setPhase('simple')
          setQIdx(0)
          await botSay('Okay — I can provide an answer after a few more questions.', 450)
          if (Array.isArray(qs) && qs.length > 0) {
            await botSay(qs[0].question, 600)
            setTempChoices([]); setShowChips(true)
          }
        } catch (err) {
          setPhase('error')
          appendBot('Sorry, there was a problem loading the simple form. Please refresh the page and try again.')
          // eslint-disable-next-line no-console
          console.error('[API ERROR] GET /templates?template=simple', err)
        }
        return
      }
      // Complex
      try {
        const qs = await withTyping(getTemplate('complex'))
        logApi('GET /templates?template=complex', null, qs)
        setComplexQs(qs as Question[])
        setPhase('complex')
        setQIdx(0)
        await botSay('Great — let’s capture a few details for complex queries.', 350)
        if (Array.isArray(qs) && qs.length > 0) {
          await botSay(qs[0].question, 350)
          setTempChoices([]); setShowChips(true)
        }
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem loading the complex form.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] GET /templates?template=complex', err)
      }
      return
    }
  
    // ============ COMMON ============
    if (phase === 'common' && currQ) {
      setCommonAnswers(prev => [...prev, { q_id: currQ.id, ans: built }])
  
      const next = qIdx + 1
      if (commonQs && next < commonQs.length) {
        setQIdx(next)
        await withTyping(delay(350))
        presentQuestion(commonQs[next])
        return
      }
  
      // Submit common, then branch
      try {
        const payload = {
          template: 'common',
          answers: commonAnswers.concat([{ q_id: currQ.id, ans: built }]),
        }
        const res = await withTyping(submitAnswers(chatId!, payload))
        logApi(`POST /chats/${chatId}/answers`, payload, res)
        setPhase('branch')
        setQIdx(0)
        setTempChoices([])
        setShowChips(true)
        appendBot('Would you describe your query as Simple or Complex?')
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem saving your common answers.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /answers (common)', err)
      }
      return
    }
  
    // ============ SIMPLE ============
    if (phase === 'simple' && currQ) {
      setSimpleAnswers(prev => [...prev, { q_id: currQ.id, ans: built }])
  
      const next = qIdx + 1
      if (simpleQs && next < simpleQs.length) {
        setQIdx(next)
        await withTyping(delay(350))
        presentQuestion(simpleQs[next])
        return
      }
  
      // done with simple → POST, then finalize(simple) → show AI → escalate?
      try {
        const payload = {
          template: 'simple',
          answers: simpleAnswers.concat([{ q_id: currQ.id, ans: built }]),
        }
        const res = await withTyping(submitAnswers(chatId!, payload))
        logApi(`POST /chats/${chatId}/answers`, payload, res)
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem saving your simple answers.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /answers (simple)', err)
        return
      }
  
      try {
        setPhase('finalizing')
        const fin = await withTyping(finalize(chatId!, 'simple'))
        logApi(`POST /chats/${chatId}/finalize`, { expected: 'simple' }, fin)
        appendBot(fin.ai_response || 'Here’s our best guidance.')
  
        // Move into escalate prompt
        setPhase('simple_ai')
        setTempChoices([])
        setShowChips(true)
        await botSay('Was this helpful, or would you like to escalate to a human?', 500)
        setPhase('escalate_confirm')
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem finalizing your query.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /finalize (simple)', err)
      }
      return
    }
  
    // ============ ESCALATE CONFIRM (chips) ============
    if (phase === 'escalate_confirm') {
      if (built === 'Escalate') {
        setPhase('escalate_reason')
        await botSay('Please tell us briefly why you’d like to escalate.', 500)
      } else {
        await botSay('Glad that helped! You can close this page now.', 500)
        await botSay('You may close this page now.', 450) // final line
        setPhase('done')
      }
      return
    }
  
    // ============ ESCALATE REASON (freeform) ============
    if (phase === 'escalate_reason') {
      try {
        setPhase('escalating')
        const res = await withTyping(escalate(chatId!, String(built)))
        logApi('POST /escalations', { chat_id: chatId, reason: String(built) }, res)
        appendBot('Your query has been escalated to our team. We’ll reach out via email shortly.')
        await botSay('You may close this page now.', 450)
        setPhase('done')
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem escalating your query.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /escalations', err)
      }
      return
    }
  
    // ============ COMPLEX ============
    if (phase === 'complex' && currQ) {
      let newIds: string[] = []

      // Optional file uploads
      if (files.length && chatId) {
        try {
          // (debug) see what the user picked
          // eslint-disable-next-line no-console
          console.log('[Upload] Selected files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })))

          const uploaded = await withTyping(Promise.all(files.map(f => uploadFile(chatId, f))))
          // eslint-disable-next-line no-console
          console.log('[Upload] Response:', uploaded)

          newIds = uploaded.map(u => (u as any).fileId)

          // Merge NOW (local) so this tick sees the new IDs
          const merged = [...attachmentIds, ...newIds]
          setAttachmentIds(merged) // keep state in sync for future questions
        } catch (err) {
          appendBot('Some files failed to upload — you can try again later.')
          // eslint-disable-next-line no-console
          console.error('[API ERROR] POST /uploads', err)
        }
      }

      setComplexAnswers(prev => [...prev, { q_id: currQ.id, ans: built }])

      const next = qIdx + 1
      if (complexQs && next < complexQs.length) {
        setQIdx(next)
        await withTyping(delay(350))
        presentQuestion(complexQs[next])
        return
      }

      // Use the latest attachments for THIS submit:
      // if we uploaded this turn, include those; otherwise use current state.
      const attachmentsForSubmit = newIds.length ? [...attachmentIds, ...newIds] : attachmentIds

      // Submit complex, then finalize(complex)
      try {
        const payload = {
          template: 'complex',
          answers: complexAnswers.concat([{ q_id: currQ.id, ans: built }]),
          attachments: attachmentsForSubmit, // ✅ never empty due to async state
        }
        const res = await withTyping(submitAnswers(chatId!, payload))
        logApi(`POST /chats/${chatId}/answers`, payload, res)
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem saving your complex answers.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /answers (complex)', err)
        return
      }

      try {
        setPhase('finalizing')
        const fin = await withTyping(finalize(chatId!, 'complex'))
        logApi(`POST /chats/${chatId}/finalize`, { expected: 'complex' }, fin)
        appendBot('Thanks — your query has been routed to the Contracts team. They’ll follow up shortly.')
        await botSay('You may close this page now.', 450)
        setPhase('done')
      } catch (err) {
        setPhase('error')
        appendBot('Sorry, there was a problem finalizing your query.')
        // eslint-disable-next-line no-console
        console.error('[API ERROR] POST /finalize (complex)', err)
      }
      return
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, botTyping])

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-4xl flex-col">
          {/* Transcript */}
          <section className="flex-1 overflow-y-auto pt-6 pb-1 px-1 sm:px-2">
            <div className="mx-auto flex max-w-4xl flex-col gap-10 overflow-x-visible">
              {messages.map((m, i) => (
                <ChatBubble
                  key={`m-${i}`}
                  role={m.role}
                  text={m.text}
                  animate={m.role === 'bot'}           // animate bot messages only
                  typewriterSpeed={16}                 // tweak to taste (smaller = faster)
                  onChunk={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
                />
              ))}
              {botTyping && <TypingBubble />}

              {/* invisible anchor for autoscroll to bottom */}
              <div ref={endRef} />
            </div>
          </section>

          {/* Footer */}
          <footer className="sticky bottom-0 bg-transparent pt-3 pb-8">
            <div className="mx-auto max-w-3xl">
              {/* Chips: only for current question, and disappear immediately on submit */}
              {showChips && mode !== 'freeform' && options.length > 0 && (
                <div className="mb-3 flex justify-center">
                  <ChoiceGroup
                    mode={mode === 'single' ? 'single' : 'multi'}
                    options={options}
                    onChange={setTempChoices}
                  />
                </div>
              )}

              {/* Input: always mounted, locked unless freeform/Other or we're idle */}
              <div className="flex justify-center">
                <ChatInput
                  onSend={handleSend}
                  allowEmptySubmit={allowEmptySubmit}
                  requireText={requireText}
                  externalBusy={
                    botTyping ||
                    phase === 'finalizing' ||
                    (mode !== 'freeform' && !otherSelected)
                  }
                  showAttachButton={phase === 'complex'}
                  onFilesSelected={files => {
                    if (files?.length && process.env.NODE_ENV === 'development') {
                      // eslint-disable-next-line no-console
                      console.log('Selected files:', files)
                    }
                  }}
                />
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
