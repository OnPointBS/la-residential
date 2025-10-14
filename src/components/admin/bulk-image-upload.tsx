"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Upload, 
  X, 
  GripVertical, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import Image from "next/image";

interface ImageUpload {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  storageId?: Id<"_storage">;
}

interface BulkImageUploadProps {
  homeId: Id<"homes">;
  existingImages?: Array<{
    _id: Id<"homeImages">;
    imageId: Id<"_storage">;
    altText: string;
    caption?: string;
    order: number;
    isInterior: boolean;
  }>;
  onImagesUpdated?: () => void;
}

// Image compression utility
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export function BulkImageUpload({ homeId, existingImages = [], onImagesUpdated }: BulkImageUploadProps) {
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [existingImagesState, setExistingImagesState] = useState(existingImages);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateId = useMutation(api.files.generateUploadUrl);
  const addImage = useMutation(api.homeImages.create);
  const updateImageOrder = useMutation(api.homeImages.updateOrder);
  const deleteImage = useMutation(api.homeImages.remove);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;
    
    const newImages: ImageUpload[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    // Start uploading images one by one
    for (const imageUpload of newImages) {
      try {
        setImages(prev => prev.map(img => 
          img.id === imageUpload.id ? { ...img, uploading: true } : img
        ));
        
        // Compress the image
        const compressedFile = await compressImage(imageUpload.file);
        
        // Generate upload URL
        const uploadUrl = await generateId();
        
        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": compressedFile.type },
          body: compressedFile,
        });
        
        const { storageId } = await result.json();
        
        // Create image record
        const order = existingImagesState.length + images.length;
        await addImage({
          homeId,
          imageId: storageId,
          altText: compressedFile.name.replace(/\.[^/.]+$/, ""),
          caption: "",
          order,
          isInterior: true,
        });
        
        setImages(prev => prev.map(img => 
          img.id === imageUpload.id 
            ? { ...img, uploading: false, uploaded: true, storageId }
            : img
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        setImages(prev => prev.map(img => 
          img.id === imageUpload.id 
            ? { ...img, uploading: false, error: 'Upload failed' }
            : img
        ));
      }
    }
    
    // Refresh the images list
    if (onImagesUpdated) {
      onImagesUpdated();
    }
  }, [homeId, existingImagesState.length, images.length, generateId, addImage, onImagesUpdated]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const removeExistingImage = useCallback(async (imageId: Id<"homeImages">) => {
    try {
      await deleteImage({ id: imageId });
      setExistingImagesState(prev => prev.filter(img => img._id !== imageId));
      if (onImagesUpdated) {
        onImagesUpdated();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [deleteImage, onImagesUpdated]);

  const moveImage = useCallback(async (dragIndex: number, hoverIndex: number) => {
    const draggedImage = existingImagesState[dragIndex];
    const newImages = [...existingImagesState];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    
    setExistingImagesState(newImages);
    
    // Update order in database
    try {
      await updateImageOrder({
        imageId: draggedImage._id,
        newOrder: hoverIndex,
      });
      
      if (onImagesUpdated) {
        onImagesUpdated();
      }
    } catch (error) {
      console.error('Reorder error:', error);
      // Revert on error
      setExistingImagesState(existingImages);
    }
  }, [existingImagesState, updateImageOrder, onImagesUpdated, existingImages]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Home Images
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Select Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">
          Images will be automatically compressed for optimal performance
        </p>
      </div>

      {/* Existing Images */}
      {existingImagesState.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Current Images ({existingImagesState.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImagesState.map((image, index) => (
              <div
                key={image._id}
                className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={`/api/convex/storage/${image.imageId}`}
                    alt={image.altText}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {image.altText}
                  </p>
                  <div className="flex items-center mt-1">
                    <GripVertical className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      Drag to reorder
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Uploading Images ({images.filter(img => !img.uploaded).length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {image.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                  {image.uploaded && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {image.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {image.file.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {(image.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    {!image.uploading && !image.uploaded && (
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}