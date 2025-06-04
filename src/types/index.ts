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

export enum DealType {
  BUY = 'buy',
  RENT = 'rent'
}

export enum BuildingType {
  BRICK = 'brick',
  PANEL = 'panel',
  MONOLITHIC = 'monolithic',
  WOODEN = 'wooden'
}

export enum BalconyType {
  NONE = 'none',
  BALCONY = 'balcony',
  LOGGIA = 'loggia'
}

export enum FurnitureType {
  NONE = 'none',
  PARTIAL = 'partial',
  FULL = 'full'
}

export enum FlooringType {
  LAMINATE = 'laminate',
  LINOLEUM = 'linoleum',
  PARQUET = 'parquet',
  TILE = 'tile',
  CARPET = 'carpet'
}

export enum ParkingType {
  NONE = 'none',
  STREET = 'street',
  GUARDED = 'guarded',
  UNDERGROUND = 'underground'
}

export interface SecurityFeatures {
  intercom: boolean;
  cctv: boolean;
  security: boolean;
  concierge: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
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
  buildingType?: BuildingType;
  constructionYear?: number;
  balconyType?: BalconyType;
  parkingType?: ParkingType;
  furnitureType: FurnitureType;
  flooringType?: FlooringType;
  ceilingHeight?: number;
  security: SecurityFeatures;
  images: string[];
  realtorId: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
}

export interface PropertyFilters {
  dealType?: DealType;
  type?: PropertyType;
  rooms?: number[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  notFirstFloor?: boolean;
  notLastFloor?: boolean;
  hasPhotos?: boolean;
  isNewBuilding?: boolean;
  buildingType?: BuildingType[];
  balconyType?: BalconyType[];
  parkingType?: ParkingType[];
  furnitureType?: FurnitureType[];
  constructionYearMin?: number;
  constructionYearMax?: number;
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