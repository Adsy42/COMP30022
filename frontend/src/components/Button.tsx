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
