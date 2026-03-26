import { api } from "./api";

interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entityType?: string;
}

export const getAuditLogs = async (params: GetAuditLogsParams) => {
  const { data } = await api.get("/api/admin/audit-logs", { params });
  return data;
};

export const getAuditLogById = async (id: string) => {
  const { data } = await api.get(`/api/admin/audit-logs/${id}`);
  return data;
};
