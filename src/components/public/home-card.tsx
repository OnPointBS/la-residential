"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, MapPin, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice, formatSquareFootage } from "@/lib/utils";
import { HOME_STATUSES } from "@/lib/constants";
import { type Home as HomeType } from "@/types";
import { Id } from "@/convex/_generated/dataModel";

// Helper component to handle image URL fetching
function ImageWithUrl({ imageId, alt, ...props }: { imageId: Id<"_storage">, alt: string, [key: string]: any }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId: imageId });
  
  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  return <Image src={imageUrl} alt={alt} {...props} />;
}

interface HomeCardProps {
  home: HomeType;
}

export function HomeCard({ home }: HomeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get selected images for slider
  const selectedImages = useQuery(
    api.homeImages.getSelectedByHome,
    { homeId: home._id }
  );
  

  const statusConfig = HOME_STATUSES.find(s => s.value === home.status);

  // Create array of images to display
  const displayImages = [];
  if (selectedImages && selectedImages.length > 0) {
    // Use selected images
    selectedImages.forEach(img => {
      if (img.imageId) {
        displayImages.push({ imageId: img.imageId, altText: img.altText });
      }
    });
  } else if (home.heroImageId) {
    // Fallback to hero image
    displayImages.push({ imageId: home.heroImageId, altText: `${home.name} - Hero Image` });
  }

  const handlePrevImage = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

  const handleNextImage = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 md:h-56 group">
        {displayImages.length > 0 ? (
          <>
            <ImageWithUrl
              imageId={displayImages[currentImageIndex].imageId}
              alt={displayImages[currentImageIndex].altText}
              fill
              className="object-cover"
            />
            
            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            
            {/* Image counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {displayImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {statusConfig && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white ${statusConfig.color}`}>
            {statusConfig.label}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {home.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <span>{formatSquareFootage(home.squareFootage)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{home.address}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🛏️</span>
            <span>{home.bedrooms} bed • {home.bathrooms} bath</span>
          </div>
          
          {home.price && (
            <div className="flex items-center text-gray-900 font-semibold">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatPrice(home.price)}</span>
            </div>
          )}
        </div>
        
        <Link
          href={`/homes/${home.slug}`}
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
