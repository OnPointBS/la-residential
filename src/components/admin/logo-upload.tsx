"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoId?: string;
  onLogoUpdated?: () => void;
}

// Helper component to handle logo URL fetching
function LogoWithUrl({ logoId, alt, ...props }: { logoId: string, alt: string, [key: string]: any }) {
  const logoUrl = useQuery(api.files.getUrl, { storageId: logoId as any });
  
  if (!logoUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  return <Image src={logoUrl} alt={alt} {...props} />;
}

export function LogoUpload({ currentLogoId, onLogoUpdated }: LogoUploadProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const uploadLogo = useMutation(api.settings.uploadLogo);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogoFile = async () => {
    if (!logoFile) return;
    
    setIsUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": logoFile.type },
        body: logoFile,
      });
      
      const { storageId } = await result.json();
      
      // Update settings with new logo
      await uploadLogo({ logoStorageId: storageId });
      
      // Clean up
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      if (onLogoUpdated) {
        onLogoUpdated();
      }
      
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Upload your company logo. Recommended size: 200x80px or similar aspect ratio.
        </p>
      </div>

      {/* Current Logo Display */}
      {currentLogoId && !logoPreview && (
        <div className="relative inline-block">
          <div className="w-48 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            <LogoWithUrl
              logoId={currentLogoId}
              alt="Company Logo"
              width={192}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Logo Preview */}
      {logoPreview && (
        <div className="relative inline-block">
          <div className="w-48 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            <Image
              src={logoPreview}
              alt="Logo Preview"
              width={192}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop your logo here, or click to select
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Select Logo"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Upload Actions */}
      {logoFile && (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={uploadLogoFile}
            disabled={isUploading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Logo"}
          </button>
          <button
            type="button"
            onClick={removeLogo}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: PNG, JPG, SVG. Maximum file size: 5MB.
      </p>
    </div>
  );
}
