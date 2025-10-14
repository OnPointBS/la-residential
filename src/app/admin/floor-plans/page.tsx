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
  Filter,
  Home,
  FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatSquareFootage } from "@/lib/utils";
import { FloorPlanCardWithSlider } from "@/components/admin/floor-plan-card-with-slider";

// Helper component to handle file URL fetching
function FileWithUrl({ fileId, alt, fileType, ...props }: { fileId: any, alt: string, fileType: "image" | "pdf", [key: string]: any }) {
  const fileUrl = useQuery(api.files.getUrl, { storageId: fileId });
  
  if (!fileUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  if (fileType === "image") {
    return <Image src={fileUrl} alt={alt} {...props} />;
  } else {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full h-full text-blue-600 hover:text-blue-800 p-2">
        <FileText className="h-12 w-12 mb-2" />
        <span className="text-sm text-center truncate">{alt}.pdf</span>
      </a>
    );
  }
}

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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
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
        </div>

        {/* Floor Plans Cards */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Floor Plans ({filteredFloorPlans.length})
            </h2>
          </div>
          
          {filteredFloorPlans.length > 0 ? (
            <div className="p-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Floor Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specs
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFloorPlans.map((plan) => (
                      <tr key={plan._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {plan.imageId ? (
                            <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-200">
                              <FileWithUrl
                                fileId={plan.imageId}
                                alt={plan.name}
                                fileType="image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Home className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {plan.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {plan.slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatSquareFootage(plan.squareFootage)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {plan.bedrooms} bed • {plan.bathrooms} bath
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {plan.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/floor-plans/${plan.slug}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-900"
                              title="View on website"
                            >
                              <Download className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/admin/floor-plans/${plan._id}/edit`}
                              className="text-gray-600 hover:text-gray-900"
                              title="Edit floor plan"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete floor plan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 gap-4">
                {filteredFloorPlans.map((plan) => (
                  <FloorPlanCardWithSlider
                    key={plan._id}
                    floorPlan={plan}
                    onDelete={handleDelete}
                  />
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
