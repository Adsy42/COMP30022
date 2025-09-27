import Link from 'next/link'
import Image from 'next/image'
import * as React from 'react'

type Props = {
  actions?: React.ReactNode // right-side optional properties (page-specific and optional)
}

export default function Navbar({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50">
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
