"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, MapPin, DollarSign } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice, formatSquareFootage } from "@/lib/utils";
import { HOME_STATUSES } from "@/lib/constants";
import { type Home as HomeType } from "@/types";

interface HomeCardProps {
  home: HomeType;
}

export function HomeCard({ home }: HomeCardProps) {
  const heroImageUrl = useQuery(
    api.files.getUrl, 
    home.heroImageId ? { storageId: home.heroImageId } : "skip"
  );

  const statusConfig = HOME_STATUSES.find(s => s.value === home.status);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 md:h-56">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={home.name}
            fill
            className="object-cover"
          />
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
