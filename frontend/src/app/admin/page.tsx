'use client'

import { useEffect, useState } from 'react'
import { ErrorAlert } from '@/components/ErrorAlert'
import Navbar from '@/components/Navbar'
import { AnalyticsChart } from '@/components/AnalyticsChart'
import { AnalyticsData, fetchMockAnalytics } from './__mocks__/analytics'
import Link from "next/link"
import Button from "@/components/Button"
import { MessageSquare, Settings, Mail, PieChart, BarChart2, Network, Zap } from 'lucide-react'

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError(null)
        // === API CALL: Replace fetchMockAnalytics with real API call when backend is connected ===
        // Example:
        // const response = await fetch('/api/analytics')
        // const data = await response.json()
        // setAnalytics(data)
        const data = await fetchMockAnalytics()
        
        if (!data) {
          throw new Error('No analytics data available')
        }
        
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
        setError('Unable to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Calculate percentages
  const simpleQueriesPercentage = Math.round((analytics?.kpi.simple_queries! / analytics?.kpi.total_queries!) * 100)
  const aiResolvedPercentage = Math.round((analytics?.kpi.ai_resolved_queries! / analytics?.kpi.total_queries!) * 100)

  return (
    <div className="min-h-screen">
      <Navbar 
        actions={
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Log Out</Button>
            </Link>
          </div>
        }
      />
      <main className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-blue-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Grants2Contract Analytics & Configuration
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert
            message={error}
            variant="error"
            title="Loading Error"
            onDismiss={() => setError(null)}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          </div>
        ) : !analytics ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">No analytics data available</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-900" />
                  <h2 className="font-medium text-gray-700 text-sm">Total Queries</h2>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {analytics.kpi.total_queries}
                </p>
                <p className="text-xs text-green-600">All queries submitted</p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart2 className="w-5 h-5 text-blue-900" />
                  <h2 className="font-medium text-gray-700 text-sm">Simple Queries</h2>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {analytics.kpi.simple_queries}
                </p>
                <p className="text-xs text-green-600">{simpleQueriesPercentage}% of total queries</p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-blue-900" />
                  <h2 className="font-medium text-gray-700 text-sm">AI Resolved</h2>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {analytics.kpi.ai_resolved_queries}
                </p>
                <p className="text-xs text-green-600">{aiResolvedPercentage}% of total queries</p>
              </div>
            </div>

            {/* Questions Analytics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-8">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-gray-700" />
                <span className="font-medium text-gray-900">Questions Analytics</span>
              </div>
              
              <div className="h-[800px] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {analytics.questions.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{item.question}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <AnalyticsChart 
                        data={item.options}
                        type={item.type}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration Section */}
            <div className="mt-10 mb-20">
              <h2 className="text-2xl font-medium text-blue-900 mb-6">Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Configuration */}
                <Link href="/admin/form-config">
                  <div className="group p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-3">
                        <Settings className="w-6 h-6 text-blue-900" />
                        <div className="flex flex-col gap-1">
                          <h3 className="font-medium text-gray-900">Form Configuration</h3>
                          <p className="text-sm text-gray-500">Manage question flows (add/update/delete)</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="text-blue-900 group-hover:translate-x-1 transition-transform"
                        >
                          <path 
                            d="M5 12H19M19 12L12 5M19 12L12 19" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  
                  </div>
                </Link>

                {/* Email Configuration */}
                <Link href="/admin/email-config">
                  <div className="group p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-3">
                        <Mail className="w-6 h-6 text-blue-900" />
                        <div className="flex flex-col gap-1">
                          <h3 className="font-medium text-gray-900">Email Configuration</h3>
                          <p className="text-sm text-gray-500">Update recipient email addresses</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          className="text-blue-900 group-hover:translate-x-1 transition-transform"
                        >
                          <path 
                            d="M5 12H19M19 12L12 5M19 12L12 19" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
