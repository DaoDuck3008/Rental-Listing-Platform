"use client";

import {
  Handshake,
  Menu,
  Heart,
  X,
  Home,
  Search,
  Users,
  LogOut,
  User as UserIcon,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import UserDropdown from "./userDropdown";
import PostButton from "../common/postBtn";
import { useState, useEffect } from "react";
import FavoriteDrawer from "./FavoriteDrawer";
import { useFavorites } from "@/hooks/useFavorites";
import { logout } from "@/services/auth.api";
import { toast } from "react-toastify";
import ModalPortal from "../ui/modalPortal";
import { usePathname } from "next/navigation";
import NotificationBell from "./notificationBell";

export default function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const pathname = usePathname();
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      toast.success("Đăng xuất thành công!");
      setIsMenuOpen(false);
      window.location.href = "/";
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  return (
    <header className="sticky top-0 z-60 w-full border-b border-slate-200 bg-background-light/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 cursor-pointer relative z-70"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="size-8 text-primary flex items-center justify-center">
            <Handshake color="#137fec" size={30} />
          </div>
          <h2 className="text-xl font-bold tracking-tight">RentalHome</h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
          <div className="flex gap-4 items-center">
            {user && (
              <button
                onClick={() => setIsFavoriteOpen(true)}
                className="relative p-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all group"
                title="Danh sách yêu thích"
              >
                <Heart className="w-6 h-6 group-hover:fill-current transition-all" />
                {favoriteIds.length > 0 && (
                  <span className="absolute top-0 right-0 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {favoriteIds.length}
                  </span>
                )}
              </button>
            )}

            {user && <NotificationBell />}

            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={`/login?redirect=${pathname}`}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href={`/register?redirect=${pathname}`}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <UserDropdown user={user} onLogout={clearAuth} />
            )}

            {user && <PostButton />}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2 relative z-70">
          {user && (
            <button
              onClick={() => setIsFavoriteOpen(true)}
              className="relative p-2 text-slate-600 hover:text-red-500 transition-all"
            >
              <Heart
                className={`w-6 h-6 ${
                  favoriteIds.length > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {favoriteIds.length > 0 && (
                <span className="absolute top-1 right-1 size-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                  {favoriteIds.length}
                </span>
              )}
            </button>
          )}

          {user && <NotificationBell />}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-900 transition-colors hover:bg-slate-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <ModalPortal>
        <div
          className={`md:hidden fixed inset-0 z-65 bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
          style={{ top: "0" }}
        >
          <div className="flex flex-col h-full p-6 space-y-8 overflow-y-auto pt-20">
            {/* Mobile Menu Header with Close Button */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <span className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="size-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Section for Mobile */}
            {user && (
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-900 truncate uppercase text-sm tracking-tight">
                    {user.full_name}
                  </p>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Xem hồ sơ cá nhân
                  </Link>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="grid gap-2">
              <Link
                href="/listings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-slate-900 font-bold transition-all border border-transparent hover:border-slate-100"
              >
                <Home className="w-5 h-5 text-primary" />
                Thuê nhà
              </Link>
              <Link
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-slate-900 font-bold transition-all border border-transparent hover:border-slate-100"
              >
                <Search className="w-5 h-5 text-primary" />
                Mua nhà
              </Link>
              <Link
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 text-slate-900 font-bold transition-all border border-transparent hover:border-slate-100"
              >
                <Users className="w-5 h-5 text-primary" />
                Tìm môi giới
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="pt-4 space-y-3">
              {!user ? (
                <Link
                  href={`/login?redirect=${pathname}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all uppercase tracking-widest text-sm"
                >
                  Đăng nhập ngay
                </Link>
              ) : (
                <>
                  <Link
                    href="/listing-create"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all uppercase tracking-widest text-sm"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Đăng tin mới
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-14 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 transition-all uppercase tracking-widest text-sm"
                    >
                      Quản trị hệ thống
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full h-14 bg-red-50 text-red-600 font-black rounded-2xl transition-all uppercase tracking-widest text-sm border border-red-100"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </>
              )}
            </div>

            <div className="pt-8 text-center uppercase tracking-tighter text-[10px] text-slate-400 font-bold">
              &copy; 2024 RentalHome. All rights reserved.
            </div>
          </div>
        </div>
      </ModalPortal>

      <FavoriteDrawer
        isOpen={isFavoriteOpen}
        onClose={() => setIsFavoriteOpen(false)}
      />
    </header>
  );
}
