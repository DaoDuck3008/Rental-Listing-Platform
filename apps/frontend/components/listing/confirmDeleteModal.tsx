import { ArchiveX, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  nameTarget?: string;
  message?: string;
  OnClose: () => void;
  OnSubmit: () => void;
}

export default function ConfirmDeleteModal({
  nameTarget,
  message,
  OnClose,
  OnSubmit,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"></div>
      <div className="relative w-full max-w-md bg-white  rounded-2xl shadow-2xl border border-slate-200  overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100 ">
              <span className="material-symbols-outlined text-red-600  text-4xl">
                <ArchiveX size={30} />
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900  mb-2">
              Xác nhận xóa {nameTarget ?? "Bài đăng"}?
            </h3>
            <p className="text-slate-600  text-sm leading-relaxed">
              {message ??
                "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa bài đăng này không?"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-6 pt-2">
          <button
            onClick={OnClose}
            className="flex-1 h-11 px-6 rounded-xl border border-slate-200  bg-white  text-slate-700  text-sm font-bold hover:bg-slate-50  transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={OnSubmit}
            className="flex-1 h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
          >
            Xóa bài đăng
          </button>
        </div>
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600  transition-colors"
          onClick={OnClose}
        >
          <span className="material-symbols-outlined text-xl">
            <X />
          </span>
        </button>
      </div>
    </div>
  );
}
