import React, { useState } from 'react';
import PropertyFilter from '../components/PropertyFilter';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import { useProperties } from '../context/PropertiesContext';
import { PropertyFilters } from '../types';

const CatalogPage: React.FC = () => {
  const { filteredProperties, filters, setFilters } = useProperties();
  const [showMap, setShowMap] = useState(false);

  const handleAreaSelect = (bounds: {north: number, south: number, east: number, west: number}) => {
    setFilters({
      ...filters,
      coordinates: { bounds }
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Каталог недвижимости</h1>
          <button
            onClick={() => setShowMap(!showMap)}
            className="py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showMap ? 'Показать список' : 'Показать на карте'}
          </button>
        </div>

        <PropertyFilter 
          filters={filters}
          onFilterChange={setFilters}
        />

        {showMap ? (
          <PropertyMap 
            properties={filteredProperties}
            onAreaSelect={handleAreaSelect}
            height="600px"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;