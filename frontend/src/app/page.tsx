import Link from 'next/link'
import Button from '@/components/Button'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
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
      <div className="flex-1 flex items-center justify-center">
        <Hero />
      </div>
    </main>
  )
}
