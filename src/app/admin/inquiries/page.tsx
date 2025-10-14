"use client";


import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Clock,
  User,
  Phone,
  Home,
  Search,
  Filter
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminInquiriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const inquiries = useQuery(api.inquiries.getAll);
  const markAsRead = useMutation(api.inquiries.markAsRead);
  const markAsUnread = useMutation(api.inquiries.markAsUnread);
  const deleteInquiry = useMutation(api.inquiries.remove);



  // Filter inquiries
  const filteredInquiries = inquiries?.filter((inquiry) => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "read" && inquiry.isRead) ||
      (statusFilter === "unread" && !inquiry.isRead);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      if (isRead) {
        await markAsUnread({ id: id as any });
      } else {
        await markAsRead({ id: id as any });
      }
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      try {
        await deleteInquiry({ id: id as any });
      } catch (error) {
        console.error("Error deleting inquiry:", error);
        alert("Failed to delete inquiry. Please try again.");
      }
    }
  };

  const unreadCount = inquiries?.filter(i => !i.isRead).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
              <p className="text-gray-600 mt-2">
                Manage customer inquiries and leads
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Inquiries</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Inquiries ({filteredInquiries.length})
            </h2>
          </div>
          
          {filteredInquiries.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry._id} className={`p-6 hover:bg-gray-50 ${!inquiry.isRead ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {inquiry.name}
                          </span>
                          {!inquiry.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      {inquiry.homeId && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Home className="h-4 w-4 mr-2" />
                          <span>Interested in specific home</span>
                        </div>
                      )}
                      
                      <div className="text-gray-700 mb-4">
                        <p className="line-clamp-3">
                          {inquiry.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleMarkAsRead(inquiry._id, inquiry.isRead)}
                        className={`p-2 rounded-md transition-colors ${
                          inquiry.isRead 
                            ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' 
                            : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                        }`}
                        title={inquiry.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {inquiry.isRead ? (
                          <MailOpen className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Mail className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-600 mb-6">
                {inquiries?.length === 0 
                  ? "Inquiries from your contact forms will appear here."
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
