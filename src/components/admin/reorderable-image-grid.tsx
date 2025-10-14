"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, GripVertical } from "lucide-react";
import Image from "next/image";

interface ImageItem {
  _id: Id<"homeImages">;
  imageId: Id<"_storage">;
  altText: string;
  caption?: string;
  order: number;
  isInterior: boolean;
}

interface ReorderableImageGridProps {
  images: ImageItem[];
  onImagesUpdated: () => void;
}

export function ReorderableImageGrid({ images, onImagesUpdated }: ReorderableImageGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const deleteImage = useMutation(api.homeImages.remove);
  const updateImageOrder = useMutation(api.homeImages.updateOrder);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    try {
      const draggedImage = images[draggedIndex];
      await updateImageOrder({
        imageId: draggedImage._id,
        newOrder: dropIndex,
      });
      
      onImagesUpdated();
    } catch (error) {
      console.error('Failed to reorder image:', error);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDelete = async (imageId: Id<"homeImages">) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage({ id: imageId });
        onImagesUpdated();
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }
  };

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedImages.map((image, index) => (
        <div
          key={image._id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          className={`relative group bg-white rounded-lg border-2 transition-all duration-200 ${
            draggedIndex === index
              ? 'border-blue-500 opacity-50 scale-105'
              : dragOverIndex === index
              ? 'border-green-500 scale-105'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <Image
              src={`/api/convex/storage/${image.imageId}`}
              alt={image.altText}
              fill
              className="object-cover"
            />
            
            {/* Drag handle */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center">
              <GripVertical className="h-3 w-3 mr-1" />
              {index + 1}
            </div>
            
            {/* Delete button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDelete(image._id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Interior/Exterior indicator */}
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs font-medium ${
              image.isInterior 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              {image.isInterior ? 'Interior' : 'Exterior'}
            </div>
          </div>
          
          <div className="p-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {image.altText}
            </p>
            {image.caption && (
              <p className="text-xs text-gray-600 truncate mt-1">
                {image.caption}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Order: {image.order}
              </span>
              <div className="text-xs text-gray-500">
                Drag to reorder
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}