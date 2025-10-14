"use client";

import { usePathname } from "next/navigation";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't protect login and setup pages
  if (pathname === "/admin/login" || pathname === "/admin/setup") {
    return <>{children}</>;
  }
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
