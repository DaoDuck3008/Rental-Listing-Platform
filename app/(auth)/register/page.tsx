"use client";

import { register } from "@/services/auth.api";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  House,
  Lock,
  Mail,
  Phone,
  RotateCcwKeyIcon,
  User,
  VenusAndMarsIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleLoginButton from "@/components/auth/googleBtn";
import { handleError } from "@/utils";

interface FormState {
  full_name: string;
  gender: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] =
    useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    full_name: "",
    gender: "Male",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      // validate;
      if (!form.full_name.trim()) {
        toast.warning("Họ tên không được để trống");
        return;
      }

      if (!form.phone_number.trim()) {
        toast.warning("Số điện thoại không được để trống");
        return;
      }

      if (!form.email.trim()) {
        toast.warning("Email không được để trống");
        return;
      }

      if (!form.password) {
        toast.warning("Mật khẩu không được để trống");
        return;
      }

      if (form.password !== form.confirm_password) {
        toast.warning("Mật khẩu không khớp!");
        return;
      }

      const result = await register(form);
      if (result.status === 201) {
        toast.success("Đăng kí tài khoản thành công!");
        router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
        return;
      }
    } catch (error: any) {
      handleError(error, "Có lỗi xảy ra!");
      return;
    }
  };

  return (
    <div className="bg-background-light  text-slate-900  min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-145 bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-slate-900/5 my-4">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 text-primary">
              <div className="size-12 bg-[#e7f2fd] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl p-4">
                  <House size={40} color="#137fec" />
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900  mb-2">
              Đăng Ký Tài Khoản
            </h1>
            <p className="text-slate-500  text-sm sm:text-base">
              Tham gia cộng đồng tìm nhà trọ uy tín nhất.
            </p>
          </div>
          <div className="space-y-3">
            {/* <button className="w-full flex items-center cursor-pointer justify-center gap-3 bg-white  border border-slate-200  hover:bg-slate-50  text-slate-700  font-bold py-3 px-4 rounded-lg transition-all duration-200 h-12">
              <img className="w-6 h-6" src="/GoogleLogo.png" />
              <span>Tiếp tục với Google</span>
            </button> */}
            <GoogleLoginButton />
            {/* <button className="w-full flex items-center justify-center cursor-pointer gap-3 bg-white  border border-slate-200  hover:bg-slate-50  text-slate-700 font-bold py-3 px-4 rounded-lg transition-all duration-200 h-12">
              <img className="w-6 h-6" src="/FacebookLogo.png" />
              <span>Tiếp tục với Facebook</span>
            </button> */}
          </div>
          <div className="relative flex py-8 items-center">
            <div className="grow border-t border-slate-200 "></div>
            <span className="shrink-0 mx-4 text-slate-400  text-sm">
              Hoặc đăng ký bằng email
            </span>
            <div className="grow border-t border-slate-200 "></div>
          </div>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 "
                htmlFor="full_name"
              >
                Tên đầy đủ
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">
                    <User />
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50  border-transparent focus:bg-white ring-1 ring-slate-200  focus:ring-2 focus:ring-primary rounded-lg text-slate-900  placeholder-slate-400 transition-all text-sm font-medium"
                  id="full_name"
                  name="full_name"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  className="block text-sm font-semibold text-slate-700 "
                  htmlFor="gender"
                >
                  Giới tính
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      <VenusAndMarsIcon />
                    </span>
                  </div>
                  <select
                    className="appearance-none block w-full pl-10 pr-8 py-3 bg-slate-50  border-transparent  focus:bg-white  ring-1 ring-slate-200  focus:ring-2 focus:ring-primary rounded-lg text-slate-900  transition-all text-sm font-medium"
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Chọn</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">
                      <ChevronDown />
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  className="block text-sm font-semibold text-slate-700 "
                  htmlFor="phone"
                >
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">
                      <Phone />
                    </span>
                  </div>
                  <input
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50  border-transparent  focus:bg-white  ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-lg text-slate-900  placeholder-slate-400 transition-all text-sm font-medium"
                    id="phone"
                    name="phone_number"
                    placeholder="09xx..."
                    type="tel"
                    value={form.phone_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 "
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">
                    <Mail />
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50  border-transparent  focus:bg-white ring-1 ring-slate-200 focus:ring-2 focus:ring-primary rounded-lg text-slate-900  placeholder-slate-400 transition-all text-sm font-medium"
                  id="email"
                  name="email"
                  placeholder="example@gmail.com"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 "
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    <Lock />
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50  border-transparent  focus:bg-white  ring-1 ring-slate-200  focus:ring-2 focus:ring-primary rounded-lg text-slate-900  placeholder-slate-400 transition-all text-sm font-medium"
                  id="password"
                  name="password"
                  placeholder="Tối thiểu 8 ký tự"
                  type={visiblePassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                />
                {!visiblePassword && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600  cursor-pointer"
                    type="button"
                    onClick={() => setVisiblePassword(true)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      <EyeOff />
                    </span>
                  </button>
                )}
                {visiblePassword && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600  cursor-pointer"
                    type="button"
                    onClick={() => setVisiblePassword(false)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      <Eye />
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-slate-700 "
                htmlFor="confirm_password"
              >
                Nhập lại mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    <RotateCcwKeyIcon />
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-10 py-3 bg-slate-50  border-transparent  focus:bg-white  ring-1 ring-slate-200  focus:ring-2 focus:ring-primary rounded-lg text-slate-900  placeholder-slate-400 transition-all text-sm font-medium"
                  id="confirm_password"
                  name="confirm_password"
                  placeholder="Nhập lại mật khẩu"
                  type={visibleConfirmPassword ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                />
                {!visibleConfirmPassword && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    type="button"
                    onClick={() => setVisibleConfirmPassword(true)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      <EyeOff />
                    </span>
                  </button>
                )}

                {visibleConfirmPassword && (
                  <button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    type="button"
                    onClick={() => setVisibleConfirmPassword(false)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      <Eye />
                    </span>
                  </button>
                )}
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-md shadow-blue-500/20 mt-2"
              onClick={() => handleRegister()}
            >
              <span className="truncate">Đăng ký tài khoản</span>
              <span className="material-symbols-outlined ml-2 text-sm">
                <ArrowRight />
              </span>
            </button>
            <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed px-4">
              Bằng việc đăng ký, bạn đồng ý với
              <Link
                className="underline hover:text-blue transition-colors"
                href="#"
              >
                Điều khoản dịch vụ
              </Link>
              và
              <Link
                className="underline hover:text-primary transition-colors"
                href="#"
              >
                Chính sách bảo mật
              </Link>
              của chúng tôi.
            </p>
          </div>
          <div className="mt-8 text-center pt-6 border-t border-slate-100 ">
            <p className="text-sm font-medium text-slate-600 ">
              Đã có tài khoản?
              <Link
                className="text-primary hover:text-blue-600 font-bold ml-1 transition-colors"
                href={`/login?redirect=${encodeURIComponent(redirect)}`}
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
