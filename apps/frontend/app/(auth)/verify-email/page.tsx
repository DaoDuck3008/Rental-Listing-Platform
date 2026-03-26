"use client";
import { resendVerifyEmail, verifyEmail } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { handleError } from "@/utils";
import { Mail, RefreshCw, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect") || "/";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
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
    // Chỉ chấp nhận số
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    // Lấy ký tự cuối cùng nếu người dùng ghi đè
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleSubmit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      toast.warning("Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmail(email, fullOtp);
      if (result.status === 200) {
        toast.success("Xác thực email thành công!");
        const { access_token, user } = result.data;
        
        // Thực hiện Auto-login
        setAuth(access_token, user);
        
        // Chuyển hướng về trang chủ hoặc trang trước đó
        setTimeout(() => {
          router.replace(redirect);
        }, 1000);
      }
    } catch (error: any) {
      handleError(error, "Xác thực thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      const result = await resendVerifyEmail(email);
      if (result.status === 200) {
        toast.success("Mã xác thực mới đã được gửi!");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
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
            href="/login" 
            className="text-text-secondary hover:text-primary flex items-center gap-2 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại đăng nhập
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2">Xác thực Email</h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Chúng tôi đã gửi mã OTP đến địa chỉ <br />
            <span className="font-bold text-text-main">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
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
          className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              Xác nhận ngay
            </>
          )}
        </button>

        <div className="mt-10 pt-6 border-t border-border-color text-center">
          <p className="text-text-secondary text-sm">
            Bạn không nhận được mã xác thực?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className={`mt-3 font-bold text-sm transition-all flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-lg ${
              timer > 0 
                ? "text-text-secondary bg-gray-100 cursor-not-allowed" 
                : "text-primary hover:bg-primary/5 active:scale-95"
            }`}
          >
            {resending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                {timer > 0 ? `Gửi lại sau ${timer}s` : "Gửi lại mã ngay"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
