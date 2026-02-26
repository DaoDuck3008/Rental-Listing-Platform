"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="size-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
            <FileQuestion size={48} />
          </div>
        </div>
        
        <h1 className="text-8xl font-black text-slate-200 mb-2 select-none">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
          Không tìm thấy trang
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Quay lại trang trước
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
          >
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
