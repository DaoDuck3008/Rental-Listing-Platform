"use client";
import { resetPassword } from "@/services/auth.api";
import { handleError } from "@/utils";
import {
  Lock,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      router.push("/forgot-password");
    }
  }, [email, otp, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.warning("Mật khẩu không khớp");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      if (result.status === 200) {
        toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        router.push("/login");
      }
    } catch (error: any) {
      handleError(error, "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4 font-display">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border-color animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-text-main mb-2">
            Mật khẩu mới
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Thiết lập mật khẩu mới cho tài khoản <br />
            <span className="font-bold text-text-main">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tối thiểu 6 ký tự"
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                className="w-full h-12 pl-4 pr-12 rounded-xl border border-input-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full h-12 pl-4 rounded-xl border border-input-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-900 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Hoàn tất thay đổi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <RefreshCw className="w-10 h-10 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
