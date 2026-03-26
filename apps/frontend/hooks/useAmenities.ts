import { getAllAmenities } from "@/services/amenities.api";
import useSWR from "swr";

export const useAmenities = () => {
  const { data, error, isLoading } = useSWR("amenities", getAllAmenities, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 60000, 

    shouldRetryOnError: false,
  });

  return {
    amenities: data?.data,
    isLoading,
    isError: error,
  };
};
