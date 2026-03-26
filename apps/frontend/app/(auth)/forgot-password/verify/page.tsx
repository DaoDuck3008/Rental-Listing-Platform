"use client";
import { forgotPassword } from "@/services/auth.api";
import { handleError } from "@/utils";
import { Mail, RefreshCw, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

function VerifyResetOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
    }
    inputRefs.current[0]?.focus();
  }, [email, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (data.length === 6 && /^\d+$/.test(data)) {
      const pasteOtp = data.split("");
      setOtp(pasteOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.warning("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    // mang theo email và otp để chuyển sang trang đặt lại mật khẩu
    toast.success("Mã OTP đã hợp lệ! Vui lòng đặt mật khẩu mới.");
    router.push(
      `/forgot-password/reset?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(fullOtp)}`
    );
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      await forgotPassword(email);
      toast.success("Mã xác thực mới đã được gửi!");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      handleError(error, "Gửi lại mã thất bại");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border-color animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <Link
            href="/forgot-password"
            className="text-text-secondary hover:text-primary flex items-center gap-2 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về bước nhập email
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2">
            Nhập mã xác thực
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến <br />
            <span className="font-bold text-text-main">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-16 text-center text-2xl font-bold border-2 border-input-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 text-text-main"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || otp.join("").length < 6}
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-6 h-6" />
          Tiếp tục đặt mật khẩu mới
        </button>

        <div className="mt-10 pt-6 border-t border-border-color text-center">
          <p className="text-text-secondary text-sm">
            Bạn không nhận được mã xác thực?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`mt-2 font-bold text-sm transition-all flex items-center justify-center gap-2 mx-auto px-4 py-2 ${
              timer > 0
                ? "text-text-secondary cursor-not-allowed"
                : "text-primary active:scale-95"
            }`}
          >
            {resending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : timer > 0 ? (
              `Gửi lại sau ${timer}s`
            ) : (
              "Gửi lại mã ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyResetOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyResetOTPContent />
    </Suspense>
  );
}
