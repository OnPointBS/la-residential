"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Users } from "lucide-react";
import Image from "next/image";

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imageName?: string; // The name of the image in the database
  fallbackIcon?: React.ReactNode;
}

// Helper component to handle image URL fetching
function ImageWithUrl({ imageId, alt, ...props }: { imageId: any, alt: string, [key: string]: any }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId: imageId });
  
  if (!imageUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  return <Image src={imageUrl} alt={alt} {...props} />;
}

export function TeamMember({ 
  name, 
  role, 
  description, 
  imageName,
  fallbackIcon = <Users className="h-12 w-12 text-gray-400" />
}: TeamMemberProps) {
  // Try to find the team member's image by name
  const images = useQuery(api.images.search, {
    category: "team"
  });

  const memberImage = images?.find(img => {
    const imgNameLower = img.name.toLowerCase();
    const imgAltLower = img.altText.toLowerCase();
    const searchNameLower = imageName?.toLowerCase() || name.toLowerCase();
    
    return imgNameLower.includes(searchNameLower) ||
           imgAltLower.includes(searchNameLower) ||
           imgNameLower.includes(name.toLowerCase()) ||
           imgAltLower.includes(name.toLowerCase());
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
        {memberImage ? (
          <ImageWithUrl
            imageId={memberImage.storageId}
            alt={memberImage.altText || name}
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          fallbackIcon
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {name}
      </h3>
      <p className="text-blue-600 font-medium mb-2">
        {role}
      </p>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}
