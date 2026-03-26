import {
  getAllListingTypesSWR,
  getPublicListings,
} from "@/services/listing.api";
import useSWR from "swr";

export const useListingTypes = () => {
  const { data, error, isLoading } = useSWR(
    "listing_types",
    getAllListingTypesSWR,
    {
      dedupingInterval: 3 * 60 * 60 * 1000,
    }
  );

  return {
    listingTypes: data,
    isLoading,
    error,
  };
};
