"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Tag,
  Image as ImageIcon,
  Calendar,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/utils";
import { ImageEditModal } from "./image-edit-modal";

interface ImageGridProps {
  images: Array<{
    _id: Id<"images">;
    name: string;
    altText: string;
    caption?: string;
    storageId: Id<"_storage">;
    fileSize: number;
    mimeType: string;
    width?: number;
    height?: number;
    category?: string;
    tags: string[];
    isPublic: boolean;
    createdAt: number;
    updatedAt: number;
  }>;
  onImagesUpdated: () => void;
}

interface ImageWithUrl {
  _id: Id<"images">;
  name: string;
  altText: string;
  caption?: string;
  storageId: Id<"_storage">;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  category?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  url: string;
}

export function ImageGrid({ images, onImagesUpdated }: ImageGridProps) {
  const [editingImage, setEditingImage] = useState<typeof images[0] | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<Id<"images">>>(new Set());
  const [bulkActionMode, setBulkActionMode] = useState(false);

  const updateImage = useMutation(api.images.update);
  const deleteImage = useMutation(api.images.remove);
  const bulkDeleteImages = useMutation(api.images.bulkDelete);

  // Fetch URLs for all images - we'll use a simpler approach
  const imagesWithUrls: ImageWithUrl[] = images.map(img => ({
    ...img,
    url: `https://kindly-shark-235.convex.cloud/api/storage/${img.storageId}` // Direct URL construction
  }));

  const handleEdit = useCallback((image: typeof images[0]) => {
    setEditingImage(image);
  }, []);

  const handleDelete = useCallback(async (imageId: Id<"images">) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      try {
        await deleteImage({ id: imageId });
        onImagesUpdated();
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image. Please try again.");
      }
    }
  }, [deleteImage, onImagesUpdated]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedImages.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedImages.size} image(s)? This action cannot be undone.`)) {
      try {
        await bulkDeleteImages({ ids: Array.from(selectedImages) });
        setSelectedImages(new Set());
        setBulkActionMode(false);
        onImagesUpdated();
      } catch (error) {
        console.error("Error deleting images:", error);
        alert("Failed to delete images. Please try again.");
      }
    }
  }, [selectedImages, bulkDeleteImages, onImagesUpdated]);

  const handleSelectImage = useCallback((imageId: Id<"images">) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img._id)));
    }
  }, [selectedImages.size, images]);

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  }, []);

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <ImageIcon className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No images uploaded yet
        </h3>
        <p className="text-gray-600 mb-6">
          Upload your first images to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      {images.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedImages.size === images.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Select all ({selectedImages.size}/{images.length})
              </span>
            </label>
            
            {selectedImages.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected ({selectedImages.size})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {imagesWithUrls.map((image) => (
          <div
            key={image._id}
            className={cn(
              "relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden group",
              selectedImages.has(image._id) && "ring-2 ring-blue-500"
            )}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <input
                type="checkbox"
                checked={selectedImages.has(image._id)}
                onChange={() => handleSelectImage(image._id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Image */}
            <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.altText}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>

            {/* Image Info */}
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                {image.name}
              </h3>
              
              {image.category && (
                <div className="flex items-center mb-1">
                  <Tag className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{image.category}</span>
                </div>
              )}

              <div className="flex items-center text-xs text-gray-500 mb-1">
                <HardDrive className="h-3 w-3 mr-1" />
                <span>{formatFileSize(image.fileSize)}</span>
              </div>

              {image.width && image.height && (
                <div className="text-xs text-gray-500 mb-1">
                  {image.width} × {image.height}
                </div>
              )}

              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDate(image.createdAt)}</span>
              </div>
            </div>

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Edit image details"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                  title="View full size"
                >
                  <Eye className="h-4 w-4" />
                </a>
                
                <a
                  href={image.url}
                  download={image.name}
                  className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Download image"
                >
                  <Download className="h-4 w-4" />
                </a>
                
                <button
                  onClick={() => handleDelete(image._id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <ImageEditModal
          image={editingImage}
          isOpen={!!editingImage}
          onClose={() => setEditingImage(null)}
          onSave={onImagesUpdated}
        />
      )}
    </div>
  );
}
