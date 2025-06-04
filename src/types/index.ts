export enum UserRole {
  GUEST = 'guest',
  REALTOR = 'realtor',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export enum PropertyType {
  SECONDARY = 'secondary',
  NEW_BUILDING = 'new_building',
  HOUSE = 'house',
  COMMERCIAL = 'commercial'
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  area: number;
  rooms: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  floor?: number;
  totalFloors?: number;
  isFirstFloor?: boolean;
  isLastFloor?: boolean;
  hasFurniture?: boolean;
  images: string[];
  realtorId: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface PropertyFilters {
  type?: PropertyType;
  rooms?: number[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  notFirstFloor?: boolean;
  notLastFloor?: boolean;
  hasFurniture?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
    radius: number;
  } | {
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  };
}

export interface ContactRequest {
  id: string;
  name: string;
  phone: string;
  message?: string;
  propertyId?: string;
  createdAt: string;
  isProcessed: boolean;
}