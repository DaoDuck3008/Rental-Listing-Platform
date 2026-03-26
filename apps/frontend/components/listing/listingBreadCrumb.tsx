import { useProvinceById, useWardById } from "@/hooks/useProvinces";
import Link from "next/link";

interface Breadcrumb {
  province_code: string | number;
  ward_code: string | number;
  title: string;
}

export default function ListingBreadcrumb({
  province_code,
  ward_code,
  title,
}: Breadcrumb) {
  const { province, isLoading: provinceIsLoading } =
    useProvinceById(province_code);
  const { ward, isLoading: wardIsLoading } = useWardById(ward_code);

  return (
    <>
      {!provinceIsLoading && !wardIsLoading && (
        <div className="flex flex-wrap gap-2 py-4 text-sm">
          <Link
            className="text-[#92adc9] hover:text-primary font-medium"
            href="#"
          >
            Trang chủ
          </Link>
          <span className="text-[#92adc9] font-medium">/</span>
          <Link
            className="text-[#92adc9] hover:text-primary font-medium"
            href="/"
          >
            {province.name}
          </Link>
          <span className="text-[#92adc9] font-medium">/</span>
          <Link
            className="text-[#92adc9] hover:text-primary font-medium"
            href="/"
          >
            {ward.name}
          </Link>
          <span className="text-[#92adc9] font-medium">/</span>
          <span className="text-slate-900 font-medium">{title}</span>
        </div>
      )}
    </>
  );
}
