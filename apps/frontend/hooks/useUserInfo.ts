"use client";

import { getPersonalInformationSWR } from "@/services/user.api";
import useSWR from "swr";

import { useAuthStore } from "@/store/auth.store";

export const useUserInfo = () => {
  const hydrated = useAuthStore((state) => state.hydrated);
  const { data, error, isLoading, mutate } = useSWR(
    hydrated ? "personal_information" : null,
    getPersonalInformationSWR,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,

      dedupingInterval: 180000, // 3 minutes
      shouldRetryOnError: false,
    }
  );

  return {
    userInfo: data?.user,
    isLoading,
    isError: error,
    mutate,
  };
};
