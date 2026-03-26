"use client";

import AuthGuard from "@/components/guard/authGuard";
import RoleGuard from "@/components/guard/roleGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div className="flex h-screen overflow-hidden bg-slate-50">
          {/* Mobile Menu Toggle Button */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6 text-slate-700" />
            </button>
          )}

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 z-40
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <AdminSidebar onClose={closeSidebar} />
          </div>

          {/* Main Content */}
          <div
            className={`
              flex-1 overflow-y-auto transition-all duration-300
              ${isSidebarOpen ? "lg:ml-72" : "ml-0"}
            `}
          >
            <main className="p-4 lg:p-8 pt-20 lg:pt-8">
              {children}
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
