import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "./notification.store";

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "image" | "file";
  is_read: boolean;
  created_at: string;
}

interface Chat {
  id: string;
  owner_id: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
  owner?: any;
  tenant?: any;
  messages?: Message[];
}

interface ChatState {
  socket: Socket | null;
  activeChats: Chat[];
  allChats: Chat[];
  collapsedChats: string[];
  isListOpen: boolean;
  
  initSocket: (token: string) => void;
  disconnectSocket: () => void;
  fetchAllChats: () => Promise<void>;
  openChat: (chat: Chat) => void;
  closeChat: (chatId: string) => void;
  setListOpen: (open: boolean) => void;
  toggleCollapse: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  markMessageAsReadLocally: (chatId: string, messageId: string) => void;
  updateMessageLocally: (chatId: string, message: Message) => void;
  removeMessageLocally: (chatId: string, messageId: string) => void;
  setChatMessages: (chatId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  activeChats: [],
  allChats: [],
  collapsedChats: [],
  isListOpen: false,

  initSocket: (token: string) => {
    const { socket: existingSocket } = get();

    // Nếu socket đã tồn tại, cập nhật token mới và kết nối lại nếu đang ngắt kết nối
    if (existingSocket) {
      existingSocket.auth = { token };
      if (!existingSocket.connected) {
        existingSocket.connect();
      }
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
      transports: ["polling", "websocket"], 
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected to Chat Server", socket.id);
      get().fetchAllChats();
    });

    socket.on("connect_error", async (error) => {
      const isAuthError = 
        error.message === "Invalid token" || 
        error.message === "No token provided" || 
        error.message.includes("websocket error"); 

      if (!isAuthError) {
        console.error("[Socket] Connection Error:", error);
      }
      
      if (isAuthError) {
        try {
          const { refresh } = await import("@/services/auth.api");
          const res = await refresh();
          if (res.data?.access_token) {
            const { useAuthStore } = await import("./auth.store");
            useAuthStore.getState().setAuth(res.data.access_token, useAuthStore.getState().user!);
          }
        } catch (refreshError) {
          console.error("[Socket] Auto-refresh failed:", refreshError);
        }
      }
    });

    socket.on("new_message", (data: { chatId: string; message: Message }) => {
      console.log("[Socket] Received new_message:", data);
      get().addMessage(data.chatId, data.message);
    });

    socket.on("message_read", (data: { messageId: string; chatId: string; readerId: string }) => {
      get().markMessageAsReadLocally(data.chatId, data.messageId);
    });

    socket.on("chat_deleted", (data: { chatId: string }) => {
      get().closeChat(data.chatId);
    });

    socket.on("message_updated", (data: { chatId: string; message: Message }) => {
      get().updateMessageLocally(data.chatId, data.message);
    });

    socket.on("message_deleted", (data: { chatId: string; messageId: string }) => {
      get().removeMessageLocally(data.chatId, data.messageId);
    });

    socket.on("new_notification", (notification: any) => {
      console.log("[Socket] Received new_notification:", notification);
      useNotificationStore.getState().addNotification(notification);
    });

    socket.on("all_notifications_read", () => {
      useNotificationStore.getState().fetchUnreadCount();
      useNotificationStore.getState().fetchNotifications();
    });

    set({ socket });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },

  fetchAllChats: async () => {
    try {
      const { getMyChats } = await import("@/services/chat.api");
      const res = await getMyChats();
      if (res.success) {
        set({ allChats: res.data });
      }
    } catch (error) {
      console.error("Failed to fetch all chats", error);
    }
  },

  setListOpen: (open: boolean) => set({ isListOpen: open }),

  openChat: (chat: Chat) => {
    const { activeChats } = get();
    if (!activeChats.find((c) => c.id === chat.id)) {
      set({ activeChats: [...activeChats, chat].slice(-3) }); 
    }
    
    set((state) => ({
      collapsedChats: state.collapsedChats.filter(id => id !== chat.id),
      isListOpen: false
    }));
  },

  closeChat: (chatId: string) => {
    set((state) => ({
      activeChats: state.activeChats.filter((c) => c.id !== chatId),
      collapsedChats: state.collapsedChats.filter((id) => id !== chatId),
    }));
  },

  toggleCollapse: (chatId: string) => {
    set((state) => {
      const isCollapsed = state.collapsedChats.includes(chatId);
      return {
        collapsedChats: isCollapsed
          ? state.collapsedChats.filter((id) => id !== chatId)
          : [...state.collapsedChats, chatId],
      };
    });
  },

  addMessage: (chatId: string, message: Message) => {
    set((state) => {
      const newActiveChats = state.activeChats.map((chat) => {
        if (chat.id === chatId) {
          const messageExists = chat.messages?.some(m => m.id === message.id);
          if (messageExists) return chat;
          return { ...chat, messages: [...(chat.messages || []), message] };
        }
        return chat;
      });

      const newAllChats = state.allChats.map((chat) => {
        if (chat.id === chatId) {
           return { ...chat, messages: [message] };
        }
        return chat;
      });

      if (!state.allChats.some(c => c.id === chatId)) {
        get().fetchAllChats();
      }

      return {
        activeChats: newActiveChats,
        allChats: newAllChats,
      };
    });
  },

  markMessageAsReadLocally: (chatId: string, messageId: string) => {
    set((state) => ({
      activeChats: state.activeChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages?.map((m) =>
              m.id === messageId || (m as any)._id === messageId ? { ...m, is_read: true } : m
            ),
          };
        }
        return chat;
      }),
      allChats: state.allChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages?.map((m) =>
              m.id === messageId || (m as any)._id === messageId ? { ...m, is_read: true } : m
            ),
          };
        }
        return chat;
      }),
    }));
  },

  updateMessageLocally: (chatId: string, message: Message) => {
    set((state) => ({
      activeChats: state.activeChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages?.map((m) =>
              m.id === message.id ? message : m
            ),
          };
        }
        return chat;
      }),
      allChats: state.allChats.map((chat) => {
        if (chat.id === chatId && chat.messages?.[0]?.id === message.id) {
          return { ...chat, messages: [message] };
        }
        return chat;
      }),
    }));
  },

  removeMessageLocally: (chatId: string, messageId: string) => {
    set((state) => {
      const chatWasUpdated = state.allChats.find(c => c.id === chatId && c.messages?.[0]?.id === messageId);
      
      const nextState = {
        activeChats: state.activeChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages?.filter((m) => m.id !== messageId),
            };
          }
          return chat;
        }),
        allChats: state.allChats.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages?.filter((m) => m.id !== messageId),
            };
          }
          return chat;
        }),
      };

      // Nếu tin nhắn bị xóa là tin nhắn cuối hiện preview, re-fetch để lấy tin nhắn mới nhất thật sự
      if (chatWasUpdated) {
        get().fetchAllChats();
      }

      return nextState;
    });
  },

  setChatMessages: (chatId: string, messages: Message[]) => {
    set((state) => ({
      activeChats: state.activeChats.map((chat) =>
        chat.id === chatId ? { ...chat, messages } : chat
      ),
    }));
  },
}));
