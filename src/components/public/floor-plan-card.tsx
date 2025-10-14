"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Download } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatSquareFootage } from "@/lib/utils";
import { type FloorPlan } from "@/types";

interface FloorPlanCardProps {
  floorPlan: FloorPlan;
}

export function FloorPlanCard({ floorPlan }: FloorPlanCardProps) {
  const imageUrl = useQuery(
    api.files.getUrl,
    floorPlan.imageId ? { storageId: floorPlan.imageId } : "skip"
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 md:h-56">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={floorPlan.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {floorPlan.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            <span>{formatSquareFootage(floorPlan.squareFootage)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">🛏️</span>
            <span>{floorPlan.bedrooms} bed • {floorPlan.bathrooms} bath</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {floorPlan.description}
        </p>
        
        <div className="flex gap-2">
          <Link
            href={`/floor-plans/${floorPlan.slug}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
