'use client'

type Role = 'user' | 'bot'

type Props = {
  role: Role
  text: string
  className?: string
  bubbleClassName?: string
  showLabel?: boolean
}

export default function ChatBubble({
  role,
  text,
  className = '',
  bubbleClassName = '',
  showLabel = true,
}: Props) {
  const isUser = role === 'user'
  const label = isUser ? 'You' : 'Support Assistant'

  // role-specific styles
  const bubbleTone = isUser
    ? 'bg-[#EAF2FC] text-[#033F85] ring-1 ring-[#D6E8FF]'
    : 'bg-[#F1F5F9] text-[#033F85] ring-1 ring-slate-200/80'

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`mb-2 text-xs ${isUser ? 'text-right' : 'text-left'} text-slate-600 font-semibold`}>
          {label ?? (isUser ? 'You' : 'Support Assistant')}
        </div>
      )}

      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={[
            // width & wrapping
            'max-w-[75%] whitespace-pre-wrap break-words text-base leading-6',
            // pill shape + a bit more horizontal padding (was px-4)
            'rounded-2xl px-5 py-2 shadow-sm',
            bubbleTone,
            bubbleClassName,
          ].join(' ')}
        >
          {text}
        </div>
      </div>
    </div>
  )
}
