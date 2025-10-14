"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { formatSquareFootage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Edit, Eye, Trash2, Home, FileText } from "lucide-react";
import { useState } from "react";

// Helper component to handle file URL fetching
function FileWithUrl({ fileId, alt, fileType, ...props }: { fileId: Id<"_storage">, alt: string, fileType: "image" | "pdf", [key: string]: any }) {
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

interface FloorPlan {
  _id: Id<"floorPlans">;
  name: string;
  slug: string;
  description: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  imageId?: Id<"_storage">;
  pdfId?: Id<"_storage">;
  createdAt: number;
  updatedAt: number;
}

interface FloorPlanCardWithSliderProps {
  floorPlan: FloorPlan;
  onDelete: (id: Id<"floorPlans">) => void;
}

export function FloorPlanCardWithSlider({ floorPlan, onDelete }: FloorPlanCardWithSliderProps) {
  const floorPlanImages = useQuery(api.floorPlanImages.getByFloorPlan, { floorPlanId: floorPlan._id });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    if (floorPlanImages && floorPlanImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % floorPlanImages.length);
    }
  };

  const handlePrevImage = () => {
    if (floorPlanImages && floorPlanImages.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + floorPlanImages.length) % floorPlanImages.length);
    }
  };

  const displayFile = floorPlanImages?.[currentImageIndex];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      {/* Image/File Slider */}
      <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-4">
        {displayFile && displayFile.imageId ? (
          <FileWithUrl
            fileId={displayFile.imageId}
            alt={displayFile.altText}
            fileType={displayFile.fileType}
            fill
            className="object-cover"
          />
        ) : floorPlan.imageId ? (
          <FileWithUrl
            fileId={floorPlan.imageId}
            alt={floorPlan.name}
            fileType="image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <Home className="h-12 w-12" />
          </div>
        )}
        {floorPlanImages && floorPlanImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full"
            >
              &gt;
            </button>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {floorPlan.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {floorPlan.slug}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-20 text-gray-500">Size:</span>
          <span className="flex-1">{formatSquareFootage(floorPlan.squareFootage)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-20 text-gray-500">Rooms:</span>
          <span className="flex-1">{floorPlan.bedrooms} bed • {floorPlan.bathrooms} bath</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-20 text-gray-500">Files:</span>
          <span className="flex-1">
            {floorPlanImages ? floorPlanImages.length : 0} {floorPlanImages?.length === 1 ? 'file' : 'files'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
        <Link
          href={`/floor-plans/${floorPlan.slug}`}
          target="_blank"
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
        <Link
          href={`/admin/floor-plans/${floorPlan._id}/edit`}
          className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
        <button
          onClick={() => onDelete(floorPlan._id)}
          className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
}
