"use client";

import {
  Bell,
  ChevronDown,
  ChevronUp,
  Database,
  FileText,
  Flag,
  Handshake,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  X,
  Users,
  Home,
  LandPlot,
  Cylinder,
  ClipboardList,
  Layers,
} from "lucide-react";
import { logout } from "@/services/auth.api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const currentRoute = usePathname();
  const [isDataDropdownOpen, setIsDataDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      if (error.status === 401) {
        toast.warning("Bạn chưa đăng nhập");
      } else {
        toast.error("Có lỗi xảy ra!");
        console.error(">>> Logout error: ", error);
      }
    } finally {
      clearAuth();
      toast.success("Đăng xuất thành công!");
      window.location.href = "/";
    }
  };

  const menuItems = [
    {
      label: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
      href: "/admin/dashboard",
    },
    {
      label: "Quản lý bài đăng",
      icon: <FileText size={20} />,
      href: "/admin/listings",
    },
    {
      label: "Kiểm duyệt bài đăng",
      icon: <ShieldCheck size={20} />,
      href: "/admin/moderation",
    },
    {
      label: "Báo cáo / Vi phạm",
      icon: <Flag size={20} />,
      href: "/admin/reports",
    },
    {
      label: "Lịch sử hoạt động",
      icon: <ClipboardList size={20} />,
      href: "/admin/audit-logs",
    },
  ];

  const dataSubItems = [
    {
      label: "Tiện ích",
      icon: <Cylinder size={18} />,
      href: "/admin/amenities",
    },
    {
      label: "Loại bài đăng",
      icon: <Layers size={18} />,
      href: "/admin/listing-types",
    },
    {
      label: "Quyền hạn",
      icon: <ShieldCheck size={18} />,
      href: "/admin/roles",
    },
    { label: "Người dùng", icon: <User size={18} />, href: "/admin/users" },
    {
      label: "Địa điểm nổi bật",
      icon: <LandPlot size={18} />,
      href: "/admin/destinations",
    },
  ];

  return (
    <aside
      className="h-full w-72 bg-white border-r border-input-border flex flex-col shadow-2xl lg:shadow-none overflow-y-auto no-scrollbar"
      id="admin-sidebar"
    >
      <div className="p-6 grow">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30 border border-slate-100">
              <span className="material-symbols-outlined flex items-center justify-center">
                <Handshake color="#137fec" size={30} />
              </span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-blue-500 whitespace-nowrap">
              Admin Panel
            </span>
          </Link>
          {onClose && (
            <button
              className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors p-1 rounded-lg hover:bg-slate-100"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentRoute === item.href
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                  : "text-text-secondary hover:bg-slate-50 hover:text-blue-500"
              }`}
              href={item.href}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm font-semibold whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Dropdown for System Data Management */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsDataDropdownOpen(!isDataDropdownOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all text-text-secondary hover:bg-slate-50 hover:text-blue-500 group`}
            >
              <div className="flex items-center gap-3">
                <Database
                  size={20}
                  className="group-hover:text-blue-500 transition-colors"
                />
                <span className="text-sm font-semibold whitespace-nowrap">
                  Quản lý dữ liệu hệ thống
                </span>
              </div>
              {isDataDropdownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            <div
              className={`ml-4 overflow-x-hidden transition-all duration-300 ease-in-out ${
                isDataDropdownOpen
                  ? "max-h-40 mt-2 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
                {dataSubItems.map((subItem) => (
                  <Link
                    key={subItem.label}
                    href={subItem.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:bg-slate-50 hover:text-blue-500 transition-all text-sm font-medium"
                  >
                    <span className="shrink-0 opacity-70">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentRoute === "/admin/settings"
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "text-text-secondary hover:bg-slate-50 hover:text-blue-500"
            }`}
            href={"/admin/dashboard"}
          >
            <span className="shrink-0">
              <Settings size={20} />
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">
              Cài đặt (Đang phát triển)
            </span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-input-border flex flex-col gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-100 shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                <User size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="text-text-main text-sm font-bold leading-tight truncate">
              {user?.full_name || "Admin User"}
            </h1>
            <p className="text-text-secondary text-xs font-medium truncate">
              Quản trị hệ thống
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all group font-semibold text-sm"
        >
          <LogOut
            className="group-hover:-translate-x-1 transition-transform"
            size={20}
          />
          <span className="whitespace-nowrap">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
