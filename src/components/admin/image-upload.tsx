"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, Image as ImageIcon, XCircle, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UploadingFile {
  id: string;
  file: File;
  status: "pending" | "uploading" | "compressing" | "success" | "error";
  progress: number;
  previewUrl: string | null;
  error?: string;
}

interface ImageUploadProps {
  onUploadComplete?: () => void;
  multiple?: boolean;
  category?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

const MAX_WIDTH = 1200; // Max width for compressed images
const JPEG_QUALITY = 0.8; // JPEG quality for compression
const DEFAULT_MAX_FILE_SIZE = 10; // 10MB
const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({ 
  onUploadComplete, 
  multiple = true, 
  category,
  maxFiles = 10,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES
}: ImageUploadProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createImage = useMutation(api.images.create);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const compressImage = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            return reject(new Error("Could not get canvas context"));
          }

          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas toBlob failed"));
              }
            },
            "image/jpeg",
            JPEG_QUALITY
          );
        };
        img.onerror = (error) => reject(error);
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use ${acceptedTypes.join(", ")}.`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size ${fileSizeMB.toFixed(1)}MB exceeds the maximum allowed size of ${maxFileSize}MB.`;
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // Convert to array and validate
      const fileArray = Array.from(files);
      
      // Check max files limit
      if (fileArray.length > maxFiles) {
        setError(`You can only upload ${maxFiles} files at a time.`);
        return;
      }

      // Validate each file
      const validationErrors: string[] = [];
      const validFiles: File[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          validationErrors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("\n"));
        return;
      }

      if (validFiles.length === 0) return;

      setError(null);

      const newFiles: UploadingFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        status: "pending",
        progress: 0,
        previewUrl: URL.createObjectURL(file),
      }));

      setUploadingFiles((prev) => [...prev, ...newFiles]);

      for (const newFile of newFiles) {
        try {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "compressing", progress: 10 } : f
            )
          );

          const compressedBlob = await compressImage(newFile.file);
          const compressedFile = new File([compressedBlob], newFile.file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "uploading", progress: 30 } : f
            )
          );

          const postUrl = await generateUploadUrl();
          const response = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": compressedFile.type },
            body: compressedFile,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const { storageId } = await response.json();

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, progress: 70 } : f
            )
          );

          // Create image record
          await createImage({
            name: newFile.file.name.split(".")[0], // Remove extension
            altText: newFile.file.name.split(".")[0], // Basic alt text
            storageId,
            fileSize: compressedFile.size,
            mimeType: compressedFile.type,
            category,
            tags: [],
            isPublic: true,
          });

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id ? { ...f, status: "success", progress: 100 } : f
            )
          );

          onUploadComplete?.();
        } catch (error: any) {
          console.error("Error uploading image:", error);
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === newFile.id
                ? { ...f, status: "error", error: error.message, progress: 0 }
                : f
            )
          );
        } finally {
          if (newFile.previewUrl) {
            URL.revokeObjectURL(newFile.previewUrl);
          }
        }
      }
    },
    [generateUploadUrl, createImage, category, onUploadComplete, compressImage, maxFiles, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleFiles]
  );

  const handleRetry = useCallback((fileId: string) => {
    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "pending", error: undefined, progress: 0 } : f
      )
    );
    const fileToRetry = uploadingFiles.find(f => f.id === fileId);
    if (fileToRetry) {
      handleFiles(new DataTransfer().files); // Re-trigger with the specific file
    }
  }, [handleFiles, uploadingFiles]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-blue-500 bg-blue-50 text-blue-700"
            : "border-gray-300 bg-gray-50 text-gray-600 hover:border-gray-400"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 mb-4" />
        <p className="text-lg font-semibold mb-1">Upload Images</p>
        <p className="text-sm mb-4">
          {multiple 
            ? `Drag and drop up to ${maxFiles} images here, or click to select files`
            : "Drag and drop an image here, or click to select a file"
          }
        </p>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {multiple ? "Select Images" : "Select Image"}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Supports {acceptedTypes.map(type => type.split("/")[1].toUpperCase()).join(", ")} up to {maxFileSize}MB each
        </p>
        <p className="text-xs text-gray-500">
          Images will be automatically compressed for optimal performance
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
              <div className="mt-3">
                <button
                  onClick={clearError}
                  className="text-sm text-red-800 hover:text-red-900 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Upload Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center space-x-4"
              >
                {file.previewUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image src={file.previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                  <div className="mt-1 text-xs text-gray-500">
                    {file.status === "compressing" && "Compressing..."}
                    {file.status === "uploading" && "Uploading..."}
                    {file.status === "pending" && "Pending..."}
                    {file.status === "success" && "Upload Complete!"}
                    {file.status === "error" && `Error: ${file.error || "Failed"}`}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        file.status === "success" ? "bg-green-500" : "bg-blue-600",
                        file.status === "error" && "bg-red-500"
                      )}
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {file.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {file.status === "error" && (
                    <button onClick={() => handleRetry(file.id)} className="text-red-500 hover:text-red-700">
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                  {(file.status === "uploading" || file.status === "compressing") && (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
