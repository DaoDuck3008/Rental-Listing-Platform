export default interface createListingProps {
  title: string;
  listing_type_code: string;
  capacity: number;
  price: number;
  area: number;
  beds: number;
  bathrooms: number;
  province_code: number | null;
  ward_code: number | null;
  address: string;
  longitude: number | null;
  latitude: number | null;
  amenities: string[];
  images?: File[];
  description: string;
  showPhoneNumber: boolean;
}
