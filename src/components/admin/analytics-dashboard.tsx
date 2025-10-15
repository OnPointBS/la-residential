"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Home,
  FileText,
} from "lucide-react";

interface DateRange {
  startDate: number;
  endDate: number;
}

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    endDate: Date.now(),
  });

  const [selectedView, setSelectedView] = useState<'overview' | 'homes' | 'floor-plans' | 'traffic'>('overview');

  // Fetch analytics data
  const pageViewStats = useQuery(api.analytics.getPageViewStats, dateRange);
  const dailyAnalytics = useQuery(api.analytics.getDailyAnalytics, dateRange);
  const trafficSources = useQuery(api.analytics.getTrafficSources, dateRange);
  const homesWithAnalytics = useQuery(api.analytics.getHomesWithAnalytics, dateRange);
  const floorPlansWithAnalytics = useQuery(api.analytics.getFloorPlansWithAnalytics, dateRange);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (!pageViewStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Track your website performance and visitor behavior
              </p>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={formatDate(dateRange.startDate).split('/').reverse().join('-')}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: new Date(e.target.value).getTime()
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={formatDate(dateRange.endDate).split('/').reverse().join('-')}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: new Date(e.target.value).getTime()
                }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'homes', label: 'Homes Analytics', icon: Home },
              { id: 'floor-plans', label: 'Floor Plans', icon: FileText },
              { id: 'traffic', label: 'Traffic Sources', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedView === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedView === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(pageViewStats.totalPageViews)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatNumber(pageViewStats.uniqueVisitors)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Top Page Type</p>
                    <p className="text-lg font-bold text-gray-900">
                      {pageViewStats.pageTypeStats[0]?.pageType || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {pageViewStats.pageTypeStats[0]?.totalViews || 0} views
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Date Range</p>
                    <p className="text-sm font-bold text-gray-900">
                      {Math.ceil((dateRange.endDate - dateRange.startDate) / (24 * 60 * 60 * 1000))} days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Type Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Views by Type</h3>
                <div className="space-y-3">
                  {pageViewStats.pageTypeStats.map((stat) => (
                    <div key={stat.pageType} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {stat.pageType.replace('-', ' ')}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{stat.uniqueViews} unique</span>
                        <span className="text-sm font-semibold text-gray-900">{stat.totalViews}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
                <div className="space-y-3">
                  {pageViewStats.topPages.slice(0, 10).map((page) => (
                    <div key={page.pagePath} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {page.pageTitle}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{page.pagePath}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm text-gray-500">{page.uniqueViews}</span>
                        <span className="text-sm font-semibold text-gray-900">{page.totalViews}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Homes Analytics Tab */}
        {selectedView === 'homes' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Home Analytics</h3>
              <p className="text-sm text-gray-600">View performance for each home listing</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Home
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unique Visitors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {homesWithAnalytics?.map((home) => (
                    <tr key={home._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{home.name}</div>
                          <div className="text-sm text-gray-500">{home.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          home.status === 'available' ? 'bg-green-100 text-green-800' :
                          home.status === 'sold' ? 'bg-red-100 text-red-800' :
                          home.status === 'under-construction' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {home.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(home.totalViews)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(home.uniqueVisitors)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${home.price?.toLocaleString() || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Floor Plans Analytics Tab */}
        {selectedView === 'floor-plans' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Floor Plan Analytics</h3>
              <p className="text-sm text-gray-600">View performance for each floor plan</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Floor Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Square Footage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bedrooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bathrooms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unique Visitors
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {floorPlansWithAnalytics?.map((floorPlan) => (
                    <tr key={floorPlan._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{floorPlan.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {floorPlan.squareFootage.toLocaleString()} sq ft
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {floorPlan.bedrooms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {floorPlan.bathrooms}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(floorPlan.totalViews)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(floorPlan.uniqueVisitors)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Traffic Sources Tab */}
        {selectedView === 'traffic' && trafficSources && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
              <div className="space-y-3">
                {trafficSources.referrerStats.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ExternalLink className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{source.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Types */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Types</h3>
              <div className="space-y-3">
                {trafficSources.deviceStats.map((device) => {
                  const Icon = device.device === 'desktop' ? Monitor : 
                              device.device === 'mobile' ? Smartphone : Tablet;
                  return (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700 capitalize">{device.device}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{device.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countries */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Countries</h3>
              <div className="space-y-3">
                {trafficSources.countryStats.slice(0, 10).map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{country.country}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{country.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browsers</h3>
              <div className="space-y-3">
                {trafficSources.browserStats.map((browser) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{browser.browser}</span>
                    <span className="text-sm font-semibold text-gray-900">{browser.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
