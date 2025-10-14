"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getIconComponent, getIconColor } from "@/lib/social-media-icons";

interface SocialMediaLinksProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  orientation?: "horizontal" | "vertical";
}

export function SocialMediaLinks({ 
  className = "",
  size = "md",
  showLabels = false,
  orientation = "horizontal"
}: SocialMediaLinksProps) {
  const socialMediaLinks = useQuery(api.socialMediaLinks.getAll) || [];

  if (socialMediaLinks.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: {
      container: "gap-2",
      icon: "h-4 w-4",
      text: "text-sm"
    },
    md: {
      container: "gap-3",
      icon: "h-5 w-5",
      text: "text-base"
    },
    lg: {
      container: "gap-4",
      icon: "h-6 w-6",
      text: "text-lg"
    }
  };

  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col"
  };

  const currentSize = sizeClasses[size];
  const currentOrientation = orientationClasses[orientation];

  return (
    <div className={`flex ${currentOrientation} ${currentSize.container} ${className}`}>
      {socialMediaLinks.map((link) => {
        const IconComponent = getIconComponent(link.icon);
        const iconColor = getIconColor(link.icon);
        
        return (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center transition-all duration-200
              ${orientation === "horizontal" ? "gap-2" : "gap-3"}
              ${orientation === "horizontal" ? "justify-center" : "justify-start"}
              p-3 rounded-lg hover:shadow-md
              bg-white hover:bg-gray-50
              border border-gray-200 hover:border-gray-300
              group
            `}
            title={`Visit our ${link.label}`}
          >
            <div 
              className={`
                rounded-full flex items-center justify-center
                transition-all duration-200
                ${size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : "w-12 h-12"}
                group-hover:scale-110
              `}
              style={{ 
                backgroundColor: `${iconColor}15`,
                borderColor: `${iconColor}30`
              }}
            >
              <IconComponent 
                className={currentSize.icon}
                style={{ color: iconColor }}
              />
            </div>
            
            {showLabels && (
              <span className={`font-medium text-gray-700 group-hover:text-gray-900 ${currentSize.text}`}>
                {link.label}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

// Compact version for headers/footers
export function SocialMediaLinksCompact({ className = "" }: { className?: string }) {
  return (
    <SocialMediaLinks 
      className={className}
      size="sm"
      showLabels={false}
      orientation="horizontal"
    />
  );
}

// Full version with labels
export function SocialMediaLinksFull({ className = "" }: { className?: string }) {
  return (
    <SocialMediaLinks 
      className={className}
      size="md"
      showLabels={true}
      orientation="vertical"
    />
  );
}
