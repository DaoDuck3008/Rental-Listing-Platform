"use client";
import { forgotPassword } from "@/services/auth.api";
import { handleError } from "@/utils";
import { ArrowLeft, Mail, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.warning("Vui lòng nhập email của bạn");
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.status === 200) {
        toast.success("Mã xác thực đã được gửi về email!");
        router.push(
          `/forgot-password/verify?email=${encodeURIComponent(email)}`
        );
      }
    } catch (error: any) {
      handleError(error, "Yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-border-color animate-in fade-in zoom-in duration-300">
        <div className="mb-6">
          <Link
            href="/login"
            className="text-text-secondary hover:text-primary flex items-center gap-2 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang đăng nhập
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2">
            Quên mật khẩu?
          </h1>
          <p className="text-text-secondary text-base">
            Nhập email của bạn, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu mới.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Email đăng nhập của bạn
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                size={20}
              />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-input-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Gửi mã xác thực
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
