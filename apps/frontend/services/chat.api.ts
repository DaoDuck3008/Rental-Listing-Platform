import { api } from "./api";

export const createChat = async (targetId: string) => {
    const response = await api.post("/api/chats", { targetId });
    return response.data;
};

export const getMyChats = async () => {
    const response = await api.get("/api/chats");
    return response.data;
};

export const getChatMessages = async (chatId: string, limit = 20, page = 1) => {
    const response = await api.get(
        `/api/chats/${chatId}/messages?limit=${limit}&page=${page}`
    );
    return response.data;
};

export const sendMessage = async (chatId: string, content: string, messageType = "text") => {
    const response = await api.post(
        `/api/chats/${chatId}/messages`,
        { content, messageType }
    );
    return response.data;
};

export const markAsRead = async (messageId: string) => {
    const response = await api.patch(
        `/api/chats/messages/${messageId}/read`,
        {}
    );
    return response.data;
};

export const updateMessage = async (messageId: string, content: string) => {
    const response = await api.patch(
        `/api/chats/messages/${messageId}`,
        { content }
    );
    return response.data;
};

export const deleteMessage = async (messageId: string) => {
    const response = await api.delete(`/api/chats/messages/${messageId}`);
    return response.data;
};
