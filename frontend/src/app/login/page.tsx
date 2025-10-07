'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Temporary solution until backend is implemented
      if (email === 'admin@grants2contracts.example' && password === 'password') {
        router.push('/admin')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <Link 
              href="/" 
              className="flex items-center gap-4 mb-10 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/logoipsum-401.svg"
                alt="Grants2Contract"
                width={60}
                height={60}
                priority
                className="h-auto"
              />
              <span className="text-5xl font-bold text-blue-900">
                Grants2Contract
              </span>
            </Link>
            <h1 className="text-3xl font- text-blue-900 mb-5">
              Administrator Sign In
            </h1>
            <p className="mt-2 text-base text-gray-500 text-center">
              Access configuration, workflows, and referral management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm"
                placeholder="admin@grants2contracts.example"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 text-white bg-blue-900 rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
  )
}