'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { ErrorAlert } from '@/components/ErrorAlert'
import { fetchEmailConfig, updateEmailConfig } from '@/lib/api'

// Interface defining the shape of email configuration data from the API
interface EmailConfig {
  email_address: string // Email address where notifications will be sent
}

export default function EmailConfigPage() {
  // State management for email configuration
  const [email, setEmail] = useState('admin@university.edu.au') // Current email address
  const [isSaving, setIsSaving] = useState(false) // Controls edit mode
  const [isLoading, setIsLoading] = useState(true) // Loading state for initial fetch
  const [error, setError] = useState<string | null>(null) // Error handling state
  const [actionError, setActionError] = useState<string | null>(null)

  // Fetch initial email configuration from backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Get token from localStorage
        const token = localStorage.getItem('token')
        
        if (!token) {
          setError('Authentication required. Please log in again.')
          setIsLoading(false)
          return
        }
        
        // Fetch from real backend API
        const data = await fetchEmailConfig(token)
        setEmail(data.email_address)
        setIsLoading(false)
      } catch (err) {
        console.error('Email config fetch error:', err)
        setError('Failed to load email configuration. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  // Navigation component with back button
  const navActions = (
    <Link
      href="/admin"
      className="inline-flex items-center text-sm text-blue-900 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Dashboard
    </Link>
  )

  // Handle form submission to update email configuration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setActionError(null)
      setIsSaving(true)

      // Email validation
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address')
      }

      // Get token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('Authentication required. Please log in again.')
      }
      
      // Call backend API to update email recipient
      await updateEmailConfig(email, token)

      setActionError(null)
      setIsSaving(false)
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Failed to save email configuration'
      )
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar actions={navActions} />

      {/* Main content container */}
      <main className="container mx-auto px-4 py-8">
        {/* Page header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-blue-900 mb-2">
            Email Configuration
          </h1>
          <p className="text-gray-500 mt-1">Manage recipient email address</p>
        </div>

        {/* Error Alerts */}
        {error && (
          <ErrorAlert
            message={error}
            variant="error"
            title="Loading Error"
            onDismiss={() => setError(null)}
          />
        )}

        {actionError && (
          <ErrorAlert
            message={actionError}
            variant="warning"
            title="Save Error"
            onDismiss={() => setActionError(null)}
          />
        )}

        {/* Navigation tabs */}
        <div className="bg-gray-100 rounded-full p-1 flex mb-8 w-full">
          {/* Form configuration tab */}
          <Link
            href="/admin/form-config"
            className="flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 font-medium"
          >
            <svg
              className="w-5 h-5 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Form Configuration
          </Link>
          {/* Email configuration tab (active) */}
          <Link
            href="/admin/email-config"
            className="flex-1 px-4 py-2 rounded-full flex items-center justify-center gap-2 bg-white shadow-sm font-medium"
          >
            <svg
              className="w-5 h-5 text-blue-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Configuration
          </Link>
        </div>

        {/* Email configuration form card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-6">
            Recipient Email Configuration
          </h2>

          {/* Conditional rendering based on loading and error states */}
          {isLoading ? (
            <div className="py-8">
              <div className="flex justify-center">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"
                  role="progressbar"
                />
              </div>
              <p className="text-center text-gray-500 mt-4">
                Loading email configuration...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                {/* Email input field */}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notification Recipient Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    aria-label="Notification Recipient Email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      setActionError(null)
                    }}
                    className={`w-full px-3 py-2 border ${
                      actionError ? 'border-red-300' : 'border-gray-200'
                    } rounded-lg ${!isSaving ? 'bg-gray-50' : 'bg-white'}`}
                    required
                    disabled={!isSaving}
                  />
                  <button
                    type="button"
                    aria-label="edit email"
                    onClick={() => setIsSaving(!isSaving)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100"
                  >
                    {isSaving ? (
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Save button - only shown when editing */}
                {actionError && (
                  <p
                    className="text-red-600 text-sm mt-2"
                    data-testid="email-error"
                  >
                    {actionError}
                  </p>
                )}
                {isSaving && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50"
                      disabled={!email.includes('@')}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
