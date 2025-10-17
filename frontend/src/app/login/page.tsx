'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BackgroundIllustration } from '@/components/BackgroundIllustration'

/**
 * Expected API Response types
 * POST /api/auth/login
 *
 * Request Body:
 * {
 *   username: string;
 *   password: string;
 * }
 *
 * Responses:
 * 200 OK:
 * {
 *   success: true;
 *   token: string;    // JWT token for authentication
 * }
 *
 * 401 Unauthorized:
 * {
 *   success: false;
 *   error: string;
 * }
 */
interface LoginResponse {
  success: boolean
  token?: string
  error?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Temporary solution until backend is implemented
      if (
        email === 'admin@grants2contracts.example' &&
        password === 'password'
      ) {
        router.push('/admin')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (err) {
      setError('Invalid email or password')
      // Shake animation for error
      const form = document.querySelector('form')
      form?.classList.add('animate-shake')
      setTimeout(() => form?.classList.remove('animate-shake'), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-white transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background Layer */}
      <BackgroundIllustration />

      {/* Foreground Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div
          className={`max-w-md w-full space-y-8 transition-transform duration-300 ${loading ? 'scale-98' : 'scale-100'}`}
        >
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
                priority={true} // Explicitly set as boolean
                className="h-auto"
              />
              <span className="text-5xl font-bold text-blue-900">
                Grants2Contract
              </span>
            </Link>
            <h1 className="text-3xl font-semibold text-blue-900 mb-5">
              Administrator Sign In
            </h1>
            <p className="mt-2 text-base text-gray-500 text-center">
              Access configuration, workflows, and referral management.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded animate-fadeIn">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@grants2contracts.example"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                disabled={loading}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 transition-colors duration-200"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 text-white bg-blue-900 rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 transform active:scale-98"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
