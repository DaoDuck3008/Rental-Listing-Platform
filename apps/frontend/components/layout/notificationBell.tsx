"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { formatDistanceToNow, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ModalPortal from "../ui/modalPortal";
import {
  X,
  Bell,
  Check,
  Trash2,
  MessageSquare,
  Heart,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const formatTime = (dateStr: any) => {
  if (!dateStr) return "Vừa xong";
  const date = new Date(dateStr);
  if (!isValid(date)) return "Vừa xong";
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllRead,
    removeNotification,
    isLoading,
  } = useNotificationStore();
  const user = useAuthStore((s) => s.user);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

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

  const getIcon = (type: string) => {
    switch (type) {
      case "NEW_MESSAGE":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "NEW_FAVORITE":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "NEW_APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "NEW_REJECTED":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleNotificationClick = async (n: any) => {
    if (!n.is_read) {
      await markAsRead(n.id);
    }
    
    // NEW_MESSAGE: Mở khung chat
    if (n.type === "NEW_MESSAGE" && n.reference_id) {
        const { allChats, openChat, fetchAllChats } = useChatStore.getState();
        let targetChat = allChats.find(c => c.id === n.reference_id);
        
        if (!targetChat) {
            await fetchAllChats();
            targetChat = useChatStore.getState().allChats.find(c => c.id === n.reference_id);
        }
        
        if (targetChat) {
            openChat(targetChat);
            handleClose();
            return;
        }
    }

    // NEW_REJECTED: Chuyển hướng đến trang chi tiết tin đăng của chủ nhà
    if (n.type === "NEW_REJECTED" && n.reference_id) {
      router.push(`/profile/my-listing-detail/${n.reference_id}`);
      handleClose();
      return;
    }

    // OTHERS: NEW_FAVORITE, NEW_APPROVED
    if (["NEW_FAVORITE", "NEW_APPROVED"].includes(n.type) && n.reference_id) {
      router.push(`/listing-detail/${n.reference_id}`);
      handleClose();
      return;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all group"
      >
        <Bell className={clsx("w-6 h-6", isOpen && "text-primary")} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 size-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <ModalPortal>
        {/* Overlay */}
        <div
          className={clsx(
            "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-9999 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={handleClose}
        />

        {/* Drawer */}
        <aside
          className={clsx(
            "fixed top-0 right-0 h-full w-full max-w-sm bg-white z-10000 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-extrabold text-xl text-slate-900">
                  Thông báo
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Bạn có {unreadCount} thông báo mới
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="size-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Actions bar */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100">
              <button
                onClick={() => markAllRead()}
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Đánh dấu tất cả đã đọc
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-tighter">
                  Đang tải...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-10">
                <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Bell className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  Chưa có thông báo
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Chúng tôi sẽ gửi thông báo cho bạn khi có cập nhật mới.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(
                      "p-5 border-b border-slate-50 flex gap-4 hover:bg-slate-50/80 transition-all relative group cursor-pointer",
                      !n.is_read && "bg-blue-50/20"
                    )}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="shrink-0">
                      <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                        {getIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={clsx(
                          "text-sm leading-relaxed wrap-break-word mb-2",
                          !n.is_read
                            ? "text-slate-900 font-bold"
                            : "text-slate-600"
                        )}
                      >
                        {n.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {formatTime(n.created_at || (n as any).createdAt)}
                        </span>
                        {!n.is_read && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      className="absolute right-4 top-5 p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white">
            <Link
              href="/profile/notifications"
              className="w-full h-12 bg-slate-900 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg group"
              onClick={handleClose}
            >
              Xem tất cả thông báo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #e2e8f0;
          }
        `}</style>
      </ModalPortal>
    </>
  );
}
