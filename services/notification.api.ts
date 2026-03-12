import { api } from "./api";

export const getMyNotifications = async (limit = 20, page = 1) => {
    const response = await api.get(
        `/api/notifications?limit=${limit}&page=${page}`
    );
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get("/api/notifications/unread-count");
    return response.data;
};

export const updateNotificationStatus = async (id: string, isRead: boolean) => {
    const response = await api.patch(
        `/api/notifications/${id}/status`,
        { isRead }
    );
    return response.data;
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch(
        "/api/notifications/mark-all-read",
        {}
    );
    return response.data;
};

export const deleteNotification = async (id: string) => {
    const response = await api.delete(`/api/notifications/${id}`);
    return response.data;
};
