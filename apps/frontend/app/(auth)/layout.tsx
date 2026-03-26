import GuestGuard from "@/components/guard/guestGuard";
import AppHeader from "@/components/layout/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GuestGuard>
        <AppHeader />
        {children}
      </GuestGuard>
    </>
  );
}
