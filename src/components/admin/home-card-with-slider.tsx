"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatSquareFootage } from "@/lib/utils";
import { HOME_STATUSES } from "@/lib/constants";

interface HomeCardWithSliderProps {
  home: {
    _id: Id<"homes">;
    name: string;
    slug: string;
    address: string;
    squareFootage: number;
    bedrooms: number;
    bathrooms: number;
    price?: number;
    status: "available" | "under-construction" | "sold" | "coming-soon";
    heroImageId?: Id<"_storage">;
  };
  onDelete: (id: string) => void;
}

// Helper component to handle image URL fetching
function ImageWithUrl({ imageId, alt, ...props }: { imageId: Id<"_storage">, alt: string, [key: string]: any }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId: imageId });
  
  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  return <Image src={imageUrl} alt={alt} {...props} />;
}

export function HomeCardWithSlider({ home, onDelete }: HomeCardWithSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const statusConfig = HOME_STATUSES.find(s => s.value === home.status);
  
  // Get all images for this home
  const homeImages = useQuery(api.homeImages.getSelectedByHome, { homeId: home._id });
  
  // Create array of images including hero image if it exists
  const allImages = [];
  if (home.heroImageId) {
    allImages.push({ imageId: home.heroImageId, altText: `${home.name} - Hero Image` });
  }
  if (homeImages) {
    // Sort by order and add to allImages
    const sortedImages = [...homeImages].sort((a, b) => a.order - b.order);
    sortedImages.forEach(img => {
      if (img.imageId) {
        allImages.push({ imageId: img.imageId, altText: img.altText || home.name });
      }
    });
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Slider */}
      <div className="relative h-48 bg-gray-200">
        {allImages.length > 0 ? (
          <>
            <ImageWithUrl
              imageId={allImages[currentImageIndex].imageId}
              alt={allImages[currentImageIndex].altText}
              fill
              className="object-cover"
            />
            
            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image Dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        {statusConfig && (
          <div className="absolute top-2 left-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color} text-white`}>
              {statusConfig.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {home.name}
          </h3>
          <p className="text-sm text-gray-500">
            {home.slug}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-20 text-gray-500">Address:</span>
            <span className="flex-1 truncate" title={home.address}>{home.address}</span>
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
            title="View on website"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
          <Link
            href={`/admin/homes/${home._id}/edit`}
            className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
            title="Edit home"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(home._id)}
            className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
            title="Delete home"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
