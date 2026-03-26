import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ReviewActionModalProps {
  type: "APPROVE" | "REJECT";
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (reason?: string) => void;
}

export default function ReviewActionModal({
  type,
  isLoading,
  onClose,
  onSubmit,
}: ReviewActionModalProps) {
  const [reason, setReason] = useState("");

  const isReject = type === "REJECT";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div 
              className={`mb-4 flex size-16 items-center justify-center rounded-full ${
                isReject ? "bg-red-100" : "bg-emerald-100"
              }`}
            >
              {isReject ? (
                <AlertCircle size={30} className="text-red-600" />
              ) : (
                <CheckCircle size={30} className="text-emerald-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {isReject ? "Từ chối bài đăng?" : "Duyệt bài đăng?"}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              {isReject 
                ? "Vui lòng cho biết lý do từ chối để gửi thông báo cho người đăng."
                : "Bài đăng này sẽ được hiển thị công khai trên hệ thống."}
            </p>

            {isReject && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 p-6 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(isReject ? reason : undefined)}
            disabled={isLoading || (isReject && !reason.trim())}
            className={`flex-1 h-11 px-6 rounded-xl text-white text-sm font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${
              isReject 
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20" 
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
            }`}
          >
            {isLoading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              isReject ? "Xác nhận từ chối" : "Xác nhận duyệt"
            )}
          </button>
        </div>
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
