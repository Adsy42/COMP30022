/**
 * Navbar — sticky top navigation bar
 * ----------------------------------
 * Presents a branded left section (logo + title) and a right-aligned actions slot.
 *
 * Props:
 * - actions?: React.ReactNode
 *     Optional right-side content (e.g., buttons, user menu, links).
 *
 * Accessibility & UX:
 * - Uses <header> + <nav> landmarks for semantics.
 * - Sticks to top with subtle border/shadow separation.
 * - Brand link routes to "/" via Next.js <Link>.
 *
 * Styling:
 * - Tailwind classes for layout, spacing, and borders.
 * - Responsive gap on the actions container (sm:gap-3).
 *
 * Example:
 *   <Navbar
 *     actions={
 *       <>
 *         <Button variant="outline">Docs</Button>
 *         <Button>Sign in</Button>
 *       </>
 *     }
 *   />
 */

import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'

type Props = {
  actions?: React.ReactNode // right-side optional properties (page-specific and optional)
}

export default function Navbar({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex w-full max-w-screen-3xl items-center justify-between px-6 py-3">
        {/* left side */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logoipsum-401.svg"
            alt="Grants2Contract logo"
            width={32}
            height={32}
            priority
          />

          <span className="text-lg font-semibold tracking-tight text-[#033F85]">
            Grants2Contract
          </span>
        </Link>

        {/* right side */}
        <div className="flex items-center gap-2 sm:gap-3">{actions}</div>
      </nav>
    </header>
  )
}
