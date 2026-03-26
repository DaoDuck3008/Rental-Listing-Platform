import { api } from "./api";

export const getDestinationStats = async () => {
  return await api.get("/api/destinations/stats");
};

export const getDestinationById = async (id: string | number) => {
  return await api.get(`/api/destinations/${id}`);
};

export const getAllDestinations = async (params: {
  limit?: number;
  page?: number;
  keyword?: string;
  type?: string;
}) => {
  return await api.get("/api/destinations", { params });
};

export const createDestination = async (data: any) => {
  return await api.post("/api/destinations", data);
};

export const updateDestination = async (id: string | number, data: any) => {
  return await api.patch(`/api/destinations/${id}`, data);
};

export const deleteDestination = async (id: string | number) => {
  return await api.delete(`/api/destinations/${id}`);
};
