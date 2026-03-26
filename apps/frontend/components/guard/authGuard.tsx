"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FullPageLoading from "../ui/fullPageLoading";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    if (!user && hydrated) {
      toast.warning("Bạn cần đăng nhập để vào trang này.");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, hydrated]);

  if (!hydrated) return <FullPageLoading />;

  if (!user) return null;

  return <>{children}</>;
}
