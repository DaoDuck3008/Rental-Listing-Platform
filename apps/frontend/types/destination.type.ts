export interface DestinationProps {
  id?: string | number;
  name: string;
  type: string;
  longitude: number | null;
  latitude: number | null;
  province_code?: number | null;
  ward_code?: number | null;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
