'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from "next/link"
import Button from "@/components/Button"
import { MessageSquare, BarChart2, Network } from 'lucide-react'

// Types for our analytics data
interface AnalyticsData {
  totalSubmissions: number
  simpleQueries: number
  complexReferrals: number
}

export default function AdminPage() {
  // Initialize state with placeholder data
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSubmissions: 0,
    simpleQueries: 0,
    complexReferrals: 0,
  })

  // Simulated data fetch - replace with actual API call later
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/analytics')
        // const data = await response.json()
        
        // Placeholder data for now
        const mockData = {
          totalSubmissions: 234,
          simpleQueries: 187,
          complexReferrals: 47
        }
        
        setAnalytics(mockData)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
    }

    fetchAnalytics()
  }, [])

  // Calculate percentages
  const simpleQueriesPercentage = Math.round((analytics.simpleQueries / analytics.totalSubmissions) * 100)
  const complexReferralsPercentage = Math.round((analytics.complexReferrals / analytics.totalSubmissions) * 100)

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
          <p className="font-light text-gray-500">
            Grants2Contract Analytics & Configuration
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Submissions */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-700 text-sm">Total Submissions</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.totalSubmissions}
            </p>
            <p className="text-xs text-green-600">All queries submitted</p>
          </div>

          {/* Simple Queries */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-700 text-sm">Simple Queries</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.simpleQueries}
            </p>
            <p className="text-xs text-green-600">{simpleQueriesPercentage}% of total submissions</p>
          </div>

          {/* Complex Referrals */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <Network className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-700 text-sm">Complex Referrals</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.complexReferrals}
            </p>
            <p className="text-xs text-green-600">{complexReferralsPercentage}% of total submissions</p>
          </div>
        </div>
      </main>
    </div>
  )
}
