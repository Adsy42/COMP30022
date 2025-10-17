'use client'

export default function TypingBubble({
  label = 'Support Assistant',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 text-xs text-left font-semibold text-slate-600">
        {label}
      </div>
      <div className="flex justify-start">
        <div className="rounded-2xl bg-[#F1F5F9] ring-1 ring-slate-200/80 px-5 py-2 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="typing-dot" />
            <span className="typing-dot delay-150" />
            <span className="typing-dot delay-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
