#!/usr/bin/env node
/**
 * Debug script to check what API URL the frontend is using
 * Run this in Railway logs or locally to see the configuration
 */

console.log('='.repeat(60))
console.log('FRONTEND CONFIGURATION CHECK')
console.log('='.repeat(60))
console.log('')
console.log('Build-time environment variables:')
console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || '❌ NOT SET')
console.log('  NEXT_PUBLIC_AI_SERVICE_URL:', process.env.NEXT_PUBLIC_AI_SERVICE_URL || '❌ NOT SET')
console.log('')
console.log('NODE_ENV:', process.env.NODE_ENV || 'development')
console.log('')

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.log('⚠️  WARNING: NEXT_PUBLIC_API_URL is not set!')
  console.log('   Frontend will default to: http://localhost:5001')
  console.log('   This will NOT work in production!')
  console.log('')
  console.log('   FIX: Set NEXT_PUBLIC_API_URL in Railway and REDEPLOY')
  console.log('')
}

if (!process.env.NEXT_PUBLIC_AI_SERVICE_URL) {
  console.log('⚠️  WARNING: NEXT_PUBLIC_AI_SERVICE_URL is not set!')
  console.log('')
}

console.log('='.repeat(60))

