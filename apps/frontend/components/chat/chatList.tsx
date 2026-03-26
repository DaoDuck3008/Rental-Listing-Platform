"use client";

import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import Avatar from "@/components/common/avatar";
import { X, MessageSquareText } from "lucide-react";
import clsx from "clsx";

export default function ChatList() {
  const { user } = useAuthStore();
  const { allChats, isListOpen, setListOpen, openChat } = useChatStore();

  if (!isListOpen) return null;

  return (
    <div className="flex flex-col w-80 h-125 max-h-[80vh] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <MessageSquareText size={20} className="text-primary" />
          Tin nhắn của bạn
        </h3>
        <button
          onClick={() => setListOpen(false)}
          className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* List of Chats */}
      <div className="grow overflow-y-auto">
        {allChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-80 px-4 text-center">
            <MessageSquareText size={48} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">Chưa có cuộc trò chuyện nào</p>
            <p className="text-xs mt-1">
              Các cuộc trò chuyện với chủ nhà hoặc người thuê sẽ hiển thị ở đây.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {allChats.map((chat) => {
              const otherUser =
                chat.owner_id === user?.id ? chat.tenant : chat.owner;
              const lastMessage = chat.messages?.[0]; // Lấy tin nhắn mới nhất

              // Kiểm tra xem tin nhắn cuối có bị unread bởi chính current user không
              const isUnread =
                lastMessage &&
                !lastMessage.is_read &&
                lastMessage.sender_id !== user?.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="relative shrink-0">
                    <Avatar
                      avatar={otherUser?.avatar || null}
                      name={otherUser?.full_name || "U"}
                      size="md"
                    />
                  </div>
                  <div className="flex flex-col grow overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 truncate">
                        {otherUser?.full_name || "Người dùng"}
                      </span>
                      {lastMessage && (
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {new Date(
                            lastMessage.created_at ||
                              (lastMessage as any).createdAt
                          ).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p
                        className={clsx(
                          "text-xs truncate pr-2",
                          isUnread
                            ? "font-bold text-slate-800"
                            : "text-slate-500"
                        )}
                      >
                        {lastMessage?.sender_id === user?.id && "Bạn: "}
                        {lastMessage ? lastMessage.content : "Chưa có tin nhắn"}
                      </p>
                      {isUnread && (
                        <span className="size-2.5 bg-primary rounded-full shrink-0"></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
