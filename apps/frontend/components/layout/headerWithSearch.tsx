"use client";

import {
  Menu,
  Heart,
  X,
  Home,
  Search,
  LogOut,
  User as UserIcon,
  PlusCircle,
  MapPin,
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
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "./notificationBell";

export default function AppHeaderWithSearch() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const pathname = usePathname();
  const router = useRouter();
  const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { favoriteIds } = useFavorites();
  const [keyword, setKeyword] = useState("");
  const [selectedCity, setSelectedCity] = useState("Hà Nội");

  const cityOptions = [
    { label: "TP Hà Nội", value: "Hà Nội" },
    { label: "TP Hồ Chí Minh", value: "Hồ Chí Minh" },
    { label: "Đà Nẵng", value: "Đà Nẵng" },
    { label: "Cần Thơ", value: "Cần Thơ" },
    { label: "Nha Trang", value: "Nha Trang" },
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.append("keyword", keyword.trim() || selectedCity);
    router.push(`/listings?${params.toString()}`);
    setKeyword("");
    setIsMenuOpen(false);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const params = new URLSearchParams();
    params.append("keyword", city);
    router.push(`/listings?${params.toString()}`);
    setKeyword("");
    setIsMenuOpen(false);
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <header className="sticky top-0 z-60 w-full border-b border-slate-200 bg-background-light/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-10">
        <Link
          href="/"
          className="relative z-70 flex cursor-pointer items-center text-slate-900"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="text-primary flex items-center justify-center">
            <img src="/logo_white_bg.png" alt="Logo" width={70} height={70} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#1e4263]">
            DaoDuck<span className="text-[#e4a265]">Rental</span>
          </h2>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-around gap-3">
          <div className="flex h-11 items-center rounded-full border-2 border-slate-300 bg-white/95 px-2 shadow-sm">
            <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1">
              <MapPin className="h-4 w-4 text-primary" />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="h-6 min-w-32 border-none bg-transparent text-xs font-bold text-slate-700 outline-none"
              >
                {cityOptions.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mx-2 h-6 w-px bg-slate-300" />
            <Search className="mr-2 h-4 w-4 text-primary" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder="Tìm theo khu vực, đường phố..."
              className="w-56 border-none bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500 lg:w-72"
            />
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={() => setIsFavoriteOpen(true)}
                className="group relative rounded-full p-2 text-slate-600 transition-all hover:bg-red-50 hover:text-red-500"
                title="Danh sách yêu thích"
              >
                <Heart className="h-6 w-6 transition-all group-hover:fill-current" />
                {favoriteIds.length > 0 && (
                  <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
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
                  className="flex h-10 items-center justify-center rounded-lg bg-slate-200 px-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-300"
                >
                  Đăng nhập
                </Link>
                <Link
                  href={`/register?redirect=${pathname}`}
                  className="flex h-10 items-center justify-center rounded-lg bg-slate-200 px-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-300"
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

        <div className="md:hidden relative z-70 flex items-center gap-2">
          {user && (
            <button
              onClick={() => setIsFavoriteOpen(true)}
              className="relative p-2 text-slate-600 transition-all hover:text-red-500"
            >
              <Heart
                className={`h-6 w-6 ${
                  favoriteIds.length > 0 ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {favoriteIds.length > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full border border-white bg-red-500 text-[8px] font-black text-white">
                  {favoriteIds.length}
                </span>
              )}
            </button>
          )}
          {user && <NotificationBell />}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-slate-900 transition-colors hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <ModalPortal>
        <div
          className={`md:hidden fixed inset-0 z-65 bg-white transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "pointer-events-none -translate-y-full opacity-0"
          }`}
          style={{ top: "0" }}
        >
          <div className="flex h-full flex-col space-y-6 overflow-y-auto p-5 pt-18">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Menu
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex size-10 items-center justify-center rounded-full bg-slate-50 text-slate-900 transition-colors hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 text-primary">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-7 w-7" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black uppercase tracking-tight text-slate-900">
                    {user.full_name}
                  </p>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Xem hồ sơ cá nhân
                  </Link>
                </div>
              </div>
            )}

            <nav className="grid gap-2">
              <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Tìm theo từ khóa..."
                    className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700"
                >
                  {cityOptions.map((city) => (
                    <option key={city.value} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSearch}
                  className="h-10 w-full rounded-lg bg-primary text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  Tìm kiếm
                </button>
              </div>

              <Link
                href="/listings"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 rounded-xl border border-transparent p-4 font-bold text-slate-900 transition-all hover:border-slate-100 hover:bg-slate-50"
              >
                <Home className="h-5 w-5 text-primary" />
                Thuê nhà
              </Link>
            </nav>

            <div className="space-y-3 pt-4">
              {!user ? (
                <Link
                  href={`/login?redirect=${pathname}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all"
                >
                  Đăng nhập ngay
                </Link>
              ) : (
                <>
                  <Link
                    href="/listing-create"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/10 transition-all"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Đăng tin mới
                  </Link>

                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/10 transition-all"
                    >
                      Quản trị hệ thống
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-sm font-black uppercase tracking-widest text-red-600 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Đăng xuất
                  </button>
                </>
              )}
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
