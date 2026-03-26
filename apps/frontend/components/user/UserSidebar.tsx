import {
  Bell,
  Handshake,
  Heart,
  LayoutPanelTop,
  LogOut,
  Newspaper,
  User,
  X,
} from "lucide-react";
import { logout } from "@/services/auth.api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserSidebar({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const currentRoute = usePathname();

  const handleLogout = async () => {
    try {
      const result = await logout();
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
  return (
    <aside
      className="h-full w-72 bg-white border-r border-input-border flex flex-col shadow-2xl lg:shadow-none overflow-y-auto no-scrollbar"
      id="sidebar"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10  rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
              <span className="material-symbols-outlined">
                <Handshake color="#137fec" size={30} />
              </span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-blue-500 whitespace-nowrap">
              Rental House
            </span>
          </Link>
          <button
            className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors p-1 rounded-lg hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="bg-center bg-no-repeat border-blue-500/20 shrink-0">
              {user!.avatar ? (
                <img
                  src={user!.avatar}
                  alt={user!.full_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-600" />
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-text-main text-sm font-bold leading-tight truncate">
                {user!.full_name}
              </h1>
              <p className="text-text-secondary text-xs font-medium truncate">
                Chủ cho thuê
              </p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                currentRoute === "/profile"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-text-secondary hover:bg-slate-100"
              }   shadow-blue-500/20 group transition-all`}
              href="/profile"
            >
              <span className="material-symbols-outlined fill-1">
                <LayoutPanelTop />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                Tổng quan
              </span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                currentRoute === "/profile/listing-management"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-text-secondary hover:bg-slate-100"
              }   shadow-blue-500/20 group transition-all`}
              href="/profile/listing-management"
            >
              <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">
                <Newspaper />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                Quản lý bài đăng
              </span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                currentRoute.startsWith("/profile/personal-information")
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-text-secondary hover:bg-slate-100"
              }   shadow-blue-500/20 group transition-all`}
              href="/profile/personal-information"
            >
              <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">
                <User />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                Hồ sơ cá nhân
              </span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                currentRoute.startsWith("/profile/my-favorites")
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-text-secondary hover:bg-slate-100"
              }   shadow-blue-500/20 group transition-all`}
              href="/profile/my-favorites"
            >
              <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">
                <Heart />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                Tin đã lưu
              </span>
            </Link>
            <Link
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                currentRoute.startsWith("/profile/notifications")
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-text-secondary hover:bg-slate-100"
              }   shadow-blue-500/20 group transition-all`}
              href="/profile/notifications"
            >
              <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">
                <Bell />
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                Thông báo
              </span>
            </Link>
          </nav>
        </div>
      </div>
      <div className="mt-auto p-6 border-t border-input-border flex flex-col gap-2 relative">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
        >
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
            <LogOut />
          </span>
          <span className="text-sm font-bold whitespace-nowrap">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
