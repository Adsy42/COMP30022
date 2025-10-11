'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from "next/link"
import Button from "@/components/Button"
import { MessageSquare, BarChart2, Network, Settings, Mail } from 'lucide-react'

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
          <p className="text-gray-500">
            Grants2Contract Analytics & Configuration
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Submissions */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-5 h-5 text-blue-900" />
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
              <BarChart2 className="w-5 h-5 text-blue-900" />
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
              <Network className="w-5 h-5 text-blue-900" />
              <h2 className="font-semibold text-gray-700 text-sm">Complex Referrals</h2>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {analytics.complexReferrals}
            </p>
            <p className="text-xs text-green-600">{complexReferralsPercentage}% of total submissions</p>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          {/* Simple Queries Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex gap-2 mb-2">
              <BarChart2 className="w-5 h-5 text-blue-900" />
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-gray-900">Simple Queries Breakdown</h2>
                <p className="text-sm text-gray-500">
                  Detailed analysis of simple query submissions
                </p>
              </div>
            </div>
          </div>

          {/* Complex Queries Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex gap-2 mb-2">
              <Network className="w-5 h-5 text-blue-900" />
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-gray-900">Complex Queries Breakdown</h2>
                <p className="text-sm text-gray-500">
                  Detailed analysis of complex query submissions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Configuration */}
            <Link href="/admin/form-config">
              <div className="group p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-3">
                    <Settings className="w-6 h-6 text-blue-900" />
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold text-gray-900">Form Configuration</h3>
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
                      <h3 className="font-semibold text-gray-900">Email Configuration</h3>
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
      </main>
    </div>
  )
}
