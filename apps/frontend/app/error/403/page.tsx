"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const redirect = searchParams.get("redirect");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="size-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
            <ShieldAlert size={48} />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-slate-200 mb-2 select-none">403</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          Truy cập bị từ chối
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {message || "Bạn không có quyền truy cập vào trang này hoặc phiên làm việc đã hết hạn. Vui lòng liên hệ quản trị viên hoặc quay lại trang trước."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.push(redirect || "/")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Quay lại 
          </button>
          
          <Link
            href="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all active:scale-95"
          >
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
