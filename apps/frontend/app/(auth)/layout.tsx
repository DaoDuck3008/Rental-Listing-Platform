import GuestGuard from "@/components/guard/guestGuard";
import AppHeader from "@/components/layout/header";
import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <GuestGuard>
          <AppHeader />
          {children}
        </GuestGuard>
      </Suspense>
    </>
  );
}
