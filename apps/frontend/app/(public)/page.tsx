"use client";

import Dropdown from "@/components/common/dropdown";
import PostButton from "@/components/common/postBtn";
import RecommendCard from "@/components/homePage/recommendCard";
import ListingCard from "@/components/listing/listingCard";
import { getPublicListings } from "@/services/listing.api";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  BanknoteX,
  Clock,
  Sparkles,
  Flame,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatVietnamesePrice } from "@/utils";
import { useListingTypes } from "@/hooks/useListing";

export default function Home() {
  const [newestListings, setNewestListings] = useState<any>([]);
  const [featuredListings, setFeaturedListings] = useState<any>([]);
  const [hanoiListings, setHanoiListings] = useState<any>([]);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [typeCode, setTypeCode] = useState<string>("");
  const router = useRouter();
  const { listingTypes } = useListingTypes();
  const [currentSlide, setCurrentSlide] = useState(0);
  const newestMobileSliderRef = useRef<HTMLDivElement | null>(null);
  const featuredMobileSliderRef = useRef<HTMLDivElement | null>(null);
  const hanoiMobileSliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sliders = [
      newestMobileSliderRef.current,
      featuredMobileSliderRef.current,
      hanoiMobileSliderRef.current,
    ].filter(Boolean) as HTMLDivElement[];

    if (!sliders.length) return;

    const cleanups = sliders.map((slider) => {
      let intervalId: number | null = null;
      let resumeTimeout: number | null = null;

      const startAutoScroll = () => {
        intervalId = window.setInterval(() => {
          const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
          if (maxScrollLeft <= 0) return;

          if (slider.scrollLeft >= maxScrollLeft - 1) {
            slider.scrollTo({ left: 0, behavior: "auto" });
            return;
          }

          slider.scrollBy({ left: 1, behavior: "auto" });
        }, 28);
      };

      const stopAutoScroll = () => {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };

      const resumeAutoScroll = () => {
        if (resumeTimeout !== null) window.clearTimeout(resumeTimeout);
        resumeTimeout = window.setTimeout(() => {
          if (intervalId === null) startAutoScroll();
        }, 1500);
      };

      startAutoScroll();

      slider.addEventListener("touchstart", stopAutoScroll, { passive: true });
      slider.addEventListener("touchend", resumeAutoScroll, { passive: true });
      slider.addEventListener("mousedown", stopAutoScroll);
      slider.addEventListener("mouseup", resumeAutoScroll);
      slider.addEventListener("mouseleave", resumeAutoScroll);

      return () => {
        stopAutoScroll();
        if (resumeTimeout !== null) window.clearTimeout(resumeTimeout);
        slider.removeEventListener("touchstart", stopAutoScroll);
        slider.removeEventListener("touchend", resumeAutoScroll);
        slider.removeEventListener("mousedown", stopAutoScroll);
        slider.removeEventListener("mouseup", resumeAutoScroll);
        slider.removeEventListener("mouseleave", resumeAutoScroll);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [newestListings.length, featuredListings.length, hanoiListings.length]);

  const priceOptions = [
    { label: "Tất cả mức giá", value: null },
    { label: "Dưới 1 triệu", value: { min: 0, max: 1000000 } },
    { label: "1 - 3 triệu", value: { min: 1000000, max: 3000000 } },
    { label: "3 - 5 triệu", value: { min: 3000000, max: 5000000 } },
    { label: "5 - 10 triệu", value: { min: 5000000, max: 10000000 } },
    { label: "Trên 10 triệu", value: { min: 10000000, max: 1000000000 } },
  ];

  const typeOptions = [
    { label: "Tất cả loại hình", value: "" },
    ...(listingTypes?.map((t: any) => ({ label: t.name, value: t.code })) || []),
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [newestRes, featuredRes, hanoiRes] = await Promise.all([
          getPublicListings({
            page: 1,
            limit: 6,
            sort_by: "DATE_DESC",
          }),
          getPublicListings({
            page: 1,
            limit: 6,
            sort_by: "VIEW_DESC",
          }),
          getPublicListings({
            page: 1,
            limit: 6,
            province_code: 1,
            sort_by: "DATE_DESC",
          }),
        ]);
        setNewestListings(newestRes.data);
        setFeaturedListings(featuredRes.data);
        setHanoiListings(hanoiRes.data);
      } catch (error: any) {
        toast.error("Đã có lỗi xảy ra khi tải dữ liệu.");
      }
    };

    fetchListings();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (priceRange) {
      params.append("min_price", priceRange.min.toString());
      params.append("max_price", priceRange.max.toString());
    }
    if (typeCode) params.append("listing_type_code", typeCode);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <>
      <div>
        {/* First section with search bar  */}
        <section className="relative w-full">
          <div className="relative flex min-h-[540px] w-full items-center justify-center bg-slate-900 md:min-h-[620px]">
            <div
              className="absolute inset-0 z-0 w-full h-full bg-cover bg-center"
              data-alt="Nội thất phòng khách hiện đại, sáng sủa với cửa sổ lớn và ánh nắng"
              style={{
                backgroundImage: `linear-gradient(
                    rgba(0, 0, 0, 0.4),
                    rgba(0, 0, 0, 0.6)
                  ), url('/HomePageBG.png')`,
              }}
            ></div>
            <div className="relative z-10 flex w-full max-w-7xl flex-col items-center gap-5 px-3 text-center sm:gap-8 sm:px-4 md:px-8">
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl lg:text-6xl">
                  Khám phá nơi bạn muốn sống
                </h1>
                <h2 className="mx-auto max-w-2xl text-base font-medium text-slate-200 sm:text-lg md:text-xl">
                  Tìm kiếm hơn 1 triệu căn hộ, nhà ở và chung cư cho thuê từ các
                  chủ nhà đáng tin cậy.
                </h2>
              </div>
              <div className="mx-1 mt-1 flex w-full max-w-5xl flex-col gap-2 rounded-2xl bg-white p-2.5 shadow-xl sm:mx-0 sm:p-3 md:mt-0 md:flex-row md:items-center md:gap-0">
                <div className="flex h-11 py-2 md:py-0 flex-1 items-center border-b border-slate-200 px-2.5 sm:h-12 sm:px-4 md:h-auto md:border-b-0 md:border-r">
                  <span className="material-symbols-outlined text-slate-400 mr-3">
                    <Search />
                  </span>
                  <input
                    className="w-full bg-transparent border-transparent p-0 text-sm font-medium text-slate-500 placeholder-slate-400 online-none focus:outline-none sm:text-base"
                    placeholder="Thành phố, Mã bưu điện, hoặc Khu vực"
                    type="text"
                    value={keyword}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="hidden items-center gap-2 px-4 md:flex">
                  <div className="relative group">
                    <Dropdown
                      title="Giá"
                      options={priceOptions}
                      value={priceRange}
                      onChange={setPriceRange}
                    />
                  </div>
                  <div className="relative group">
                    <Dropdown
                      title="Loại"
                      options={typeOptions}
                      value={typeCode}
                      onChange={setTypeCode}
                    />
                  </div>
                </div>
                <div className="flex gap-2 px-0.5 pb-1 md:hidden">
                  <select
                    className="min-w-0 flex-1 rounded-lg border-none bg-slate-50 p-2 text-sm text-slate-700"
                    value={
                      priceRange
                        ? JSON.stringify(priceRange)
                        : JSON.stringify(null)
                    }
                    onChange={(e) => setPriceRange(JSON.parse(e.target.value))}
                  >
                    {priceOptions.map((opt) => (
                      <option
                        key={opt.label}
                        value={JSON.stringify(opt.value)}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className="min-w-0 flex-1 rounded-lg border-none bg-slate-50 p-2 text-sm text-slate-700"
                    value={typeCode}
                    onChange={(e) => setTypeCode(e.target.value)}
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 sm:h-12 sm:px-8 sm:text-base md:w-auto"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Second section: Famous City */}
        <section className="border-slate-100 bg-white py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <h3 className="mb-4 text-base font-bold text-slate-900 sm:mb-6 sm:text-lg">
              Địa điểm phổ biến
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[
                "TP. Hồ Chí Minh",
                "Hà Nội",
                "Đà Nẵng",
                "Nha Trang",
                "Cần Thơ",
              ].map((city) => (
                <Link
                  key={city}
                  className="shrink-0 flex items-center gap-3 p-2 pr-6 rounded-full bg-slate-50  border border-slate-200  hover:border-primary/50  transition-colors group text-slate-700 hover:text-primary font-semibold text-sm"
                  href={`/listings?keyword=${encodeURIComponent(city)}`}
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Third section: Newest listings */}
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-5 md:px-10">
          <div className="mb-6 flex items-end justify-between">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-600 sm:p-3">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Tin đăng mới nhất
                </h2>
                <p className="text-sm text-slate-500 sm:text-base">
                  Những bất động sản mới được thêm hôm nay trong khu vực của bạn.
                </p>
              </div>
            </div>
            <Link
              className="hidden md:flex items-center text-primary font-bold hover:underline bg-slate-50 px-4 py-2 rounded-full border border-slate-100 transition-colors"
              href="/listings"
            >
              Xem tất cả
              <span className="material-symbols-outlined ml-1 text-sm">
                <ArrowRight />
              </span>
            </Link>
          </div>
          {/* Slider Container */}
          <div className="pb-4">
            <div ref={newestMobileSliderRef} className="flex gap-4 overflow-x-auto pb-2 md:hidden">
              {newestListings && newestListings.length > 0 ? (
                newestListings.map((listing: any) => (
                  <div key={listing.id} className="min-w-[85vw] max-w-[85vw] shrink-0">
                    <ListingCard
                      id={listing.id}
                      title={listing.title}
                      price={listing.price}
                      address={listing.address}
                      imgUrl={listing.images[0].image_url || "./NoImage.png"}
                      beds={listing.bedrooms}
                      baths={listing.bathrooms}
                      area={listing.area}
                      status={listing.status}
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
              )}
            </div>
            <div className="relative hidden group md:block">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {[0, 1].map((slideIdx) => (
                    <div key={slideIdx} className="grid w-full flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                      {newestListings && newestListings.length > 0 ? (
                        newestListings.slice(slideIdx * 3, (slideIdx + 1) * 3).map((listing: any) => (
                          <ListingCard
                            key={listing.id}
                            id={listing.id}
                            title={listing.title}
                            price={listing.price}
                            address={listing.address}
                            imgUrl={listing.images[0].image_url || "./NoImage.png"}
                            beds={listing.bedrooms}
                            baths={listing.bathrooms}
                            area={listing.area}
                            status={listing.status}
                          />
                        ))
                      ) : (
                        <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Controls */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                className="absolute left-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-blue-500 hover:text-blue-500 md:block"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                className="absolute right-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-blue-500 hover:text-blue-500 md:block"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Pagination Dots */}
              <div className="mt-6 flex justify-center gap-2">
                <div onClick={() => setCurrentSlide(0)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 0 ? "w-8 bg-blue-500" : "w-2 bg-slate-300"}`} />
                <div onClick={() => setCurrentSlide(1)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 1 ? "w-8 bg-blue-500" : "w-2 bg-slate-300"}`} />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center md:hidden">
            <Link
              href="/listings?sort_by=DATE_DESC"
              className="w-full py-3 border border-slate-300 flex justify-center rounded-lg text-slate-900  font-bold hover:bg-slate-50 "
            >
              Xem tất cả tin đăng
            </Link>
          </div>
        </section>

        <section className="bg-slate-50/50 py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-10">
            <div className="mb-8 flex items-end justify-between">
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className="rounded-2xl bg-orange-100 p-2.5 text-orange-600 sm:p-3">
                  <Flame className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Tin đăng nổi bật
                  </h2>
                  <p className="text-sm text-slate-500 sm:text-base">
                    Những bất động sản được xem nhiều nhất.
                  </p>
                </div>
              </div>
              <Link
                className="hidden md:flex items-center text-primary font-bold hover:underline bg-white px-4 py-2 rounded-full border border-slate-100 transition-colors"
                href="/listings?sort_by=VIEW_DESC"
              >
                Xem tất cả
                <span className="material-symbols-outlined ml-1 text-sm">
                  <ArrowRight />
                </span>
              </Link>
            </div>
            {/* Slider Container */}
            <div className="pb-4">
            <div ref={featuredMobileSliderRef} className="flex gap-4 overflow-x-auto pb-2 md:hidden">
                {featuredListings && featuredListings.length > 0 ? (
                  featuredListings.map((listing: any) => (
                    <div key={listing.id} className="min-w-[85vw] max-w-[85vw] shrink-0">
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        address={listing.address}
                        imgUrl={listing.images[0].image_url || "./NoImage.png"}
                        beds={listing.bedrooms}
                        baths={listing.bathrooms}
                        area={listing.area}
                        status={listing.status}
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
                )}
              </div>
              <div className="relative hidden group md:block">
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {[0, 1].map((slideIdx) => (
                      <div key={slideIdx} className="grid w-full flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                        {featuredListings && featuredListings.length > 0 ? (
                          featuredListings.slice(slideIdx * 3, (slideIdx + 1) * 3).map((listing: any) => (
                            <ListingCard
                              key={listing.id}
                              id={listing.id}
                              title={listing.title}
                              price={listing.price}
                              address={listing.address}
                              imgUrl={listing.images[0].image_url || "./NoImage.png"}
                              beds={listing.bedrooms}
                              baths={listing.bathrooms}
                              area={listing.area}
                              status={listing.status}
                            />
                          ))
                        ) : (
                          <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Controls */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="absolute left-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-orange-500 hover:text-orange-500 md:block"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="absolute right-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-orange-500 hover:text-orange-500 md:block"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Pagination Dots */}
                <div className="mt-6 flex justify-center gap-2">
                  <div onClick={() => setCurrentSlide(0)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 0 ? "w-8 bg-orange-500" : "w-2 bg-slate-300"}`} />
                  <div onClick={() => setCurrentSlide(1)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 1 ? "w-8 bg-orange-500" : "w-2 bg-slate-300"}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-10">
            <div className="mb-8 flex items-end justify-between">
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className="rounded-2xl bg-red-100 p-2.5 text-red-600 sm:p-3">
                  <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Tin đăng tại Hà Nội
                  </h2>
                  <p className="text-sm text-slate-500 sm:text-base">
                    Tìm kiếm nơi ở lý tưởng tại thủ đô.
                  </p>
                </div>
              </div>
              <Link
                className="hidden md:flex items-center text-primary font-bold hover:underline bg-slate-50 px-4 py-2 rounded-full border border-slate-100 transition-colors"
                href="/listings?province_code=1"
              >
                Xem tất cả
                <span className="material-symbols-outlined ml-1 text-sm">
                  <ArrowRight />
                </span>
              </Link>
            </div>
            {/* Slider Container */}
            <div className="pb-4">
              <div ref={hanoiMobileSliderRef} className="flex gap-4 overflow-x-auto pb-2 md:hidden">
                {hanoiListings && hanoiListings.length > 0 ? (
                  hanoiListings.map((listing: any) => (
                    <div key={listing.id} className="min-w-[85vw] max-w-[85vw] shrink-0">
                      <ListingCard
                        id={listing.id}
                        title={listing.title}
                        price={listing.price}
                        address={listing.address}
                        imgUrl={listing.images[0].image_url || "./NoImage.png"}
                        beds={listing.bedrooms}
                        baths={listing.bathrooms}
                        area={listing.area}
                        status={listing.status}
                      />
                    </div>
                  ))
                ) : (
                  <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
                )}
              </div>
              <div className="relative hidden group md:block">
                <div className="relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {[0, 1].map((slideIdx) => (
                      <div key={slideIdx} className="grid w-full flex-shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                        {hanoiListings && hanoiListings.length > 0 ? (
                          hanoiListings.slice(slideIdx * 3, (slideIdx + 1) * 3).map((listing: any) => (
                            <ListingCard
                              key={listing.id}
                              id={listing.id}
                              title={listing.title}
                              price={listing.price}
                              address={listing.address}
                              imgUrl={listing.images[0].image_url || "./NoImage.png"}
                              beds={listing.bedrooms}
                              baths={listing.bathrooms}
                              area={listing.area}
                              status={listing.status}
                            />
                          ))
                        ) : (
                          <p className="col-span-full py-10 text-center">Không có tin đăng nào để hiển thị.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Controls */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="absolute left-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-red-500 hover:text-red-500 md:block"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
                  className="absolute right-[-20px] top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-slate-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:border-red-500 hover:text-red-500 md:block"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Pagination Dots */}
                <div className="mt-6 flex justify-center gap-2">
                  <div onClick={() => setCurrentSlide(0)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 0 ? "w-8 bg-red-500" : "w-2 bg-slate-300"}`} />
                  <div onClick={() => setCurrentSlide(1)} className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentSlide === 1 ? "w-8 bg-red-500" : "w-2 bg-slate-300"}`} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fourth Section: Why choose us? */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-16">
              <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl">
                Tại sao chọn RentalHome?
              </h2>
              <p className="text-base text-slate-500 sm:text-lg">
                Chúng tôi giúp việc tìm kiếm ngôi nhà tiếp theo của bạn trở nên
                đơn giản, an toàn và thoải mái.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3 md:gap-12">
              <RecommendCard
                icon={ShieldCheck}
                title="Chủ nhà đã xác thực"
                description="Chúng tôi sàng lọc tất cả chủ nhà và tin đăng để đảm bảo bạn chỉ giao dịch với các chủ sở hữu hợp pháp."
              />
              <RecommendCard
                icon={BanknoteX}
                title="Không phí ẩn"
                description="Giá cả minh bạch trên tất cả các tin đăng. Những gì bạn thấy là những gì bạn trả, không có chi phí bất ngờ."
              />
              <RecommendCard
                icon={Clock}
                title="Tham quan ngay lập tức"
                description="Lên lịch tham quan trực tiếp hoặc qua video ngay lập tức thông qua lịch trên nền tảng của chúng tôi."
              />
            </div>
          </div>
        </section>

        {/* Fifth Section: Asking owner */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-blue-500 p-6 text-center shadow-2xl shadow-blue-500/20 md:flex-row md:gap-8 md:p-12 md:text-left lg:p-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10 max-w-xl">
                <h2 className="mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl md:text-4xl">
                  Bạn là chủ nhà?
                </h2>
                <p className="text-base text-blue-100 sm:text-lg">
                  Đăng tin miễn phí và tiếp cận hàng triệu người thuê. Các công
                  cụ của chúng tôi giúp quản lý hồ sơ dễ dàng.
                </p>
              </div>
              <div className="relative z-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                <PostButton
                  title="Đăng tin bất động sản của bạn"
                  className="h-12 w-full cursor-pointer rounded-xl bg-white px-5 text-sm font-bold text-blue-500 shadow-lg transition hover:-translate-y-1 hover:bg-slate-50 sm:h-14 sm:w-auto sm:px-8 sm:text-base"
                />
                <button className="h-12 w-full cursor-pointer rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-blue-700 sm:h-14 sm:w-auto sm:px-8 sm:text-base">
                  Tìm Hiểu Thêm
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
