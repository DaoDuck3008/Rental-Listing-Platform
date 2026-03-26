"use client";

import { X, Heart, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatVietnamesePrice } from "@/utils/formatters";
import { useSWRConfig } from "swr";
import { useAuthStore } from "@/store/auth.store";
import useSWR from "swr";
import { getMyFavorites } from "@/services/user.api";
import { toggleFavoriteListing } from "@/services/listing.api";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ModalPortal from "../ui/modalPortal";

interface FavoriteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoriteDrawer({
  isOpen,
  onClose,
}: FavoriteDrawerProps) {
  const { user, hydrated } = useAuthStore();
  const { mutate } = useSWRConfig();

  const {
    data,
    isLoading,
    mutate: mutateFavs,
  } = useSWR(
    isOpen && hydrated && user ? "my_favorites_drawer" : null,
    () => getMyFavorites(10, 1),
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const favorites = data?.data?.rows || [];

  const handleRemoveFavorite = async (
    e: React.MouseEvent,
    listingId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavoriteListing(listingId);
      toast.info("Đã xóa khỏi danh sách yêu thích");
      mutateFavs();
      mutate("my_favorites");
    } catch (err: any) {
      toast.error("Không thể xóa bài đăng");
    }
  };

  return (
    <ModalPortal>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-9999 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-100 bg-white z-10000 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-red-50 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">
                Yêu thích
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {data?.data?.count || 0} bài đăng đã lưu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-slate-400 mt-4 tracking-wide uppercase">
                Đang tải danh sách...
              </p>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid gap-4">
              {favorites.map((fav: any) => {
                const listing = fav.listing;
                if (!listing) return null;
                return (
                  <Link
                    key={fav.id}
                    href={`/listing-detail/${listing.id}`}
                    onClick={onClose}
                    className="flex gap-4 p-3 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                  >
                    <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={
                          listing.images?.[0]?.image_url || "/placeholder.png"
                        }
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors pr-6 uppercase tracking-tight">
                          {listing.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 font-medium leading-relaxed">
                          {listing.address}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary text-sm font-black">
                          {formatVietnamesePrice(Number(listing.price))}
                        </span>
                        <button
                          onClick={(e) => handleRemoveFavorite(e, listing.id)}
                          className="size-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Gỡ khỏi danh sách"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="size-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Heart className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="font-bold text-xl text-slate-900">
                Danh sách trống
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-60 leading-relaxed">
                Khi bạn tìm thấy căn hộ ưng ý, hãy nhấn vào biểu tượng trái tim
                để lưu lại nhé!
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-primary transition-all shadow-lg"
              >
                Bắt đầu khám phá
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-white">
            <Link
              href="/profile/my-favorites"
              onClick={onClose}
              className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/25 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 group"
            >
              Xem tất cả danh sách
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
        `}</style>
      </aside>
    </ModalPortal>
  );
}
