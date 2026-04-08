import "@/styles/global.css";
import AppHeaderWithSearch from "@/components/layout/headerWithSearch";
import AppFooter from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeaderWithSearch />
      <div className="min-h-screen">{children}</div>
      <AppFooter />
    </>
  );
}
