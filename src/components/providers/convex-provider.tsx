"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create a fallback client if no URL is provided
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no Convex URL is configured, render children without Convex provider
  if (!convex) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Configuration Required
          </h1>
          <p className="text-gray-600 mb-6">
            To run this application, you need to configure Convex.
            Please follow the setup instructions below.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Run: <code className="bg-blue-100 px-1 rounded">npx convex dev</code></li>
              <li>2. Choose "new" project when prompted</li>
              <li>3. Select "personal" for team</li>
              <li>4. Name your project "la-residential"</li>
              <li>5. Copy the generated URL to .env.local</li>
              <li>6. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
  
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
