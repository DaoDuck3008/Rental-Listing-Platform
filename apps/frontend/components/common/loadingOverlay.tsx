"use client";

import { Loader2 } from "lucide-react";

export default function LoadingOverlay({
  message = "Đang xử lý...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300 animate-in fade-in">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="size-12 text-primary animate-spin" />
          <div className="absolute inset-0 size-12 border-4 border-primary/10 rounded-full"></div>
        </div>
        <p className="text-text-main font-bold text-lg animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}
