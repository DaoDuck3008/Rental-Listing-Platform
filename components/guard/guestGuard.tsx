"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FullPageLoading from "../ui/fullPageLoading";

interface Props {
  children: React.ReactNode;
}

export default function GuestGuard({ children }: Props) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (user) {
      router.replace(redirect);
    }
  }, [user, hydrated, router, redirect]);

  // Chờ hydrated
  if (!hydrated) return <FullPageLoading />;

  // Nếu đã đăng nhập, không hiển thị nội dung
  if (user) {
    return null;
  }

  return <>{children}</>;
}
