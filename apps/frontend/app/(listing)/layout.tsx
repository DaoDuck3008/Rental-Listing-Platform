import AuthGuard from "@/components/guard/authGuard";
import RoleGuard from "@/components/guard/roleGuard";
import AppHeader from "@/components/layout/header";

export default function ListingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["ADMIN", "LANDLORD"]}>
        <AppHeader />
        {children}
      </RoleGuard>
    </AuthGuard>
  );
}
