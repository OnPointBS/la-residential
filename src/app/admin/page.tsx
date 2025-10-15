"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Home, 
  FileText, 
  Mail, 
  Eye,
  TrendingUp,
  Clock,
  DollarSign,
  Settings
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const homes = useQuery(api.homes.getAll);
  const floorPlans = useQuery(api.floorPlans.getAll);
  const inquiries = useQuery(api.inquiries.getAll);
  const unreadInquiries = useQuery(api.inquiries.getUnread);
  
  // Get analytics data for the last 7 days
  const analyticsData = useQuery(api.analytics.getPageViewStats, {
    startDate: Date.now() - 7 * 24 * 60 * 60 * 1000,
    endDate: Date.now(),
  });

  const availableHomes = homes?.filter(home => home.status === "available") || [];
  const recentInquiries = inquiries?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to LA Residential Admin
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your business today.
          </p>
        </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Homes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {homes?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Homes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {availableHomes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Floor Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {floorPlans?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unreadInquiries?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views (7d)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.totalPageViews?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Inquiries
                </h2>
                <Link
                  href="/admin/inquiries"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {inquiry.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {inquiry.email}
                          </p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {inquiry.message}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(inquiry.createdAt)}
                          </div>
                          {!inquiry.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 ml-auto"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No inquiries yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link
                  href="/admin/homes"
                  className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Home className="h-6 w-6 text-blue-600 mr-4" />
                  <div>
                    <p className="font-medium text-blue-900">Manage Homes</p>
                    <p className="text-sm text-blue-700">Add or edit home listings</p>
                  </div>
                </Link>

                <Link
                  href="/admin/floor-plans"
                  className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <FileText className="h-6 w-6 text-purple-600 mr-4" />
                  <div>
                    <p className="font-medium text-purple-900">Manage Floor Plans</p>
                    <p className="text-sm text-purple-700">Upload and organize floor plans</p>
                  </div>
                </Link>

                <Link
                  href="/admin/analytics"
                  className="flex items-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                  <TrendingUp className="h-6 w-6 text-indigo-600 mr-4" />
                  <div>
                    <p className="font-medium text-indigo-900">View Analytics</p>
                    <p className="text-sm text-indigo-700">Track website performance and visitors</p>
                  </div>
                </Link>

                <Link
                  href="/admin/inquiries"
                  className="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Mail className="h-6 w-6 text-green-600 mr-4" />
                  <div>
                    <p className="font-medium text-green-900">View Inquiries</p>
                    <p className="text-sm text-green-700">Check customer inquiries and leads</p>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="h-6 w-6 text-gray-600 mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-sm text-gray-700">Update company information</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* View Public Site */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
