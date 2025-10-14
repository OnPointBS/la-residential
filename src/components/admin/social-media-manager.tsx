"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Eye, 
  EyeOff,
  ExternalLink,
  Save,
  X
} from "lucide-react";
import { SOCIAL_MEDIA_ICONS, getIconComponent, getIconColor } from "@/lib/social-media-icons";
import { SecureAdminForm, SecureAdminInput } from "@/components/security/secure-admin-form";
import { validateAndSanitizeForm } from "@/lib/security";

interface SocialMediaManagerProps {
  className?: string;
}

interface SocialMediaLink {
  _id: Id<"socialMediaLinks">;
  platform: string;
  url: string;
  icon: string;
  label: string;
  order: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export function SocialMediaManager({ className = "" }: SocialMediaManagerProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<Id<"socialMediaLinks"> | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const socialMediaLinks = useQuery(api.socialMediaLinks.getAllForAdmin) || [];
  const createLink = useMutation(api.socialMediaLinks.create);
  const updateLink = useMutation(api.socialMediaLinks.update);
  const removeLink = useMutation(api.socialMediaLinks.remove);
  const toggleActive = useMutation(api.socialMediaLinks.toggleActive);
  const reorderLinks = useMutation(api.socialMediaLinks.reorder);

  const handleCreate = async (formData: FormData, _csrfToken: string) => {
    const validationResult = validateAndSanitizeForm(
      Object.fromEntries(formData.entries()),
      {
        platform: {
          required: true,
          type: 'string',
          minLength: 2,
          maxLength: 50,
          sanitize: true
        },
        url: {
          required: true,
          type: 'url',
          sanitize: true
        },
        icon: {
          required: true,
          type: 'string',
          sanitize: true
        },
        label: {
          required: true,
          type: 'string',
          minLength: 2,
          maxLength: 50,
          sanitize: true
        }
      }
    );

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors
      };
    }

    try {
      const nextOrder = Math.max(...socialMediaLinks.map(link => link.order), 0) + 1;
      
      await createLink({
        platform: validationResult.sanitizedData.platform,
        url: validationResult.sanitizedData.url,
        icon: validationResult.sanitizedData.icon,
        label: validationResult.sanitizedData.label,
        order: nextOrder,
      });

      setIsAddingNew(false);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errors: [error.message || "Failed to create social media link"]
      };
    }
  };

  const handleUpdate = async (formData: FormData, _csrfToken: string) => {
    if (!editingId) return { success: false, errors: ["No item selected for editing"] };

    const validationResult = validateAndSanitizeForm(
      Object.fromEntries(formData.entries()),
      {
        platform: {
          required: true,
          type: 'string',
          minLength: 2,
          maxLength: 50,
          sanitize: true
        },
        url: {
          required: true,
          type: 'url',
          sanitize: true
        },
        icon: {
          required: true,
          type: 'string',
          sanitize: true
        },
        label: {
          required: true,
          type: 'string',
          minLength: 2,
          maxLength: 50,
          sanitize: true
        }
      }
    );

    if (!validationResult.isValid) {
      return {
        success: false,
        errors: validationResult.errors
      };
    }

    try {
      await updateLink({
        id: editingId,
        platform: validationResult.sanitizedData.platform,
        url: validationResult.sanitizedData.url,
        icon: validationResult.sanitizedData.icon,
        label: validationResult.sanitizedData.label,
      });

      setEditingId(null);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        errors: [error.message || "Failed to update social media link"]
      };
    }
  };

  const handleDelete = async (id: Id<"socialMediaLinks">) => {
    if (!confirm("Are you sure you want to delete this social media link?")) return;

    try {
      await removeLink({ id });
    } catch (error) {
      console.error("Error deleting social media link:", error);
      alert("Failed to delete social media link. Please try again.");
    }
  };

  const handleToggleActive = async (id: Id<"socialMediaLinks">) => {
    try {
      await toggleActive({ id });
    } catch (error) {
      console.error("Error toggling social media link:", error);
      alert("Failed to toggle social media link. Please try again.");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    const newLinks = [...socialMediaLinks];
    const draggedLink = newLinks[draggedItem];
    newLinks.splice(draggedItem, 1);
    newLinks.splice(dropIndex, 0, draggedLink);

    // Update order values
    const reorderItems = newLinks.map((link, index) => ({
      id: link._id,
      order: index + 1
    }));

    try {
      await reorderLinks({ items: reorderItems });
    } catch (error) {
      console.error("Error reordering social media links:", error);
      alert("Failed to reorder social media links. Please try again.");
    }

    setDraggedItem(null);
  };

  const editingLink = editingId ? socialMediaLinks.find(link => link._id === editingId) : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Social Media Links
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your social media presence
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </button>
      </div>

      {/* Add New Link Form */}
      {isAddingNew && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Social Media Link</h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <SecureAdminForm onSubmit={handleCreate} rateLimitKey="social-media-create">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SecureAdminInput
                name="platform"
                type="text"
                label="Platform"
                placeholder="e.g., facebook, instagram, custom"
                required
                minLength={2}
                maxLength={50}
                sanitize
              />

              <SecureAdminInput
                name="label"
                type="text"
                label="Display Label"
                placeholder="e.g., Facebook, Instagram, Our Blog"
                required
                minLength={2}
                maxLength={50}
                sanitize
              />

              <SecureAdminInput
                name="url"
                type="url"
                label="URL"
                placeholder="https://..."
                required
                sanitize
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  name="icon"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an icon...</option>
                  {SOCIAL_MEDIA_ICONS.map((icon) => {
                    const IconComponent = icon.component;
                    return (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </SecureAdminForm>
        </div>
      )}

      {/* Edit Link Form */}
      {editingLink && (
        <div className="border border-blue-200 rounded-lg p-4 mb-6 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-900">Edit Social Media Link</h3>
            <button
              onClick={() => setEditingId(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <SecureAdminForm onSubmit={handleUpdate} rateLimitKey="social-media-update">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SecureAdminInput
                name="platform"
                type="text"
                label="Platform"
                value={editingLink.platform}
                required
                minLength={2}
                maxLength={50}
                sanitize
              />

              <SecureAdminInput
                name="label"
                type="text"
                label="Display Label"
                value={editingLink.label}
                required
                minLength={2}
                maxLength={50}
                sanitize
              />

              <SecureAdminInput
                name="url"
                type="url"
                label="URL"
                value={editingLink.url}
                required
                sanitize
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  name="icon"
                  defaultValue={editingLink.icon}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SOCIAL_MEDIA_ICONS.map((icon) => (
                    <option key={icon.name} value={icon.name}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SecureAdminForm>
        </div>
      )}

      {/* Social Media Links List */}
      <div className="space-y-3">
        {socialMediaLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No social media links added yet.</p>
            <p className="text-sm mt-1">Click "Add Link" to get started.</p>
          </div>
        ) : (
          socialMediaLinks.map((link, index) => {
            const IconComponent = getIconComponent(link.icon);
            const iconColor = getIconColor(link.icon);
            
            return (
              <div
                key={link._id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`flex items-center p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-move ${
                  draggedItem === index ? 'opacity-50' : ''
                } ${!link.isActive ? 'opacity-60' : ''}`}
              >
                <GripVertical className="h-5 w-5 text-gray-400 mr-3" />
                
                <div className="flex items-center flex-1">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${iconColor}20` }}
                  >
                    <IconComponent 
                      className="h-5 w-5" 
                      style={{ color: iconColor }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{link.label}</span>
                      {!link.isActive && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Hidden</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{link.platform}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(link._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      link.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={link.isActive ? 'Hide from website' : 'Show on website'}
                  >
                    {link.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  
                  <button
                    onClick={() => setEditingId(link._id)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit link"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {socialMediaLinks.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <p>💡 Drag and drop to reorder links. The order will be reflected on your website.</p>
        </div>
      )}
    </div>
  );
}
