import { api } from "./api";

export const getDashboardOverview = async () => {
  const res = await api.get("/api/admin/dashboard/overview");
  return res.data.data;
};

export const getDashboardCharts = async () => {
  const res = await api.get("/api/admin/dashboard/charts");
  return res.data.data;
};

export const getDashboardPieChart = async () => {
  const res = await api.get("/api/admin/dashboard/pie-chart");
  return res.data.data;
};

export const getDashboardRecent = async () => {
  const res = await api.get("/api/admin/dashboard/recent");
  return res.data.data;
};
