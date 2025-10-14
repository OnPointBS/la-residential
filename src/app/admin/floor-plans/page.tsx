"use client";


import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import { formatSquareFootage } from "@/lib/utils";

export default function AdminFloorPlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const floorPlans = useQuery(api.floorPlans.getAll);
  const deleteFloorPlan = useMutation(api.floorPlans.remove);



  // Filter floor plans
  const filteredFloorPlans = floorPlans?.filter((plan) => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this floor plan? This action cannot be undone.")) {
      try {
        await deleteFloorPlan({ id: id as any });
      } catch (error) {
        console.error("Error deleting floor plan:", error);
        alert("Failed to delete floor plan. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Floor Plans Management</h1>
              <p className="text-gray-600 mt-2">
                Manage your floor plan library
              </p>
            </div>
            <Link
              href="/admin/floor-plans/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Floor Plan
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search floor plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Floor Plans Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Floor Plans ({filteredFloorPlans.length})
            </h2>
          </div>
          
          {filteredFloorPlans.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFloorPlans.map((plan) => (
                  <div key={plan._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {plan.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/admin/floor-plans/${plan._id}/edit`}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit floor plan"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete floor plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div>{formatSquareFootage(plan.squareFootage)}</div>
                      <div>{plan.bedrooms} bed • {plan.bathrooms} bath</div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/floor-plans/${plan.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View on Website
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No floor plans found
              </h3>
              <p className="text-gray-600 mb-6">
                {floorPlans?.length === 0 
                  ? "Get started by adding your first floor plan."
                  : "Try adjusting your search criteria."
                }
              </p>
              {floorPlans?.length === 0 && (
                <Link
                  href="/admin/floor-plans/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Floor Plan
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
