"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  ArrowLeft, 
  Save, 
  X
} from "lucide-react";
import Link from "next/link";

export default function NewHomePage() {
  const router = useRouter();
  const createHome = useMutation(api.homes.create);
  const floorPlans = useQuery(api.floorPlans.getAll);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    squareFootage: 0,
    bedrooms: 0,
    bathrooms: 0,
    lotSize: "",
    address: "",
    status: "available" as const,
    floorPlanId: "",
    features: [] as string[],
    isFeatured: false,
  });
  
  const [newFeature, setNewFeature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "squareFootage" || name === "bedrooms" || name === "bathrooms" 
        ? Number(value) 
        : value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const homeData = {
        ...formData,
        slug,
        floorPlanId: formData.floorPlanId ? (formData.floorPlanId as Id<"floorPlans">) : undefined,
      };

      await createHome(homeData);
      router.push("/admin/homes");
    } catch (err: any) {
      setError(err.message || "Failed to create home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/homes"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Homes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Home</h1>
          <p className="text-gray-600 mt-2">
            Create a new home listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Home Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Modern Family Home"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="auto-generated from name"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the home and its features..."
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Main St, Charlotte, NC"
                />
              </div>

              <div>
                <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Size *
                </label>
                <input
                  type="text"
                  id="lotSize"
                  name="lotSize"
                  value={formData.lotSize}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 0.25 acres"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500000"
                />
              </div>

              <div>
                <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage *
                </label>
                <input
                  type="number"
                  id="squareFootage"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2500"
                />
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>

              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
            </div>
          </div>

          {/* Status and Floor Plan */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Status & Floor Plan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="sold">Sold</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>

              <div>
                <label htmlFor="floorPlanId" className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Plan
                </label>
                <select
                  id="floorPlanId"
                  name="floorPlanId"
                  value={formData.floorPlanId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a floor plan (optional)</option>
                  {floorPlans?.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} ({plan.squareFootage} sq ft)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Featured Toggle */}
            <div className="mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Featured Home (will appear on homepage)
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Check this box to feature this home on the homepage's "Featured Homes" section.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Features</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a feature (e.g., Granite Countertops)"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>

              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/homes"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Home"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}