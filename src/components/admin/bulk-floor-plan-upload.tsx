"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Upload, 
  X, 
  GripVertical, 
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import Image from "next/image";

interface FileUpload {
  id: string;
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  storageId?: Id<"_storage">;
  fileType: "image" | "pdf";
}

interface BulkFloorPlanUploadProps {
  floorPlanId: Id<"floorPlans">;
  existingFiles?: Array<{
    _id: Id<"floorPlanImages">;
    imageId: Id<"_storage">;
    altText: string;
    caption?: string;
    order: number;
    fileType: "image" | "pdf";
  }>;
  onFilesUpdated?: () => void;
}

// Helper component to handle file URL fetching
function FileWithUrl({ imageId, fileType, alt, ...props }: { imageId: Id<"_storage">, fileType: "image" | "pdf", alt: string, [key: string]: any }) {
  const fileUrl = useQuery(api.files.getUrl, { storageId: imageId });
  
  if (!fileUrl) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading...</div>;
  }
  
  if (fileType === "image") {
    return <Image src={fileUrl} alt={alt} {...props} />;
  } else {
    return (
      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
        <FileText className="h-12 w-12 text-gray-400 mb-2" />
        <span className="text-xs text-gray-600 text-center">{alt}</span>
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 text-xs mt-2 hover:underline"
        >
          View PDF
        </a>
      </div>
    );
  }
}

export function BulkFloorPlanUpload({ floorPlanId, existingFiles = [], onFilesUpdated }: BulkFloorPlanUploadProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [existingFilesState, setExistingFilesState] = useState(existingFiles);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const generateId = useMutation(api.files.generateUploadUrl);
  const addFile = useMutation(api.floorPlanImages.create);
  const updateFileOrder = useMutation(api.floorPlanImages.updateOrder);
  const deleteFile = useMutation(api.floorPlanImages.remove);
  const updateFloorPlan = useMutation(api.floorPlans.update);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length === 0) return;
    
    const newFiles: FileUpload[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      uploading: false,
      uploaded: false,
      fileType: file.type.startsWith('image/') ? 'image' as const : 'pdf' as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Start uploading files one by one
    for (const fileUpload of newFiles) {
      try {
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, uploading: true } : f
        ));
        
        // Generate upload URL
        const uploadUrl = await generateId();
        
        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": fileUpload.file.type },
          body: fileUpload.file,
        });
        
        const { storageId } = await result.json();
        
        // Create file record
        const order = existingFilesState.length + files.length;
        await addFile({
          floorPlanId,
          imageId: storageId,
          altText: fileUpload.file.name.replace(/\.[^/.]+$/, ""),
          caption: "",
          order,
          fileType: fileUpload.fileType,
        });
        
        // Set the first uploaded image as the floor plan hero image if no hero image exists
        const isFirstImage = existingFilesState.length === 0 && files.length === 0 && fileUpload.fileType === 'image';
        if (isFirstImage) {
          await updateFloorPlan({
            id: floorPlanId,
            imageId: storageId,
          });
        }
        
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, uploading: false, uploaded: true, storageId }
            : f
        ));
        
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileUpload.id 
            ? { ...f, uploading: false, error: 'Upload failed' }
            : f
        ));
      }
    }
    
    // Refresh the files list
    if (onFilesUpdated) {
      onFilesUpdated();
    }
  }, [floorPlanId, existingFilesState.length, files.length, generateId, addFile, updateFloorPlan, onFilesUpdated]);

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

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const removeExistingFile = useCallback(async (fileId: Id<"floorPlanImages">) => {
    try {
      await deleteFile({ id: fileId });
      setExistingFilesState(prev => prev.filter(f => f._id !== fileId));
      if (onFilesUpdated) {
        onFilesUpdated();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [deleteFile, onFilesUpdated]);

  const moveFile = useCallback(async (dragIndex: number, hoverIndex: number) => {
    const draggedFile = existingFilesState[dragIndex];
    const newFiles = [...existingFilesState];
    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedFile);
    
    setExistingFilesState(newFiles);
    
    // Update order in database
    try {
      await updateFileOrder({
        imageId: draggedFile._id,
        newOrder: hoverIndex,
      });
      
      if (onFilesUpdated) {
        onFilesUpdated();
      }
    } catch (error) {
      console.error('Reorder error:', error);
      // Revert on error
      setExistingFilesState(existingFiles);
    }
  }, [existingFilesState, updateFileOrder, onFilesUpdated, existingFiles]);

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
          Upload Floor Plan Files
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop images or PDF files here, or click to select files
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-sm text-gray-500 mt-2">
          Supports images (PNG, JPG) and PDF files up to 25MB
        </p>
      </div>

      {/* Existing Files */}
      {existingFilesState.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Current Files ({existingFilesState.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingFilesState.map((file, index) => (
              <div
                key={file._id}
                className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square relative">
                  <FileWithUrl
                    imageId={file.imageId}
                    fileType={file.fileType}
                    alt={file.altText}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center">
                    {file.fileType === 'image' ? <ImageIcon className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                    {index + 1}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => removeExistingFile(file._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {file.altText}
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

      {/* Uploading Files */}
      {files.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Uploading Files ({files.filter(f => !f.uploaded).length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square relative">
                  {file.fileType === 'image' ? (
                    <Image
                      src={file.preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4">
                      <FileText className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 text-center">{file.file.name}</span>
                    </div>
                  )}
                  {file.uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  )}
                  {file.uploaded && (
                    <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {file.error && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">
                    {file.file.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    {!file.uploading && !file.uploaded && (
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
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
