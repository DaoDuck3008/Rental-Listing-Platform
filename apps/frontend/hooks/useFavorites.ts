"use client";

import useSWR from "swr";
import { getMyFavorites } from "@/services/user.api";
import { toggleFavoriteListing } from "@/services/listing.api";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "react-toastify";

export const useFavorites = () => {
  const { hydrated, user } = useAuthStore();

  const { data, error, isLoading, mutate } = useSWR(
    hydrated && user ? "my_favorites" : null,
    () => getMyFavorites(10, 1),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const favoriteIds = data?.data?.rows?.map((f: any) => f.listing_id) || [];

  const toggleFavorite = async (listingId: string) => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này");
      return;
    }

    try {
      const res = await toggleFavoriteListing(listingId);
      const isFavorited = res.data.isFavorited;

      mutate(
        {
          ...data,
          data: {
            ...data?.data,
            rows: toggleIdInFavorites(data?.data?.rows || [], listingId),
          },
        },
        false
      );

      if (isFavorited) {
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        toast.info("Đã xóa khỏi danh sách yêu thích");
      }
    } catch (err: any) {
      mutate();
      toast.error(err.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  return {
    favoriteIds,
    isLoading,
    isError: error,
    toggleFavorite,
  };
};

function toggleIdInFavorites(rows: any[], listingId: string) {
  const exists = rows.find((r) => r.listing_id === listingId);
  if (exists) {
    return rows.filter((r) => r.listing_id !== listingId);
  } else {
    return [...rows, { listing_id: listingId }];
  }
}
