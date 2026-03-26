import "@/styles/global.css";
import AppHeader from "@/components/layout/header";
import AppFooter from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen">{children}</div>
      <AppFooter />
    </>
  );
}
