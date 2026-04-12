/**
 * Analytics Dashboard Page
 * Admin-only dashboard to view site analytics and user metrics
 * Shows data from Google Analytics 4
 */

import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePageMeta } from '../../hooks/usePageMeta'
import { trackPageView } from '../../lib/analytics'
import { BarChart3, Users, Eye, Clock, TrendingUp, TrendingDown } from 'lucide-react'

// Main metrics cards
const MetricCard = ({ label, value, trend, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  }

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}
            >
              {trend.positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{trend.value}% vs last period</span>
            </div>
          )}
        </div>
        <Icon size={24} className="opacity-50" />
      </div>
    </div>
  )
}

// Chart placeholder
const ChartPlaceholder = ({ title, description }) => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
      <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-xs text-gray-500 mt-4">
        Connect to Google Analytics 4 API for real data visualization
      </p>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    newUsers: 0,
    sessions: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
  })

  // Update page meta for SEO
  usePageMeta(
    'Analytics Dashboard - AlgoView',
    'View detailed analytics and user metrics for AlgoView platform',
    'analytics, dashboard, metrics, statistics'
  )

  useEffect(() => {
    // Track page view
    trackPageView('/analytics', 'Analytics Dashboard')

    // Check if user is admin (for now just a placeholder)
    // In future, fetch from Firebase user claims
    if (user) {
      setIsAdmin(user.email?.endsWith('@algovieww.me') || false)
    }

    // Fetch analytics data from GA4 API (implement later)
    // For now, using mock data
    setMetrics({
      totalUsers: 1243,
      newUsers: 187,
      sessions: 3456,
      pageViews: 12847,
      avgSessionDuration: 4.2,
      bounceRate: 32.5,
    })
  }, [user])

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">This dashboard is only accessible to administrators.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track user engagement, traffic patterns, and platform performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <MetricCard
            label="Total Users"
            value={metrics.totalUsers.toLocaleString()}
            trend={{ positive: true, value: 24 }}
            icon={Users}
            color="blue"
          />
          <MetricCard
            label="New Users"
            value={metrics.newUsers}
            trend={{ positive: true, value: 18 }}
            icon={Users}
            color="green"
          />
          <MetricCard
            label="Sessions"
            value={metrics.sessions.toLocaleString()}
            trend={{ positive: true, value: 34 }}
            icon={BarChart3}
            color="purple"
          />
          <MetricCard
            label="Page Views"
            value={metrics.pageViews.toLocaleString()}
            trend={{ positive: true, value: 42 }}
            icon={Eye}
            color="orange"
          />
          <MetricCard
            label="Avg Session Duration"
            value={`${metrics.avgSessionDuration}m`}
            trend={{ positive: false, value: 5 }}
            icon={Clock}
            color="blue"
          />
          <MetricCard
            label="Bounce Rate"
            value={`${metrics.bounceRate}%`}
            trend={{ positive: false, value: 8 }}
            icon={TrendingDown}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <ChartPlaceholder
            title="Pageviews Over Time"
            description="Track traffic trends and identify peak usage periods"
          />
          <ChartPlaceholder
            title="Top Pages"
            description="See which pages are most popular with your visitors"
          />
          <ChartPlaceholder
            title="Traffic Sources"
            description="Understand where your traffic is coming from"
          />
          <ChartPlaceholder
            title="User Demographics"
            description="View visitor location and device information"
          />
        </div>

        {/* Event Tracking Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tracked Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800">Algorithm Visualizations</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Users viewing algorithm animations</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800">Code Copies</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Code examples copied by users</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800">Premium Upgrades</p>
              <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Users upgrading to premium</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-800">Ad Clicks</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Total ad interactions</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Setting up Google Analytics 4</h3>
          <p className="text-blue-800 text-sm mb-4">To see real analytics data, you need to:</p>
          <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
            <li>Create a GA4 property in Google Analytics</li>
            <li>Get your Measurement ID (starts with G-)</li>
            <li>Add it to your .env file as VITE_GA4_MEASUREMENT_ID</li>
            <li>Setup GA4 Reporting API credentials</li>
            <li>Connect the API to fetch real-time data</li>
          </ol>
          <p className="text-blue-700 text-xs mt-4">
            📚{' '}
            <a
              href="https://developers.google.com/analytics/devguides/reporting/data/v1"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Analytics 4 Reporting API Docs
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
