"use client";

import { Notification } from "@/types/notification.type";
import { 
    Heart, 
    MessageSquare, 
    CheckCircle, 
    AlertTriangle, 
    Trash2, 
    Clock, 
    Bell
} from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";

interface NotificationCardProps {
    n: Notification;
    onClick: () => void;
    onDelete: () => void;
}

const formatTime = (dateStr: any) => {
    if (!dateStr) return "Vừa xong";
    const date = new Date(dateStr);
    if (!isValid(date)) return "Vừa xong";
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};

export default function NotificationCard({ n, onClick, onDelete }: NotificationCardProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "NEW_MESSAGE": 
                return (
                    <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                );
            case "NEW_FAVORITE": 
                return (
                    <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                );
            case "NEW_APPROVED": 
                return (
                    <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                );
            case "NEW_REJECTED": 
                return (
                    <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                );
            default: 
                return (
                    <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Bell className="w-6 h-6" />
                    </div>
                );
        }
    };

    return (
        <div 
            className={clsx(
                "group bg-white border border-slate-200 rounded-[24px] p-4 flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/20 relative cursor-pointer overflow-hidden",
                !n.is_read && "border-l-[6px] border-l-blue-500 bg-blue-50/10 shadow-sm"
            )}
            onClick={onClick}
        >
            {/* Pulse for unread */}
            {!n.is_read && (
                <div className="absolute top-4 right-4 animate-pulse">
                    <div className="size-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </div>
            )}

            <div className="shrink-0 transition-transform group-hover:scale-105 duration-300">
                {getIcon(n.type)}
            </div>
            
            <div className="flex-1 min-w-0">
                <p className={clsx(
                    "text-[15px] leading-snug break-words mb-1.5",
                    !n.is_read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"
                )}>
                    {n.content}
                </p>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(n.created_at || (n as any).createdAt)}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    title="Xóa thông báo"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
