"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { 
    Bell, 
    Check, 
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";
import { isToday } from "date-fns";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import NotificationCard from "@/components/notification/NotificationCard";

export default function NotificationsPage() {
    const { 
        notifications, 
        isLoading, 
        pagination,
        fetchNotifications, 
        markAsRead, 
        markAllRead, 
        removeNotification 
    } = useNotificationStore();
    const { user, hydrated } = useAuthStore();
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [page, setPage] = useState<number>(1);
    const limit = 10;

    useEffect(() => {
        if (hydrated && !user) {
            router.push("/login?redirect=/profile/notifications");
        }
    }, [user, hydrated, router]);

    useEffect(() => {
        if (user) {
            fetchNotifications(limit, page);
        }
    }, [user, fetchNotifications, page]);

    const filteredNotifications = notifications.filter(n => {
        if (filter === "unread") return !n.is_read;
        return true;
    });

    const sortedNotifications = [...filteredNotifications].sort((a, b) => {
        const dateA = new Date(a.created_at || (a as any).createdAt).getTime();
        const dateB = new Date(b.created_at || (b as any).createdAt).getTime();
        return dateB - dateA;
    });

    const todayNotifications = sortedNotifications.filter(n => isToday(new Date(n.created_at || (n as any).createdAt)));
    const earlierNotifications = sortedNotifications.filter(n => !isToday(new Date(n.created_at || (n as any).createdAt)));

    const handleNotificationClick = async (n: any) => {
        if (!n.is_read) {
            await markAsRead(n.id);
        }
        
        if (n.type === "NEW_MESSAGE" && n.reference_id) {
            const { allChats, openChat, fetchAllChats } = useChatStore.getState();
            let targetChat = allChats.find(c => c.id === n.reference_id);
            if (!targetChat) {
                await fetchAllChats();
                targetChat = useChatStore.getState().allChats.find(c => c.id === n.reference_id);
            }
            if (targetChat) {
                openChat(targetChat);
                return;
            }
        }

        if (n.type === "NEW_REJECTED" && n.reference_id) {
            router.push(`/profile/my-listing-detail/${n.reference_id}`);
            return;
        }

        if (["NEW_FAVORITE", "NEW_APPROVED"].includes(n.type) && n.reference_id) {
            router.push(`/listing-detail/${n.reference_id}`);
            return;
        }
    };

    if (!user) return null;

    return (
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-4">
            <div className="flex flex-col gap-8 h-full">
                {/* Page Heading */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">
                            Thông báo
                        </h1>
                        <p className="text-slate-500 text-base font-normal">
                            Cập nhật những hoạt động mới nhất liên quan đến bạn.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 p-1 rounded-xl flex items-center shadow-sm">
                            <button 
                                onClick={() => {
                                    setFilter("all");
                                    setPage(1);
                                }}
                                className={clsx(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    filter === "all" ? "bg-blue-500 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                Tất cả
                            </button>
                            <button 
                                onClick={() => {
                                    setFilter("unread");
                                    setPage(1);
                                }}
                                className={clsx(
                                    "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                    filter === "unread" ? "bg-blue-500 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
                                )}
                            >
                                Chưa đọc
                            </button>
                        </div>
                        
                        {notifications.length > 0 && (
                            <button 
                                onClick={() => markAllRead()}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl transition-all shadow-sm"
                            >
                                <Check className="w-4 h-4" /> Đánh dấu tất cả đã đọc
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex flex-col gap-8">
                    {isLoading ? (
                         <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-24 bg-white border border-slate-200 rounded-3xl animate-pulse" />
                            ))}
                         </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                            <div className="size-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                                <Bell className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Hộp thư trống</h2>
                            <p className="text-slate-500 max-w-xs mx-auto text-sm">
                                Bạn chưa có thông báo nào {filter === "unread" ? "chưa đọc" : ""} vào lúc này.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-8">
                                {/* Today Section */}
                                {todayNotifications.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                            Hôm nay
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </h3>
                                        <div className="grid gap-3">
                                            {todayNotifications.map(n => (
                                                <NotificationCard 
                                                    key={n.id} 
                                                    n={n} 
                                                    onClick={() => handleNotificationClick(n)}
                                                    onDelete={() => removeNotification(n.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Earlier Section */}
                                {earlierNotifications.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                            Trước đó
                                            <div className="h-px flex-1 bg-slate-100" />
                                        </h3>
                                        <div className="grid gap-3">
                                            {earlierNotifications.map(n => (
                                                <NotificationCard 
                                                    key={n.id} 
                                                    n={n} 
                                                    onClick={() => handleNotificationClick(n)}
                                                    onDelete={() => removeNotification(n.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 border-t border-slate-100 bg-slate-50/30 rounded-3xl mt-4">
                                    <div className="text-sm text-slate-500 font-medium">
                                        Trang {pagination.page} / {pagination.totalPages}
                                        <span className="mx-2 text-slate-300">|</span>
                                        Tổng {pagination.total} thông báo
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setPage(1)}
                                            disabled={page === 1}
                                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <ChevronsLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                            disabled={page === 1}
                                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        <div className="flex items-center gap-1 mx-2">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let p = page;
                                                if (page <= 3) p = i + 1;
                                                else if (page >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                                                else p = page - 2 + i;
                                                
                                                if (p < 1 || p > pagination.totalPages) return null;

                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPage(p)}
                                                        className={clsx(
                                                            "size-9 rounded-xl text-sm font-bold transition-all shadow-sm",
                                                            page === p 
                                                                ? "bg-blue-500 text-white shadow-blue-500/20" 
                                                                : "bg-white text-slate-600 hover:border-blue-500/20 border border-slate-200"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                            disabled={page === pagination.totalPages}
                                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPage(pagination.totalPages)}
                                            disabled={page === pagination.totalPages}
                                            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                        >
                                            <ChevronsRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
