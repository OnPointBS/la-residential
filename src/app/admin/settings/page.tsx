"use client";


import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { 
  Save, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Image as ImageIcon
} from "lucide-react";
import { SettingsFormData } from "@/types";
import { LogoUpload } from "@/components/admin/logo-upload";

export default function AdminSettingsPage() {
  const settings = useQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);
  
  const [formData, setFormData] = useState<SettingsFormData>({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    metaTitle: "",
    metaDescription: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
    },
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || "",
        companyEmail: settings.companyEmail || "",
        companyPhone: settings.companyPhone || "",
        companyAddress: settings.companyAddress || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        socialLinks: {
          facebook: settings.socialLinks?.facebook || "",
          instagram: settings.socialLinks?.instagram || "",
          youtube: settings.socialLinks?.youtube || "",
        },
      });
    }
  }, [settings]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1] as keyof typeof formData.socialLinks;
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    try {
      await updateSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Update your company information and website settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Building className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Company Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="companyPhone"
                  name="companyPhone"
                  value={formData.companyPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <ImageIcon className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Company Logo
              </h2>
            </div>
            
            <LogoUpload 
              currentLogoId={settings?.logoId}
              onLogoUpdated={() => {
                // Settings will automatically refresh via Convex real-time updates
              }}
            />
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                SEO Settings
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Title for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Facebook className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Social Media Links
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  <Facebook className="h-4 w-4 inline mr-1" />
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="h-4 w-4 inline mr-1" />
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
                  <Youtube className="h-4 w-4 inline mr-1" />
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="socialLinks.youtube"
                  value={formData.socialLinks.youtube}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Save Changes</h3>
              <p className="text-gray-600 text-sm">
                Your changes will be reflected on the public website immediately.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isSaved && (
                <div className="text-green-600 text-sm font-medium">
                  ✓ Settings saved successfully
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
