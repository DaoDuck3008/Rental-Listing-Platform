"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash, Home, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if(process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="size-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
            <ServerCrash size={48} />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-slate-200 mb-2 select-none">500</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          Oops! Có lỗi kỹ thuật xảy ra
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Hệ thống gặp sự cố trong quá trình xử lý yêu cầu của bạn. Đội ngũ kỹ thuật của chúng tôi đã ghi nhận và đang khẩn trương khắc phục.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCcw size={18} />
            Thử tải lại trang
          </button>
          
          <Link
             href="/"
             className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Home size={18} />
            Về trang chủ an toàn
          </Link>
        </div>
      </div>
    </div>
  );
}
