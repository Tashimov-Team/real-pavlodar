import React, { useState, useEffect } from 'react';
import PropertyFilter from '../components/PropertyFilter';
import PropertyCard from '../components/PropertyCard';
import PropertyMap from '../components/PropertyMap';
import { useProperties } from '../context/PropertiesContext';
import { PropertyFilters } from '../types';

const CatalogPage: React.FC = () => {
  const { filteredProperties, filters, setFilters, loadProperties, isPending } = useProperties();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    loadProperties(filters);
  }, [filters]);

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

        {isPending && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E54CE]"></div>
          </div>
        )}

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

        {!isPending && filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Объекты не найдены</h2>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;