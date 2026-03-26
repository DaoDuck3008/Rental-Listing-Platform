"use client";

import { useEffect, useState, useRef } from "react";
import {
  X,
  Minus,
  Send,
  User,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getChatMessages,
  sendMessage,
  markAsRead,
  updateMessage,
  deleteMessage,
} from "@/services/chat.api";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import Avatar from "@/components/common/avatar";
import WarningModal from "@/components/ui/warningModal";
import clsx from "clsx";
import { handleError } from "@/utils";

interface ChatWindowProps {
  chat: any;
  isCollapsed: boolean;
}

export default function ChatWindow({ chat, isCollapsed }: ChatWindowProps) {
  const { user } = useAuthStore();
  const {
    closeChat,
    toggleCollapse,
    markMessageAsReadLocally,
    setChatMessages,
  } = useChatStore();
  const messages = chat.messages || [];
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [msgToDeleteId, setMsgToDeleteId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lấy thông tin người đối diện
  const otherUser = chat.owner_id === user?.id ? chat.tenant : chat.owner;
  const otherUserName = otherUser?.full_name || "Người dùng";
  const otherUserAvatar = otherUser?.avatar || null;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getChatMessages(chat.id);
        if (res.success) {
          setChatMessages(chat.id, res.data.reverse());
        }
      } catch (error) {
        handleError(error, "Failed to fetch messages");
      }
    };

    fetchMessages();
  }, [chat.id, setChatMessages]);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isCollapsed]);

  // Đánh dấu đã đọc cho các tin nhắn của người khác
  useEffect(() => {
    if (isCollapsed || messages.length === 0 || !user?.id) return;

    const unreadMessages = messages.filter(
      (m: any) => m.is_read === false && (m.sender_id || m.senderId) !== user.id
    );

    unreadMessages.forEach(async (msg: any) => {
      try {
        await markAsRead(msg.id);
        markMessageAsReadLocally(chat.id, msg.id);
      } catch (error) {
        handleError(error, "Failed to mark message as read");
      }
    });
  }, [messages, isCollapsed, user?.id, chat.id, markMessageAsReadLocally]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      const res = await sendMessage(chat.id, inputValue);
      if (res.success) {
        setInputValue("");
      }
    } catch (error) {
      handleError(error, "Failed to send message");
    }
  };

  const handleUpdate = async (messageId: string) => {
    if (!editValue.trim()) return;
    try {
      const res = await updateMessage(messageId, editValue);
      if (res.success) {
        setEditingId(null);
        setEditValue("");
      }
    } catch (error) {
      handleError(error, "Failed to update message");
    }
  };

  const handleDelete = (messageId: string) => {
    setMsgToDeleteId(messageId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!msgToDeleteId) return;
    try {
      await deleteMessage(msgToDeleteId);
      setIsDeleteModalOpen(false);
      setMsgToDeleteId(null);
    } catch (error) {
      handleError(error, "Failed to delete message");
    }
  };

  if (isCollapsed) return null;

  return (
    <div className="flex flex-col w-80 h-96 bg-white border border-slate-200 rounded-t-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0">
        <div className="flex items-center gap-2">
          <Avatar avatar={otherUserAvatar} name={otherUserName} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-bold truncate max-w-40">
              {otherUserName}
            </span>
            <span className="text-[10px] opacity-80">
              {otherUser.role.code === "LANDLORD" ? "Chủ nhà" : "Người thuê"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleCollapse(chat.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => closeChat(chat.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
      {/* Messages list */}
      <div
        ref={scrollRef}
        className="grow p-4 overflow-y-auto space-y-4 bg-slate-50"
      >
        {messages.map((msg: any) => {
          const senderId = msg.sender_id || msg.senderId;
          const isMine = senderId === user?.id;
          const createdAt = msg.created_at || msg.createdAt;
          const updatedAt = msg.updated_at || msg.updatedAt;
          const isEdited =
            updatedAt &&
            new Date(updatedAt).getTime() - new Date(createdAt).getTime() >
              5000;
          const canEdit =
            isMine &&
            new Date().getTime() - new Date(createdAt).getTime() <
              15 * 60 * 1000;

          return (
            <div
              key={msg.id}
              className={clsx(
                "flex flex-col max-w-[85%] group relative",
                isMine ? "ml-auto items-end" : "items-start"
              )}
            >
              {isEdited && (
                <span className="text-[9px] font-bold text-slate-400 mb-0.5 px-2 uppercase">
                  Edited
                </span>
              )}

              <div
                className={clsx(
                  "flex items-center gap-1",
                  isMine ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={clsx(
                    "px-3 py-2 rounded-2xl text-sm wrap-break-word shadow-sm relative",
                    isMine
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}
                >
                  {editingId === msg.id ? (
                    <div className="flex flex-col gap-2 min-w-37.5">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-white/10 text-white border border-white/20 rounded p-1 text-xs outline-none resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-white/70 hover:text-white"
                        >
                          <XCircle size={14} />
                        </button>
                        <button
                          onClick={() => handleUpdate(msg.id)}
                          className="text-white hover:scale-110"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {isMine && !editingId && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col shrink-0">
                    <button
                      onClick={() =>
                        setShowMenuId(showMenuId === msg.id ? null : msg.id)
                      }
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200"
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {showMenuId === msg.id && (
                      <div className="absolute right-0 bottom-full mb-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {canEdit && (
                          <button
                            onClick={() => {
                              setEditingId(msg.id);
                              setEditValue(msg.content);
                              setShowMenuId(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50 transition-colors border-b border-slate-100"
                          >
                            <Pencil size={12} />
                            Sửa
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDelete(msg.id);
                            setShowMenuId(null);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1">
                {createdAt
                  ? new Date(createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
            <User size={40} className="mb-2" />
            <p className="text-xs">Chưa có tin nhắn nào</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="grow bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className="size-8 rounded-full bg-primary text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          <Send size={16} />
        </button>
      </div>

      {isDeleteModalOpen && (
        <WarningModal
          title="Xóa tin nhắn"
          message="Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác."
          OnClose={() => {
            setIsDeleteModalOpen(false);
            setMsgToDeleteId(null);
          }}
          OnSubmit={confirmDelete}
          closeLabel="Hủy"
          submitLabel="Xóa tin nhắn"
        />
      )}
    </div>
  );
}
