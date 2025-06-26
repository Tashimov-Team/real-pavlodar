import React, { createContext, useState, useContext, useCallback } from 'react';
import { Property, PropertyFilters, PropertyType } from '../types';
import { apiService } from '../services/api';

interface PropertiesContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Promise<Property | undefined>;
  favoriteProperties: string[];
  toggleFavorite: (id: string) => Promise<void>;
  isPending: boolean;
  loadProperties: (filters?: PropertyFilters) => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isPending, setIsPending] = useState(false);
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);

  const loadProperties = useCallback(async (searchFilters?: PropertyFilters) => {
    setIsPending(true);
    try {
      const apiFilters = convertFiltersToApiFormat(searchFilters || filters);
      const response = await apiService.getRealties(apiFilters);
      const convertedProperties = response.data.map(convertApiPropertyToLocal);
      setProperties(convertedProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsPending(false);
    }
  }, [filters]);

  const convertFiltersToApiFormat = (localFilters: PropertyFilters) => {
    const apiFilters: any = {};
    
    if (localFilters.dealType) {
      apiFilters.deal = localFilters.dealType === 'buy' ? 'sale' : 'rent';
    }
    
    if (localFilters.type) {
      const typeMapping = {
        [PropertyType.SECONDARY]: 'apartment',
        [PropertyType.NEW_BUILDING]: 'apartment',
        [PropertyType.HOUSE]: 'house',
        [PropertyType.COMMERCIAL]: 'commercial'
      };
      apiFilters.type = typeMapping[localFilters.type];
    }
    
    if (localFilters.rooms && localFilters.rooms.length > 0) {
      apiFilters.rooms = localFilters.rooms[0]; // API expects single value
    }
    
    if (localFilters.priceMin) apiFilters.price_from = localFilters.priceMin;
    if (localFilters.priceMax) apiFilters.price_to = localFilters.priceMax;
    if (localFilters.areaMin) apiFilters.area_from = localFilters.areaMin;
    if (localFilters.areaMax) apiFilters.area_to = localFilters.areaMax;
    
    if (localFilters.isNewBuilding) apiFilters.is_new_building = true;
    if (localFilters.notFirstFloor) apiFilters.not_first_floor = true;
    if (localFilters.notLastFloor) apiFilters.not_last_floor = true;
    if (localFilters.hasPhotos) apiFilters.with_photos = true;
    
    if (localFilters.constructionYearMin) apiFilters.year_from = localFilters.constructionYearMin;
    if (localFilters.constructionYearMax) apiFilters.year_to = localFilters.constructionYearMax;
    
    return apiFilters;
  };

  const convertApiPropertyToLocal = (apiProperty: any): Property => {
    return {
      id: apiProperty.id.toString(),
      title: `${apiProperty.type} ${apiProperty.rooms ? `${apiProperty.rooms}-комн.` : ''} ${apiProperty.address}`,
      description: apiProperty.description || '',
      type: convertApiTypeToLocal(apiProperty.type, apiProperty.is_new_building),
      dealType: apiProperty.deal === 'sale' ? 'buy' : 'rent',
      price: apiProperty.price,
      area: apiProperty.height || 0,
      rooms: apiProperty.rooms || 1,
      address: apiProperty.address,
      coordinates: apiProperty.coordinates || { lat: 55.751244, lng: 37.618423 },
      floor: apiProperty.floor,
      totalFloors: apiProperty.total_floors || apiProperty.floors,
      isFirstFloor: apiProperty.is_first_floor,
      isLastFloor: apiProperty.is_last_floor,
      hasFurniture: apiProperty.furniture === 'yes' || apiProperty.furniture === true,
      images: apiProperty.images?.map((img: any) => img.path || img) || [],
      realtorId: 'api-realtor',
      createdAt: apiProperty.created_at || new Date().toISOString(),
      updatedAt: apiProperty.updated_at || new Date().toISOString(),
      isApproved: true,
      // Additional API fields
      ownerName: apiProperty.name,
      ownerPhone: apiProperty.phone,
      yearBuilt: apiProperty.year_built,
      balcony: apiProperty.balcony,
      parking: apiProperty.parking,
      flooring: apiProperty.flooring,
      status: apiProperty.status
    };
  };

  const convertApiTypeToLocal = (apiType: string, isNewBuilding?: boolean): PropertyType => {
    if (apiType === 'apartment') {
      return isNewBuilding ? PropertyType.NEW_BUILDING : PropertyType.SECONDARY;
    }
    
    const typeMapping: Record<string, PropertyType> = {
      house: PropertyType.HOUSE,
      commercial: PropertyType.COMMERCIAL,
      land: PropertyType.HOUSE
    };
    
    return typeMapping[apiType] || PropertyType.SECONDARY;
  };

  const filteredProperties = useCallback(() => {
    return properties; // Filtering is now done on the server side
  }, [properties]);

  const toggleFavorite = async (id: string) => {
    try {
      await apiService.toggleFavorite(id);
      setFavoriteProperties(prev => 
        prev.includes(id) 
          ? prev.filter(propId => propId !== id)
          : [...prev, id]
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => {
    setIsPending(true);
    try {
      const apiPropertyData = convertLocalPropertyToApi(propertyData);
      const response = await apiService.createRealty(apiPropertyData);
      const newProperty = convertApiPropertyToLocal(response);
      setProperties(prev => [...prev, newProperty]);
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    setIsPending(true);
    try {
      const apiUpdates = convertLocalPropertyToApi(updates);
      const response = await apiService.updateRealty(id, apiUpdates);
      const updatedProperty = convertApiPropertyToLocal(response);
      setProperties(prev => 
        prev.map(property => 
          property.id === id ? updatedProperty : property
        )
      );
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const deleteProperty = async (id: string) => {
    setIsPending(true);
    try {
      // Note: Delete endpoint might not be available for all users
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const getPropertyById = async (id: string): Promise<Property | undefined> => {
    try {
      const response = await apiService.getRealty(id);
      return convertApiPropertyToLocal(response);
    } catch (error) {
      console.error('Error getting property:', error);
      return undefined;
    }
  };

  const convertLocalPropertyToApi = (localProperty: any) => {
    return {
      name: localProperty.ownerName || '',
      phone: localProperty.ownerPhone || '',
      status: localProperty.status || 'active',
      deal: localProperty.dealType === 'buy' ? 'sale' : 'rent',
      type: localProperty.type === PropertyType.HOUSE ? 'house' : 
            localProperty.type === PropertyType.COMMERCIAL ? 'commercial' : 'apartment',
      price: localProperty.price,
      address: localProperty.address,
      rooms: localProperty.rooms,
      description: localProperty.description,
      year_built: localProperty.yearBuilt,
      height: localProperty.area,
      balcony: localProperty.balcony,
      furniture: localProperty.hasFurniture ? 'yes' : 'no',
      parking: localProperty.parking,
      floor: localProperty.floor,
      floors: localProperty.totalFloors,
      is_first_floor: localProperty.isFirstFloor,
      is_last_floor: localProperty.isLastFloor,
      is_new_building: localProperty.type === PropertyType.NEW_BUILDING,
      total_floors: localProperty.totalFloors,
      coordinates: localProperty.coordinates
    };
  };

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        filteredProperties: filteredProperties(),
        filters,
        setFilters,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        favoriteProperties,
        toggleFavorite,
        isPending,
        loadProperties,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};