"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  ArrowLeft, 
  Save, 
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { BulkFloorPlanUpload } from "@/components/admin/bulk-floor-plan-upload";

export default function EditFloorPlanPage() {
  const router = useRouter();
  const params = useParams();
  const floorPlanId = params.id as Id<"floorPlans">;
  
  const updateFloorPlan = useMutation(api.floorPlans.update);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const floorPlan = useQuery(api.floorPlans.getById, { id: floorPlanId });
  const floorPlanImages = useQuery(api.floorPlanImages.getByFloorPlan, { floorPlanId });
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    squareFootage: 0,
    bedrooms: 0,
    bathrooms: 0,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load floor plan data when available
  useEffect(() => {
    if (floorPlan) {
      setFormData({
        name: floorPlan.name,
        slug: floorPlan.slug,
        description: floorPlan.description,
        squareFootage: floorPlan.squareFootage,
        bedrooms: floorPlan.bedrooms,
        bathrooms: floorPlan.bathrooms,
      });
    }
  }, [floorPlan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);

    try {
      let imageId: string | undefined;
      let pdfId: string | undefined;

      // Upload image if provided
      if (imageFile) {
        const imageUploadUrl = await generateUploadUrl();
        const imageResponse = await fetch(imageUploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        const { storageId: imageStorageId } = await imageResponse.json();
        imageId = imageStorageId;
      }

      // Upload PDF if provided
      if (pdfFile) {
        const pdfUploadUrl = await generateUploadUrl();
        const pdfResponse = await fetch(pdfUploadUrl, {
          method: "POST",
          headers: { "Content-Type": pdfFile.type },
          body: pdfFile,
        });
        const { storageId: pdfStorageId } = await pdfResponse.json();
        pdfId = pdfStorageId;
      }

      await updateFloorPlan({
        id: floorPlanId,
        ...formData,
        imageId: imageId as any,
        pdfId: pdfId as any,
      });
      
      router.push("/admin/floor-plans");
    } catch (error) {
      console.error("Error updating floor plan:", error);
      alert("Failed to update floor plan. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    setFormData(prev => ({
      ...prev,
      name,
      slug
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = '';
    }
  };

  if (!floorPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading floor plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin/floor-plans"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Floor Plans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Floor Plan</h1>
          <p className="text-gray-600 mt-2">Update floor plan: {floorPlan.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Plan Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="auto-generated from name"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version of the name</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the floor plan and its features..."
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-2">
                  Square Footage *
                </label>
                <input
                  type="number"
                  id="squareFootage"
                  name="squareFootage"
                  required
                  min="0"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2500"
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
                  required
                  min="0"
                  max="10"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3"
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
                  required
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2.5"
                />
              </div>
            </div>
          </div>

          {/* File Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <ImageIcon className="h-6 w-6 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Floor Plan Files</h2>
            </div>
            
            {/* Bulk Upload */}
            <BulkFloorPlanUpload
              floorPlanId={floorPlanId}
              existingFiles={(floorPlanImages || []).filter(img => img.imageId) as Array<{_id: Id<"floorPlanImages">, imageId: Id<"_storage">, altText: string, caption?: string, order: number, fileType: "image" | "pdf"}>}
              onFilesUpdated={() => {
                // The files will be refreshed automatically via Convex real-time updates
                console.log('Files updated successfully');
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/floor-plans"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Floor Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}