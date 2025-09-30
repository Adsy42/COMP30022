/**
 * Button — primary/outline action button
 * --------------------------------------
 * A styled wrapper around <button> that accepts standard button attributes.
 *
 * Props:
 * - variant?: 'primary' | 'outline' (default: 'primary')
 *     Visual style. 'primary' = filled; 'outline' = bordered.
 *
 * - asChild?: boolean
 *     Reserved for future slotting with other primitives (currently not used).
 *
 * - ...HTMLButtonAttributes
 *     All native <button> props/events (onClick, disabled, type, etc.).
 *
 * Behavior & UX:
 * - Subtle press animation (active: scale .98).
 * - Focus ring for keyboard accessibility.
 * - Inherits disabled state from native props.
 *
 * Styling:
 * - Tailwind utility classes; consistent padding, radius, and typography.
 * - Primary: dark blue background with hover/focus states.
 * - Outline: blue border/text with gentle hover fill.
 *
 * Examples:
 *   <Button onClick={save}>Save</Button>
 *   <Button variant="outline" type="button">Cancel</Button>
 *   <Button disabled aria-busy>Submitting…</Button>
 */

import * as React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean // ignore for now; handy later?
  variant?: 'primary' | 'outline'
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: Props) {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles =
    variant === 'primary'
      ? 'bg-[#173761] text-white hover:bg-[#123154] focus:ring-[#173761]'
      : 'border border-[#173761] text-[#173761] hover:bg-[#edf2fb] focus:ring-[#173761]'
  return <button className={`${base} ${styles} ${className}`} {...props} />
}
