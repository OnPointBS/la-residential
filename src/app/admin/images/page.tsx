"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Filter, Grid, List } from "lucide-react";
import { ImageUpload } from "@/components/admin/image-upload";
import { ImageGrid } from "@/components/admin/image-grid";

export default function AdminImagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const images = useQuery(api.images.search, {
    searchTerm: searchTerm || undefined,
    category: category || undefined,
  });

  const handleImagesUpdated = () => {
    // This will trigger a re-render of the images list
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Image Management</h1>
              <p className="text-gray-600 mt-2">
                Upload and organize property images
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                <option value="hero">Hero Images</option>
                <option value="gallery">Gallery</option>
                <option value="logo">Logo</option>
                <option value="floor-plan">Floor Plans</option>
                <option value="exterior">Exterior</option>
                <option value="interior">Interior</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-end">
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h2>
          <ImageUpload 
            onUploadComplete={handleImagesUpdated}
            multiple={true}
            maxFiles={10}
            maxFileSize={10}
          />
        </div>

        {/* Images Display */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                All Images ({images?.length || 0})
              </h2>
              {images && images.length > 0 && (
                <div className="text-sm text-gray-500">
                  {images.length} image{images.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {images && images.length > 0 ? (
              <ImageGrid 
                images={images} 
                onImagesUpdated={handleImagesUpdated}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || category ? "No images found" : "No images uploaded yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || category 
                    ? "Try adjusting your search criteria or filters."
                    : "Upload your first images to get started."
                  }
                </p>
                {!searchTerm && !category && (
                  <p className="text-sm text-gray-500">
                    Use the upload section above to add images to your library.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
