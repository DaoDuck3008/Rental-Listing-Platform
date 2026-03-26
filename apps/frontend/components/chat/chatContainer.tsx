"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import ChatWindow from "./chatWindow";
import ChatList from "./chatList";
import Avatar from "@/components/common/avatar";
import { MessageCircle, X } from "lucide-react";
import clsx from "clsx";

export default function ChatContainer() {
  const { user, access_token } = useAuthStore();
  const { 
    activeChats, 
    allChats,
    collapsedChats, 
    isListOpen,
    initSocket, 
    disconnectSocket, 
    toggleCollapse,
    closeChat,
    setListOpen
  } = useChatStore();

  const totalUnread = allChats.reduce((count, chat) => {
    const lastMsg = chat.messages?.[0];
    if (lastMsg && !lastMsg.is_read && lastMsg.sender_id !== user?.id) {
      return count + 1;
    }
    return count;
  }, 0);

  useEffect(() => {
    if (user && access_token) {
      initSocket(access_token);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [user, access_token, initSocket, disconnectSocket]);

  if (!user) return null;

  return (
    <div className="fixed bottom-0 right-5 z-50 flex items-end gap-3 pointer-events-none">
      {/* List of active chat windows */}
      <div className="flex items-end gap-3 pointer-events-auto">
        {activeChats.map((chat) => (
          <ChatWindow 
            key={chat.id} 
            chat={chat} 
            isCollapsed={collapsedChats.includes(chat.id)} 
          />
        ))}
      </div>

      {/* Stack of collapsed icons & Main Bubble & Chat List*/}
      <div className="flex flex-col-reverse items-end gap-3 mb-5 pointer-events-auto">
        <div className="relative pointer-events-auto">
          {/* Main Chat Bubble */}
          <div 
            onClick={() => setListOpen(!isListOpen)}
            className="size-14 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all group relative border border-white/20"
          >
               <MessageCircle size={28} />
               {totalUnread > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                   {totalUnread}
                 </span>
               )}
               <span className="absolute right-full mr-3 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {totalUnread > 0 ? `Bạn có ${totalUnread} tin nhắn mới` : "Thư mục tin nhắn"}
               </span>
          </div>
          
          {/* Render List Popover if open */}
          {isListOpen && (
            <div className="absolute bottom-16 right-0">
               <ChatList />
            </div>
          )}
        </div>

        {/* Icons for active/collapsed chats */}
        {activeChats.map((chat) => {
          const isCollapsed = collapsedChats.includes(chat.id);
          const otherUser = chat.owner_id === user?.id ? chat.tenant : chat.owner;
          
          if (!isCollapsed && activeChats.length > 0) return null;

          return (
            <div key={chat.id} className="relative group">
              <div
                onClick={() => toggleCollapse(chat.id)}
                className={clsx(
                  "size-12 rounded-full border-2 border-white shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-hidden",
                  isCollapsed ? "animate-bounce-subtle" : ""
                )}
              >
                <Avatar avatar={otherUser?.avatar} name={otherUser?.full_name} />
              </div>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    closeChat(chat.id);
                }}
                className="absolute -top-1 -right-1 size-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
