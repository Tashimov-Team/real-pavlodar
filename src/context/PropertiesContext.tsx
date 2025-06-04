import React, { createContext, useState, useContext, useCallback } from 'react';
import { Property, PropertyFilters, PropertyType } from '../types';

// Mock data
const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern 2-bedroom apartment',
    description: 'Beautiful modern apartment in the city center with great views.',
    type: PropertyType.SECONDARY,
    price: 250000,
    area: 75,
    rooms: 2,
    address: '123 Main St, City Center',
    coordinates: { lat: 55.751244, lng: 37.618423 },
    floor: 5,
    totalFloors: 9,
    isFirstFloor: false,
    isLastFloor: false,
    hasFurniture: true,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    realtorId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isApproved: true
  },
  {
    id: 'prop-2',
    title: 'Spacious 3-bedroom house',
    description: 'Family home with garden in a quiet neighborhood.',
    type: PropertyType.HOUSE,
    price: 450000,
    area: 150,
    rooms: 3,
    address: '456 Oak Ave, Suburb',
    coordinates: { lat: 55.761244, lng: 37.628423 },
    hasFurniture: false,
    images: [
      'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'
    ],
    realtorId: 'user-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isApproved: true
  },
  {
    id: 'prop-3',
    title: 'New studio apartment',
    description: 'Brand new studio apartment in a modern complex with all amenities.',
    type: PropertyType.NEW_BUILDING,
    price: 120000,
    area: 45,
    rooms: 1,
    address: '789 New St, Downtown',
    coordinates: { lat: 55.741244, lng: 37.608423 },
    floor: 2,
    totalFloors: 12,
    isFirstFloor: false,
    isLastFloor: false,
    hasFurniture: false,
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg'
    ],
    realtorId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isApproved: true
  },
  {
    id: 'prop-4',
    title: 'Commercial space',
    description: 'Prime retail space in a busy shopping district.',
    type: PropertyType.COMMERCIAL,
    price: 350000,
    area: 120,
    rooms: 2,
    address: '101 Commerce St, Business District',
    coordinates: { lat: 55.731244, lng: 37.638423 },
    floor: 1,
    totalFloors: 5,
    isFirstFloor: true,
    isLastFloor: false,
    hasFurniture: false,
    images: [
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
      'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg'
    ],
    realtorId: 'user-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isApproved: true
  }
];

interface PropertiesContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => Promise<void>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  favoriteProperties: string[];
  toggleFavorite: (id: string) => void;
  isPending: boolean;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isPending, setIsPending] = useState(false);
  
  // Load favorites from localStorage
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteProperties');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = favoriteProperties.includes(id)
      ? favoriteProperties.filter(propId => propId !== id)
      : [...favoriteProperties, id];
    
    setFavoriteProperties(newFavorites);
    localStorage.setItem('favoriteProperties', JSON.stringify(newFavorites));
  };

  const filteredProperties = useCallback(() => {
    return properties.filter(property => {
      // Filter by property type
      if (filters.type && property.type !== filters.type) {
        return false;
      }
      
      // Filter by number of rooms
      if (filters.rooms && filters.rooms.length > 0 && !filters.rooms.includes(property.rooms)) {
        return false;
      }
      
      // Filter by price range
      if (filters.priceMin && property.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && property.price > filters.priceMax) {
        return false;
      }
      
      // Filter by area range
      if (filters.areaMin && property.area < filters.areaMin) {
        return false;
      }
      if (filters.areaMax && property.area > filters.areaMax) {
        return false;
      }
      
      // Advanced filters
      if (filters.notFirstFloor && property.isFirstFloor) {
        return false;
      }
      if (filters.notLastFloor && property.isLastFloor) {
        return false;
      }
      if (filters.hasFurniture !== undefined && property.hasFurniture !== filters.hasFurniture) {
        return false;
      }
      
      // Map area filtering would go here
      // This is simplified - actual implementation would use geographical calculations
      if (filters.coordinates) {
        // Implementation depends on the shape (circle or polygon)
        // For a circle: would calculate distance between property and center point
        // For a polygon: would check if property is inside the polygon
        return true;
      }
      
      return true;
    });
  }, [properties, filters]);

  const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => {
    setIsPending(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newProperty: Property = {
        ...propertyData,
        id: `prop-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isApproved: false,
      };
      
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProperties(prev => 
        prev.map(property => 
          property.id === id
            ? { ...property, ...updates, updatedAt: new Date().toISOString() }
            : property
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const getPropertyById = (id: string) => {
    return properties.find(property => property.id === id);
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