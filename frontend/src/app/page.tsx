'use client'

/**
 * @file Marketing landing page that assembles Navbar, hero content, CTA buttons, and decorative threads.
 * Serves as the public entry point into the chat workflow.
 */

import Link from 'next/link'
import Button from '@/components/Button'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Threads from '@/components/Threads'
import PlayfulBackground from '@/components/PlayfulBackground'

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden relative">
      <PlayfulBackground />

      <Navbar
        variant="transparent"
        actions={
          <div className="flex gap-3">
            <Link href="/chat">
              <Button>Start Chat</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        }
      />

      {/* background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#f0fdfa40,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_300px,#ffe4e640,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_800px,#e0f2fe40,transparent)]" />
      </div>

      {/* dynamic thread element */}
      <div className="absolute inset-0 -z-10">
        <Threads
          amplitude={0.6}
          distance={0.3}
          enableMouseInteraction={false}
          color={[0.2, 0.5, 0.8]}
        />
      </div>

      {/* Hero fills the remaining space without scrolling */}
      <div className="h-15" />
      <div className="flex-1 flex items-center justify-center">
        <Hero />
      </div>
    </main>
  )
}
