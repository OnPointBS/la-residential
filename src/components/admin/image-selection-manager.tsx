"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Upload, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Square,
  Image as ImageIcon,
  FileText,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { BulkImageUpload } from "./bulk-image-upload";
import { BulkFloorPlanUpload } from "./bulk-floor-plan-upload";

// Helper component to handle image URL fetching
function ImageWithUrl({ imageId, alt, ...props }: { imageId: Id<"_storage">, alt: string, [key: string]: any }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId: imageId });
  
  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  return <Image src={imageUrl} alt={alt} {...props} />;
}

interface ImageSelectionManagerProps {
  type: "home" | "floorPlan";
  itemId: Id<"homes"> | Id<"floorPlans">;
  className?: string;
}

export function ImageSelectionManager({ type, itemId, className = "" }: ImageSelectionManagerProps) {
  const [showUpload, setShowUpload] = useState(false);

  // Get images based on type
  const homeImages = useQuery(
    api.homeImages.getByHome, 
    type === "home" ? { homeId: itemId as Id<"homes"> } : "skip"
  );
  const floorPlanImages = useQuery(
    api.floorPlanImages.getByFloorPlan, 
    type === "floorPlan" ? { floorPlanId: itemId as Id<"floorPlans"> } : "skip"
  );

  // Get mutations based on type
  const toggleHomeImageSelection = useMutation(api.homeImages.toggleSelection);
  const toggleFloorPlanImageSelection = useMutation(api.floorPlanImages.toggleSelection);
  const selectAllHomeImages = useMutation(api.homeImages.selectAll);
  const selectAllFloorPlanImages = useMutation(api.floorPlanImages.selectAll);
  const deselectAllHomeImages = useMutation(api.homeImages.deselectAll);
  const deselectAllFloorPlanImages = useMutation(api.floorPlanImages.deselectAll);
  const removeHomeImage = useMutation(api.homeImages.remove);
  const removeFloorPlanImage = useMutation(api.floorPlanImages.remove);

  const images = type === "home" ? homeImages : (type === "floorPlan" ? floorPlanImages : null);
  const selectedCount = images?.filter(img => img.isSelected).length || 0;
  const totalCount = images?.length || 0;

  const handleToggleSelection = async (imageId: Id<"homeImages"> | Id<"floorPlanImages">) => {
    try {
      if (type === "home") {
        await toggleHomeImageSelection({ id: imageId as Id<"homeImages"> });
      } else {
        await toggleFloorPlanImageSelection({ id: imageId as Id<"floorPlanImages"> });
      }
    } catch (error) {
      console.error("Error toggling image selection:", error);
    }
  };

  const handleSelectAll = async () => {
    try {
      if (type === "home") {
        await selectAllHomeImages({ homeId: itemId as Id<"homes"> });
      } else {
        await selectAllFloorPlanImages({ floorPlanId: itemId as Id<"floorPlans"> });
      }
    } catch (error) {
      console.error("Error selecting all images:", error);
    }
  };

  const handleDeselectAll = async () => {
    try {
      if (type === "home") {
        await deselectAllHomeImages({ homeId: itemId as Id<"homes"> });
      } else {
        await deselectAllFloorPlanImages({ floorPlanId: itemId as Id<"floorPlans"> });
      }
    } catch (error) {
      console.error("Error deselecting all images:", error);
    }
  };

  const handleDeleteImage = async (imageId: Id<"homeImages"> | Id<"floorPlanImages">) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return;
    }

    try {
      if (type === "home") {
        await removeHomeImage({ id: imageId as Id<"homeImages"> });
      } else {
        await removeFloorPlanImage({ id: imageId as Id<"floorPlanImages"> });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleImagesUploaded = () => {
    setShowUpload(false);
  };

  if (!images) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Image Gallery
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {selectedCount} of {totalCount} images selected for display
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {totalCount > 0 && (
            <>
              <button
                onClick={handleSelectAll}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50"
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <Square className="h-4 w-4 mr-1" />
                Deselect All
              </button>
            </>
          )}
          
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Add Images
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Images
                </h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {type === "home" ? (
                <BulkImageUpload
                  homeId={itemId as Id<"homes">}
                  onImagesUpdated={handleImagesUploaded}
                />
              ) : (
                <BulkFloorPlanUpload
                  floorPlanId={itemId as Id<"floorPlans">}
                  onFilesUpdated={handleImagesUploaded}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No images uploaded yet
          </h4>
          <p className="text-gray-600 mb-6">
            Upload images to create a gallery for this {type === "home" ? "home" : "floor plan"}.
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Upload Images
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image._id}
              className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                image.isSelected 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Selection Toggle */}
              <button
                onClick={() => handleToggleSelection(image._id)}
                className={`absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  image.isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-400 hover:text-gray-600"
                }`}
              >
                {image.isSelected ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </button>

              {/* File Type Indicator */}
              {type === "floorPlan" && (
                <div className="absolute top-2 right-2 z-10">
                  {(image as any).fileType === "pdf" ? (
                    <FileText className="h-4 w-4 text-red-500 bg-white rounded" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-blue-500 bg-white rounded" />
                  )}
                </div>
              )}

              {/* Image Preview */}
              <div className="aspect-square bg-gray-100">
                {image.imageId ? (
                  <ImageWithUrl
                    imageId={image.imageId}
                    alt={image.altText}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {(image as any).fileType === "pdf" ? (
                      <FileText className="h-8 w-8 text-gray-400" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSelection(image._id)}
                    className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                    title={image.isSelected ? "Hide from slider" : "Show in slider"}
                  >
                    {image.isSelected ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Selection Status Badge */}
              {image.isSelected && (
                <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  In Slider
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selection Summary */}
      {totalCount > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedCount}</span> of <span className="font-medium">{totalCount}</span> images selected for display
            </div>
            <div className="text-xs text-gray-500">
              Selected images will appear in sliders on the public website
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
