"use client";

import useSWR from "swr";
import {
  getProvinceById,
  getProvinces,
  getWardById,
  getWardsByProvince,
} from "@/services/province.api";

export const useProvinces = () => {
  const { data, error, isLoading } = useSWR("provinces", getProvinces, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60000,

    shouldRetryOnError: false,
  });

  return {
    provinces: data,
    isLoading,
    isError: error,
  };
};

export const useProvinceById = (code: string | number) => {
  const { data, error, isLoading } = useSWR(
    ["province", code],
    ([_, code]) => getProvinceById(code),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,

      shouldRetryOnError: false,
    }
  );

  return {
    province: data,
    isError: error,
    isLoading,
  };
};

export const useWardsByProvince = (province_code?: number | null) => {
  const { data, error, isLoading } = useSWR(
    province_code ? ["wardsbyProvince", province_code] : null,
    ([_, code]) => getWardsByProvince(code),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,

      shouldRetryOnError: false,
    }
  );

  // Return empty array if no province is selected or data is not yet loaded
  if (!province_code) {
    return { wards: [], isLoading: false, isError: null };
  }

  return { wards: data || [], isError: error, isLoading };
};

export const useWardById = (code: string | number) => {
  const { data, error, isLoading } = useSWR(
    ["ward", code],
    ([_, code]) => getWardById(code),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,

      shouldRetryOnError: false,
    }
  );

  return {
    ward: data,
    isError: error,
    isLoading,
  };
};
