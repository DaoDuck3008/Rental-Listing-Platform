import { getAllListingTypesSWR } from "@/services/listing.api";
import useSWR from "swr";

export const useListingTypes = () => {
  const { data, error, isLoading } = useSWR("listing_types", getAllListingTypesSWR, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
    dedupingInterval: 60000, // 1 minute
    shouldRetryOnError: false,
  });

  return {
    listingTypes: data,
    isLoading,
    isError: error,
  };
};
