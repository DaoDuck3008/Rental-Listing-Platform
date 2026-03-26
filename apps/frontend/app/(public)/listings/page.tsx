"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/listing/listingCard";
import {
  Search,
  ChevronDown,
  Grid,
  Map,
  Filter,
  RotateCcw,
  Loader2,
  X,
} from "lucide-react";
import { useProvinces, useWardsByProvince } from "@/hooks/useProvinces";
import { useListingTypes } from "@/hooks/useListing";
import { useAmenities } from "@/hooks/useAmenities";
import { getPublicListings } from "@/services/listing.api";
import { useEffect } from "react";
import RangeSlider from "@/components/common/rangeSlider";
import { formatVietnamesePrice } from "@/utils/formatters";
import { toast } from "react-toastify";
import Link from "next/link";

function SearchListings() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    province_code: searchParams.get("province_code")
      ? Number(searchParams.get("province_code"))
      : undefined,
    ward_code: undefined as number | undefined,
    listing_type_code: searchParams.get("listing_type_code") || undefined,
    min_price: Number(searchParams.get("min_price")) || 0,
    max_price: Number(searchParams.get("max_price")) || 50000000,
    min_area: Number(searchParams.get("min_area")) || 0,
    max_area: Number(searchParams.get("max_area")) || 100,
    beds: searchParams.get("beds") ? Number(searchParams.get("beds")) : undefined,
    amenities: searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",")
      : ([] as string[]),
    sort_by: searchParams.get("sort_by") || "DATE_DESC",
    page: 1,
    limit: 12,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { provinces } = useProvinces();
  const { wards } = useWardsByProvince(filters.province_code);
  const { listingTypes } = useListingTypes();
  const { amenities } = useAmenities();

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const result = await getPublicListings(filters);
        setData(result);
      } catch (error: any) {
        toast.error("Đã có lỗi xảy ra vui lòng thử lại sau");
      } finally {
        setIsLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchListings();
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const listings = data?.data;
  const pagination = data?.pagination;

  const handleReset = () => {
    setFilters({
      keyword: "",
      province_code: undefined,
      ward_code: undefined,
      listing_type_code: undefined,
      min_price: 0,
      max_price: 50000000,
      min_area: 0,
      max_area: 100,
      beds: undefined,
      amenities: [],
      sort_by: "DATE_DESC",
      page: 1,
      limit: 12,
    });
  };

  const toggleAmenity = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const sortOptions = [
    { label: "Mới nhất", value: "DATE_DESC" },
    { label: "Cũ nhất", value: "DATE_ASC" },
    { label: "Giá thấp đến cao", value: "PRICE_ASC" },
    { label: "Giá cao đến thấp", value: "PRICE_DESC" },
    { label: "Xem nhiều nhất", value: "VIEW_DESC" },
  ];

  return (
    <main className="flex-1 flex flex-col w-full max-w-500 mx-auto px-4 lg:px-10 py-6">
      <div className="flex flex-col lg:flex-row gap-8 items-start h-full relative">
        {/* Sidebar for Desktop / Filter Drawer for Mobile */}
        <aside
          className={`
            z-50 transition-all duration-300 ease-in-out
            fixed inset-y-0 left-0 w-full p-6 bg-white 
            lg:relative lg:translate-x-0 lg:w-[320px] lg:p-0 lg:bg-transparent
            ${
              isFilterOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            lg:sticky lg:top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-hidden custom-scrollbar
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Bộ lọc</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Đặt lại
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="lg:hidden"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Keyword Search */}
            <div className="space-y-3">
              <p className="font-bold">Tìm kiếm</p>
              <div className="flex items-center rounded-lg border border-slate-200 px-3 py-2 bg-white transition-all focus-within:ring-2 focus-within:ring-primary/20">
                <Search className="text-slate-400 w-5 h-5 mr-2" />
                <input
                  className="w-full bg-transparent text-sm border-none p-0 focus:ring-0"
                  placeholder="Nhập từ khóa..."
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <p className="font-bold">Vị trí</p>
              <div className="space-y-2">
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none pr-10"
                    value={filters.province_code || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        province_code: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                        ward_code: undefined,
                      })
                    }
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces?.map((p: any) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none pr-10 disabled:bg-slate-50"
                    value={filters.ward_code || ""}
                    disabled={!filters.province_code}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        ward_code: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {wards?.map((w: any) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Khoảng giá</p>
                <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                  {formatVietnamesePrice(filters.min_price)} -{" "}
                  {formatVietnamesePrice(filters.max_price)}
                </span>
              </div>
              <RangeSlider
                min={0}
                max={50000000}
                step={500000}
                values={[filters.min_price, filters.max_price]}
                onChange={(values) =>
                  setFilters({
                    ...filters,
                    min_price: values[0],
                    max_price: values[1],
                  })
                }
              />
            </div>

            {/* Area Range */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Diện tích</p>
                <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
                  {filters.min_area} m² - {filters.max_area} m²
                </span>
              </div>
              <RangeSlider
                min={0}
                max={100}
                step={1}
                values={[filters.min_area, filters.max_area]}
                onChange={(values) =>
                  setFilters({
                    ...filters,
                    min_area: values[0],
                    max_area: values[1],
                  })
                }
              />
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <p className="font-bold">Loại bất động sản</p>
              <div className="grid grid-cols-1 gap-2">
                {listingTypes?.map((type: any) => (
                  <label
                    key={type.code}
                    className="flex gap-3 items-center cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="listing_type"
                      className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-0"
                      checked={filters.listing_type_code === type.code}
                      onChange={() =>
                        setFilters({ ...filters, listing_type_code: type.code })
                      }
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {type.name}
                    </span>
                  </label>
                ))}
                <label className="flex gap-3 items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="listing_type"
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-0"
                    checked={!filters.listing_type_code}
                    onChange={() =>
                      setFilters({ ...filters, listing_type_code: undefined })
                    }
                  />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    Tất cả
                  </span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <p className="font-bold">Tiện nghi</p>
              <div className="grid grid-cols-1 gap-2">
                {amenities?.map((amenity: any) => (
                  <label
                    key={amenity.id}
                    className="flex gap-3 items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-0"
                      checked={filters.amenities.includes(amenity.id)}
                      onChange={() => toggleAmenity(amenity.id)}
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {amenity.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {provinces?.find((p: any) => p.code === filters.province_code)
                  ?.name
                  ? `Cho thuê tại ${
                      provinces.find(
                        (p: any) => p.code === filters.province_code
                      ).name
                    }`
                  : "Tất cả bài đăng cho thuê"}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Hiển thị {pagination?.totalItems || 0} kết quả
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold"
              >
                <Filter className="w-4 h-4 text-primary" />
                Lọc
              </button>

              {/* Sort */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  className="w-full bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium appearance-none pr-10"
                  value={filters.sort_by}
                  onChange={(e) =>
                    setFilters({ ...filters, sort_by: e.target.value })
                  }
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sắp xếp: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <div className="p-1.5 rounded bg-white text-primary shadow-sm font-bold">
                  <Grid className="w-5 h-5" />
                </div>
                <Link
                  href="/listings/map"
                  className="p-1.5 rounded text-slate-500 hover:text-text-main transition-colors"
                >
                  <Map className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 w-full">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-slate-500">Đang tìm kiếm...</p>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-6">
              {listings.map((item: any) => (
                <ListingCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imgUrl={item.images?.[0]?.image_url || "/placeholder.png"}
                  price={item.price}
                  address={item.address}
                  beds={item.bedrooms}
                  baths={item.bathrooms}
                  area={item.area}
                  status={item.status}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Không tìm thấy bài đăng nào.</p>
              <button
                onClick={handleReset}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12 mb-10">
              <nav className="flex items-center gap-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-50"
                >
                  <ChevronDown className="w-5 h-5 rotate-90" />
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                    className={`size-10 flex items-center justify-center rounded-lg font-medium ${
                      filters.page === i + 1
                        ? "bg-primary text-white"
                        : "border border-slate-200 bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={filters.page === pagination.totalPages}
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  className="size-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white disabled:opacity-50"
                >
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchListings />
    </Suspense>
  );
}
