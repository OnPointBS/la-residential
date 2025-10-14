"use client";


import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatSquareFootage } from "@/lib/utils";
import { HOME_STATUSES } from "@/lib/constants";

export default function AdminHomesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const homes = useQuery(api.homes.getAll);
  const deleteHome = useMutation(api.homes.remove);



  // Filter homes
  const filteredHomes = homes?.filter((home) => {
    const matchesSearch = 
      home.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || home.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this home? This action cannot be undone.")) {
      try {
        await deleteHome({ id: id as any });
      } catch (error) {
        console.error("Error deleting home:", error);
        alert("Failed to delete home. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Homes Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your home listings and properties
              </p>
            </div>
            <Link
              href="/admin/homes/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Home
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search homes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Statuses</option>
                {HOME_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Homes Cards */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Homes ({filteredHomes.length})
            </h2>
          </div>
          
          {filteredHomes.length > 0 ? (
            <div className="p-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Home
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHomes.map((home) => {
                      const statusConfig = HOME_STATUSES.find(s => s.value === home.status);
                      return (
                        <tr key={home._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {home.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {home.slug}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {home.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatSquareFootage(home.squareFootage)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {home.bedrooms} bed • {home.bathrooms} bath
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {home.price ? formatPrice(home.price) : "TBD"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {statusConfig && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color} text-white`}>
                                {statusConfig.label}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/homes/${home.slug}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-900"
                                title="View on website"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                href={`/admin/homes/${home._id}/edit`}
                                className="text-gray-600 hover:text-gray-900"
                                title="Edit home"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(home._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete home"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredHomes.map((home) => {
                  const statusConfig = HOME_STATUSES.find(s => s.value === home.status);
                  return (
                    <div key={home._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {home.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {home.slug}
                          </p>
                          {statusConfig && (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color} text-white`}>
                              {statusConfig.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-20 text-gray-500">Address:</span>
                          <span className="flex-1">{home.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-20 text-gray-500">Size:</span>
                          <span className="flex-1">{formatSquareFootage(home.squareFootage)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-20 text-gray-500">Rooms:</span>
                          <span className="flex-1">{home.bedrooms} bed • {home.bathrooms} bath</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-20 text-gray-500">Price:</span>
                          <span className="flex-1 font-medium text-gray-900">
                            {home.price ? formatPrice(home.price) : "TBD"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                        <Link
                          href={`/homes/${home.slug}`}
                          target="_blank"
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <Link
                          href={`/admin/homes/${home._id}/edit`}
                          className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(home._id)}
                          className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No homes found
              </h3>
              <p className="text-gray-600 mb-6">
                {homes?.length === 0 
                  ? "Get started by adding your first home listing."
                  : "Try adjusting your search criteria or filters."
                }
              </p>
              {homes?.length === 0 && (
                <Link
                  href="/admin/homes/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Home
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
