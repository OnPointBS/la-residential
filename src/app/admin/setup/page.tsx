"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2, User, Lock } from "lucide-react";

export default function SetupPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  
  const createDefaultAdmin = useMutation(api.auth.createDefaultAdmin);

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setError("");
    setResult(null);

    try {
      const result = await createDefaultAdmin({});
      setResult(result);
    } catch (err: any) {
      setError(err.message || "Failed to create admin user");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">LA Residential</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Admin Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create the default admin user for your system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!result && !error && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Create Default Admin User
                </h3>
                <p className="text-sm text-gray-600">
                  This will create an admin user with the following credentials:
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">admin@laresidential.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">admin123</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreateAdmin}
                disabled={isCreating}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating Admin User..." : "Create Admin User"}
              </button>
            </div>
          )}

          {result && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 rounded-full p-3 w-16 h-16 mx-auto">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Admin User Created Successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can now log in to the admin panel.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{result.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">{result.password}</p>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href="/admin/login"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </a>
            </div>
          )}

          {error && (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
              <button
                onClick={() => {
                  setError("");
                  setResult(null);
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}