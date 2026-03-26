import { TriangleAlert } from "lucide-react";

export default function WarningModal({
  title,
  message,
  OnClose,
  OnSubmit,
  closeLabel = "Kiểm tra lại",
  submitLabel = "Tôi đã hiểu và Đăng bài",
}: {
  title: string;
  message: string;
  OnClose: () => void;
  OnSubmit: () => void;
  closeLabel?: string;
  submitLabel?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-130 bg-white  rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center pt-10 pb-6 px-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 ">
            <span className="material-symbols-outlined text-orange-500  text-[48px]!">
              <TriangleAlert size={40} />
            </span>
          </div>
          <h1 className="text-text-main  tracking-tight text-2xl md:text-3xl font-bold leading-tight text-center pb-4">
            {title}
          </h1>
          <p className="text-slate-600  text-base font-normal leading-relaxed text-center px-2">
            {message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-slate-100  bg-slate-50/50 ">
          <button
            onClick={OnClose}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white  border border-slate-200  text-slate-700  text-base font-bold leading-normal transition-colors hover:bg-slate-50 "
          >
            <span className="truncate">{closeLabel}</span>
          </button>
          <button
            onClick={OnSubmit}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal transition-opacity hover:opacity-90"
          >
            <span className="truncate">{submitLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
