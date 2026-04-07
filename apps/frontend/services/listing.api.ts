import { Range } from "react-range";
import createListingProps from "@/types/listing.type";
import { api } from "./api";

export const getAllListingTypesSWR = async () => {
  const res = await api.get("/api/listings/listing_types");
  return res.data;
};

export const getMyListings = async ({
  limit,
  page,
  listing_type_code,

  keyword,
  status,
  sort_by,
}: {
  limit?: number;
  page?: number;
  listing_type_code?: string;
  keyword?: string;
  sort_by?: string;
  status?: string;
}) => {
  let url = `/api/listings/my-listings?limit=${limit}&page=${page}`;
  if (listing_type_code) url += `&listing_type_code=${listing_type_code}`;
  if (status) url += `&status=${status}`;
  if (keyword) url += `&keyword=${keyword}`;
  if (sort_by) url += `&sort_by=${sort_by}`;

  const res = await api.get(url);
  return res.data;
};

export const getPublicListings = async (params: {
  page?: number;
  limit?: number;
  keyword?: string;
  province_code?: number;
  ward_code?: number;
  listing_type_code?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  beds?: number;
  amenities?: string[];
  sort_by?: string;
}) => {
  const { amenities, ...rest } = params;
  let url = `/api/listings?`;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url += `${key}=${value}&`;
    }
  });

  if (amenities && amenities.length > 0) {
    url += `amenities=${amenities.join(",")}&`;
  }

  const res = await api.get(url.slice(0, -1));
  return res.data;
};

export const getPublicMapListings = async (params: {
  page?: number;
  limit?: number;
  keyword?: string;
  province_code?: number;
  ward_code?: number;
  listing_type_code?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  beds?: number;
  amenities?: string[];
  sort_by?: string;
  centerLat?: number;
  centerLong?: number;
  radius?: number;
  minLat?: number;
  maxLat?: number;
  minLng?: number;
  maxLng?: number;
}) => {
  const { amenities, ...rest } = params;
  let url = `/api/listings/map?`;
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url += `${key}=${value}&`;
    }
  });

  if (amenities && amenities.length > 0) {
    url += `amenities=${amenities.join(",")}&`;
  }

  const res = await api.get(url.slice(0, -1));
  return res.data;
};


export const createListing = async (
  listingForm: createListingProps,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    // Handle arrays (amenities)
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    }
    // Handle other values
    else {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.post("/api/listings/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createDraftListing = async (
  listingForm: Partial<createListingProps>,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    // Handle arrays (amenities)
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    }
    // Handle other values
    else {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.post("/api/listings/draft", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getListingDetail = async (id: string) => {
  const res = await api.get(`/api/listings/${id}`);
  return res.data;
};

export const getNearbyDestinations = async (id: string) => {
  const res = await api.get(`/api/listings/${id}/nearby-destinations`);
  return res.data;
};

export const getRelatedListings = async (id: string) => {
  const res = await api.get(`/api/listings/${id}/related`);
  return res.data;
};

export const getMyListingDetail = async (id: string) => {
  const res = await api.get(`/api/listings/my-listings/${id}`);
  return res.data;
};

export const updateDraftListing = async (
  id: string,
  listingForm: Partial<createListingProps>,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.patch(`/api/listings/${id}/draft`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const submitDraftListing = async (
  id: string,
  listingForm: createListingProps,
  files: File[] | null,
  coverImageIndex: string | number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    // Handle arrays (amenities)
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    }
    // Handle other values
    else {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.post(`/api/listings/${id}/submit`, formData, {
    headers: {
      "Content-Type": "mutlipart/form-data",
    },
  });
};

export const updateSoftListing = async (
  id: string,
  listingForm: Partial<createListingProps>,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.patch(`/api/listings/${id}/update-soft`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateHardListing = async (
  id: string,
  listingForm: Partial<createListingProps>,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.patch(`/api/listings/${id}/update-hard`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const hideListing = async (listingId: string) => {
  return api.post(`/api/listings/${listingId}/hide`);
};

export const showListing = async (listingId: string) => {
  return api.post(`/api/listings/${listingId}/show`);
};

export const renewListing = async (listingId: string) => {
  return api.post(`/api/listings/${listingId}/renew`);
};

export const deleteListing = async (listingId: string) => {
  return api.delete(`/api/listings/${listingId}`);
};

export const toggleFavoriteListing = async (listingId: string) => {
  return api.post(`/api/listings/${listingId}/favorite`);
};

export const getListingsForModeration = async ({
  limit,
  page,
  status,
  keyword,
}: {
  limit?: number;
  page?: number;
  status?: string;
  keyword?: string;
}) => {
  let url = `/api/admin/listings/moderation?limit=${limit}&page=${page}`;
  if (status) url += `&status=${status}`;
  if (keyword) url += `&keyword=${keyword}`;
  return api.get(url);
};

export const approveListing = async (id: string) => {
  return api.post(`/api/admin/listings/${id}/approve`);
};

export const rejectListing = async (id: string, reason?: string) => {
  return api.post(`/api/admin/listings/${id}/reject`, { reason });
};

export const getListingForModerationDetail = async (id: string) => {
  const res = await api.get(`/api/admin/listings/${id}`);
  return res.data;
};

export const getListingDetailAdmin = async (id: string) => {
  const res = await api.get(`/api/admin/listings/${id}`);
  return res.data;
};

export const approveEditDraft = async (id: string) => {
  return api.post(`/api/admin/edit-drafts/${id}/approve`);
};

export const rejectEditDraft = async (id: string, reason?: string) => {
  return api.post(`/api/admin/edit-drafts/${id}/reject`, { reason });
};

export const getAllListingsByAdmin = async (params: any) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/admin/listings?${query}`);
};

export const getListingStats = async () => {
  return api.get("/api/admin/listings/stats");
};

export const hardDeleteListingAdmin = async (id: string) => {
  return api.delete(`/api/admin/listings/${id}/hard`);
};

export const updateListingAdmin = async (
  id: string,
  listingForm: Partial<createListingProps>,
  files: File[] | null,
  coverImageIndex: number
) => {
  const formData = new FormData();

  Object.entries(listingForm).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    } else if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  formData.append("coverImageIndex", String(coverImageIndex));

  return api.patch(`/api/admin/listings/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
