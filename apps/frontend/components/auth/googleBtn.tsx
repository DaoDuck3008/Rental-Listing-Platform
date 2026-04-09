"use client";

import { googleLogin } from "@/services/auth.api";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleError } from "@/utils";

export default function GoogleLoginButton() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return (
    <GoogleLogin
      containerProps={{
        className: "w-full flex items-center cursor-pointer justify-center gap-3 bg-white  text-slate-700  font-bold py-3 my-2 px-4 rounded-lg transition-all duration-200 h-12",
      }}
      onSuccess={async (credentialResponse) => {
        try {
          const result = await googleLogin(credentialResponse.credential!);

          const { access_token, user } = result.data;
          setAuth(access_token, user);
          router.replace("/");
          toast.success("Đăng nhập thành công!");
        } catch (error: any) {
          console.error("Google login failed: ", error);
          handleError(error, "Đăng nhập thất bại!");
        }
      }}
    />
  );
}
