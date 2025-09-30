/**
 * ChoiceGroup Component
 * ---------------------
 * A horizontally scrollable group of selectable buttons (chips).
 * Supports single-select (radio-like) or multi-select (checkbox-like) modes.
 *
 * Props:
 * - mode: 'single' | 'multi'
 *   Selection behavior. Defaults to 'single'.
 *
 * - options: string[]
 *   List of option labels to render as buttons.
 *
 * - className?: string
 *   Optional extra classes for container.
 *
 * - onChange?: (selected: string[]) => void
 *   Callback fired whenever the selection changes. Receives the full selected list.
 *
 * Behavior:
 * - Maintains selection state internally, but emits changes via onChange.
 * - `single` mode replaces current selection with the clicked option.
 * - `multi` mode toggles clicked option on/off.
 * - Uses WAI-ARIA roles (`radiogroup`/`group`, `radio`/`checkbox`) for accessibility.
 * - Styling: selected = blue, unselected = gray with hover/active states.
 */

import * as React from 'react'

type Mode = 'single' | 'multi'

export default function ChoiceGroup({
  mode = 'single',
  options,
  className = '',
  onChange,
}: {
  mode: Mode
  options: string[]
  className?: string
  onChange?: (selected: string[]) => void
}) {
  // For now, keep selection internal. (Step 2 can expose it via onChange.)
  const [selected, setSelected] = React.useState<string[]>([])
  const isSelected = (o: string) => selected.includes(o)

  const toggle = (o: string) => {
    if (mode === 'single') {
      setSelected([o])
    } else {
      setSelected(prev =>
        prev.includes(o) ? prev.filter(v => v !== o) : [...prev, o]
      )
    }
  }

  React.useEffect(() => {
    if (onChange) onChange(selected)
  }, [selected, onChange])

  const groupRole = mode === 'single' ? 'radiogroup' : 'group'
  const itemRole = mode === 'single' ? 'radio' : 'checkbox'

  return (
    <div className={`w-full ${className}`} role={groupRole}>
      <div className="overflow-x-auto overflow-y-visible chips-scroll py-1">
        <div className="flex gap-3 w-max mx-auto px-2">
          {options.map(o => {
            const on = isSelected(o)
            return (
              <button
                key={o}
                role={itemRole}
                aria-checked={on}
                onClick={() => toggle(o)}
                className={[
                  'rounded-full px-4 py-1.5 text-sm font-medium',
                  'text-white transition border border-transparent',
                  'active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-blue-600',
                  on ? 'bg-blue-600' : 'bg-gray-400 hover:bg-gray-500',
                ].join(' ')}
              >
                {o}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
