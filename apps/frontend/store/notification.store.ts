import { create } from "zustand";
import { Notification } from "@/types/notification.type";
import { 
    getMyNotifications, 
    getUnreadCount, 
    markAllNotificationsAsRead, 
    updateNotificationStatus, 
    deleteNotification 
} from "@/services/notification.api";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    
    fetchNotifications: (limit?: number, page?: number) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    removeNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    },

    fetchNotifications: async (limit = 10, page = 1) => {
        set({ isLoading: true });
        try {
            const res = await getMyNotifications(limit, page);
            if (res.success) {
                set({ 
                    notifications: res.data,
                    pagination: {
                        page: res.pagination?.page || page,
                        limit: res.pagination?.limit || limit,
                        total: res.pagination?.total || 0,
                        totalPages: Math.ceil((res.pagination?.total || 0) / (res.pagination?.limit || limit)) || 1
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const res = await getUnreadCount();
            if (res.success) {
                set({ unreadCount: res.data.count });
            }
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    },

    addNotification: (notification: Notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }));
    },

    markAsRead: async (id: string) => {
        try {
            const res = await updateNotificationStatus(id, true);
            if (res.success) {
                set((state) => ({
                    notifications: state.notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
            }
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    },

    markAllRead: async () => {
        try {
            const res = await markAllNotificationsAsRead();
            if (res.success) {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, is_read: true })),
                    unreadCount: 0
                }));
            }
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    },

    removeNotification: async (id: string) => {
        try {
            const res = await deleteNotification(id);
            if (res.success) {
                const victim = get().notifications.find(n => n.id === id);
                const wasUnread = victim ? !victim.is_read : false;
                
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id),
                    unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
                }));
            }
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    }
}));
