"use client";

import { Check, CheckCircle, Home, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  redirectPath?: string;
  delay?: number;
}

export default function SuccessModal({
  isOpen,
  redirectPath = "/",
  delay = 5000,
}: SuccessModalProps) {
  const [countdown, setCountdown] = useState(delay / 1000);
  const router = useRouter();

  const totalSeconds = delay / 1000;
  const progressPercent = ((totalSeconds - countdown) / totalSeconds) * 100;

  useEffect(() => {
    if (isOpen) {
      setCountdown(delay / 1000);
    }
  }, [isOpen, delay]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (countdown <= 0) {
      router.replace(redirectPath);
    }
  }, [countdown, isOpen, redirectPath, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-120 bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-primary animate-in zoom-in-95 duration-300">
        <div className="px-8 pt-10 pb-8 flex flex-col items-center">
          {/* <!-- Success Icon Wrapper --> */}
          <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
            <span className="bg-green-400 rounded-full p-2 m-2 text-white text-4xl">
              <Check size={56} />
            </span>
          </div>

          {/* <!-- HeadlineText --> */}
          <h1 className="text-green-400 tracking-tight text-3xl font-extrabold leading-tight text-center pb-3">
            Đăng bài thành công!
          </h1>

          {/* <!-- BodyText --> */}
          <p className="text-[#4b5563] text-base font-normal leading-relaxed text-center px-2 mb-8">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Bài viết của bạn sẽ
            được{" "}
            <span className="font-bold text-[#0d1b13] underline decoration-yellow-400 decoration-2 underline-offset-4">
              Admin duyệt
            </span>{" "}
            trong thời gian sớm nhất.
          </p>

          {/* <!-- ProgressBar & Redirect Info Box --> */}
          <div className="w-full bg-[#f9fafb] rounded-lg p-5 mb-8 border border-gray-100">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400 text-sm animate-spin">
                    <LoaderCircle size={14} />
                  </span>
                  <p className="text-[#0d1b13] text-sm font-semibold leading-normal">
                    Đang chuyển hướng...
                  </p>
                </div>
                <p className="text-[#0d1b13] text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 min-w-8 text-center shadow-sm">
                  {countdown}s
                </p>
              </div>

              {/* <!-- Progress Bar Component --> */}
              <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-green-400 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <p className="text-[#4c9a6c] text-xs font-medium leading-normal flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  info
                </span>
                Hệ thống sẽ tự động về trang chủ trong vài giây
              </p>
            </div>
          </div>

          {/* <!-- SingleButton (Primary Action) --> */}
          <div className="w-full flex justify-center">
            <Link
              href={redirectPath}
              className="hover:-translate-y-1 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-6 bg-[#0d1b13] text-white text-base font-bold leading-normal tracking-wide transition-all hover:bg-black active:scale-[0.98] shadow-lg shadow-black/10"
            >
              <Home size={20} className="mr-2" />
              <span className="truncate">Về Trang chủ ngay</span>
            </Link>
          </div>

          {/* <!-- Subtle close or help link --> */}
          <button className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium hover:underline">
            Liên hệ hỗ trợ nếu cần
          </button>
        </div>

        {/* <!-- Bottom decorative accent --> */}
        <div className="h-1.5 w-full bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>
    </div>
  );
}
