"use client";
import AuthGuard from "@/components/guard/authGuard";
import AppHeader from "@/components/layout/header";
import UserSidebar from "@/components/user/UserSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mở sidebar mặc định trên desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
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
    <>
      <AuthGuard>
        <AppHeader />

        <div className="flex h-screen overflow-hidden bg-slate-50">
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
            <UserSidebar onClose={closeSidebar} />
            
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="absolute top-1/2 -right-6 -translate-y-1/2 flex items-center justify-center w-6 h-14 bg-white border border-slate-200 border-l-0 shadow-md rounded-r-xl hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>

          {/* Main Content */}
          <div
            className={`
              flex-1 overflow-y-auto transition-all duration-300
              ${isSidebarOpen ? "lg:ml-72" : "ml-0"}
            `}
          >
            <div className="p-4 lg:p-8 pt-20 lg:pt-8">{children}</div>
          </div>
        </div>
      </AuthGuard>
    </>
  );
}
