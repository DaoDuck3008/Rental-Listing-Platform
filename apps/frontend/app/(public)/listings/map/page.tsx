"use client";

import { useState, useCallback, useEffect } from "react";
import MapView from "@/components/listing/MapView";
import ListingCard3 from "@/components/listing/listingCard3";
import FilterModal from "@/components/listing/FilterModal";
import { Search, ChevronDown, Grid, Map, Filter, Loader2 } from "lucide-react";
import { useProvinces, useWardsByProvince } from "@/hooks/useProvinces";
import { useListingTypes } from "@/hooks/useListing";
import { useAmenities } from "@/hooks/useAmenities";
import { getPublicListings } from "@/services/listing.api";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MapSearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    keyword: "",
    province_code: undefined as number | undefined,
    ward_code: undefined as number | undefined,
    listing_type_code: undefined as string | undefined,
    min_price: 0,
    max_price: 50000000,
    min_area: 0,
    max_area: 100,
    beds: undefined as number | undefined,
    amenities: [] as string[],
    sort_by: "DATE_DESC",
    page: 1,
    limit: 10,
    centerLat: undefined as number | undefined,
    centerLong: undefined as number | undefined,
    radius: undefined as number | undefined,
    minLat: undefined as number | undefined,
    maxLat: undefined as number | undefined,
    minLng: undefined as number | undefined,
    maxLng: undefined as number | undefined,
    include_markers: true,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [mapControl, setMapControl] = useState<{
    center?: google.maps.LatLngLiteral;
    zoom?: number;
    resetKey: number;
  }>({
    center: { lat: 21.0285, lng: 105.8542 },
    zoom: 13,
    resetKey: 0,
  });

  const { provinces } = useProvinces();
  const { wards } = useWardsByProvince(filters.province_code);
  const { listingTypes } = useListingTypes();
  const { amenities } = useAmenities();

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const result = await getPublicListings(filters);
        setData(result);
        if (result.markers) {
          setMarkers(result.markers);
        }
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
      limit: 10,
      centerLat: undefined,
      centerLong: undefined,
      radius: undefined,
      minLat: undefined,
      maxLat: undefined,
      minLng: undefined,
      maxLng: undefined,
      include_markers: true,
    });

    setMapControl((prev) => ({
      center: { lat: 21.0285, lng: 105.8542 },
      zoom: 13,
      resetKey: prev.resetKey + 1,
    }));
  };

  const toggleAmenity = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  const handleSearchRadiusChange = useCallback(
    (
      lat: number | undefined,
      lng: number | undefined,
      rad: number | undefined
    ) => {
      setFilters((prev) => {
        if (
          prev.centerLat === lat &&
          prev.centerLong === lng &&
          prev.radius === rad
        ) {
          return prev;
        }
        return {
          ...prev,
          centerLat: lat,
          centerLong: lng,
          radius: rad,
          minLat: undefined,
          maxLat: undefined,
          minLng: undefined,
          maxLng: undefined,
          page: 1,
        };
      });
    },
    []
  );

  const handleBoundsChange = useCallback(
    (bounds: {
      minLat: number;
      maxLat: number;
      minLng: number;
      maxLng: number;
    }) => {
      setFilters((prev) => {
        // Nếu như chức năng tìm kiếm bằng bán kính đang hoạt động thì không thay đổi bounds
        if (prev.centerLat !== undefined && prev.radius !== undefined) {
          return prev;
        }

        if (
          prev.minLat === bounds.minLat &&
          prev.maxLat === bounds.maxLat &&
          prev.minLng === bounds.minLng &&
          prev.maxLng === bounds.maxLng
        ) {
          return prev;
        }

        return {
          ...prev,
          minLat: bounds.minLat,
          maxLat: bounds.maxLat,
          minLng: bounds.minLng,
          maxLng: bounds.maxLng,
          page: 1,
        };
      });
    },
    []
  );

  const sortOptions = [
    { label: "Mới nhất", value: "DATE_DESC" },
    { label: "Cũ nhất", value: "DATE_ASC" },
    { label: "Giá thấp đến cao", value: "PRICE_ASC" },
    { label: "Giá cao đến thấp", value: "PRICE_DESC" },
  ];

  return (
    <main className="flex-1 flex flex-col w-full h-[calc(100vh-64px)] overflow-hidden bg-white">
      <div className="flex h-full overflow-hidden relative">
        {/* Left Sidebar with Listings */}
        <div className="w-full lg:w-105 xl:w-120 flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden relative shadow-xl z-20">
          <div className="shrink-0 flex flex-col border-b border-slate-200 bg-white p-4 gap-3 z-10">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <Link
                  href="/listings"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-text-secondary hover:text-text-main transition-colors"
                >
                  <Grid className="w-4 h-4 inline-block mr-1" />
                  Grid
                </Link>
                <div className="px-3 py-1.5 rounded-md text-sm font-bold bg-white text-primary shadow-sm">
                  <Map className="w-4 h-4 inline-block mr-1" />
                  Bản đồ
                </div>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-bold text-primary hover:underline"
              >
                Đặt lại
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex w-full items-center gap-2">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-10 bg-slate-100 border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="text-text-secondary flex items-center justify-center pl-3">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 text-text-main placeholder:text-text-secondary px-3 text-sm"
                  placeholder="Khu vực, dự án, từ khóa..."
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="h-10 px-3 bg-white border border-slate-200 hover:border-primary text-text-main rounded-lg flex items-center justify-center transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-bold">Lọc</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-xs font-medium">
                Tìm thấy{" "}
                <span className="text-text-main font-bold">
                  {pagination?.totalItems || 0}
                </span>{" "}
                bài đăng
              </span>
              <div className="relative">
                <select
                  className="bg-transparent text-xs font-bold text-text-main outline-none appearance-none pr-6"
                  value={filters.sort_by}
                  onChange={(e) =>
                    setFilters({ ...filters, sort_by: e.target.value })
                  }
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 text-sm font-medium">
                  Đang cập nhật...
                </p>
              </div>
            ) : listings && listings.length > 0 ? (
              <>
                {listings.map((item: any) => (
                  <ListingCard3
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    address={item.address}
                    price={item.price}
                    bedrooms={item.bedrooms}
                    bathrooms={item.bathrooms}
                    area={item.area}
                    views={item.views}
                    listing_type_name={item.listing_type?.name || "N/A"}
                    image_url={
                      item.images?.[0]?.image_url || "/placeholder.png"
                    }
                  />
                ))}

                {pagination && pagination.totalPages > 1 && (
                  <div className="pt-4 pb-10 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <button
                        disabled={filters.page === 1}
                        onClick={() =>
                          setFilters({ ...filters, page: filters.page - 1 })
                        }
                        className="size-8 flex items-center justify-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setFilters({ ...filters, page: i + 1 })
                          }
                          className={`size-8 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                            filters.page === i + 1
                              ? "bg-primary text-white"
                              : "bg-white border border-slate-200 text-text-main hover:border-primary"
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
                        className="size-8 flex items-center justify-center rounded-md border border-slate-200 bg-white disabled:opacity-50"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">
                  Không tìm thấy bài đăng nào trong khu vực này.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 text-primary text-sm font-bold"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="flex-1 relative bg-slate-200">
          <MapView
            listings={listings || []}
            markers={markers}
            center={mapControl.center}
            zoom={mapControl.zoom}
            mapResetKey={mapControl.resetKey}
            onSearchRadiusChange={handleSearchRadiusChange}
            onBoundsChange={handleBoundsChange}
          />
        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        provinces={provinces || []}
        wards={wards || []}
        listingTypes={listingTypes || []}
        amenities={amenities || []}
        toggleAmenity={toggleAmenity}
        handleReset={handleReset}
      />

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

      {/* Mobile Notice Overlay */}
      <div className="lg:hidden fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Map className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-4">
          Không hỗ trợ thiết bị di động
        </h2>
        <p className="text-text-secondary mb-8 max-w-xs mx-auto">
          Trang tìm kiếm bản đồ hiện chưa hỗ trợ tối ưu trên thiết bị di động.
          Vui lòng sử dụng máy tính hoặc chuyển sang chế độ danh sách để có trải
          nghiệm tốt nhất.
        </p>
        <Link
          href="/listings"
          className="w-full max-w-xs bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
        >
          <Grid className="w-5 h-5" />
          Chuyển sang xem danh sách
        </Link>
      </div>
    </main>
  );
}
