import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { PropertyFilters, PropertyType } from '../types';

interface PropertyFilterProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ filters, onFilterChange }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleTypeChange = (type: PropertyType | undefined) => {
    onFilterChange({ ...filters, type });
  };
  
  const handleRoomChange = (room: number) => {
    const currentRooms = filters.rooms || [];
    const newRooms = currentRooms.includes(room)
      ? currentRooms.filter(r => r !== room)
      : [...currentRooms, room];
    
    onFilterChange({ ...filters, rooms: newRooms.length > 0 ? newRooms : undefined });
  };
  
  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filters, priceMin: value });
  };
  
  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filters, priceMax: value });
  };
  
  const handleAreaMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filters, areaMin: value });
  };
  
  const handleAreaMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onFilterChange({ ...filters, areaMax: value });
  };
  
  const handleAdvancedFilterChange = (key: keyof PropertyFilters, value: boolean) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const handleResetFilters = () => {
    onFilterChange({});
    setIsAdvancedOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Тип недвижимости</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`py-2 px-4 rounded-md border ${
              !filters.type 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            Все
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.SECONDARY)}
            className={`py-2 px-4 rounded-md border ${
              filters.type === PropertyType.SECONDARY 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            Вторичная
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.NEW_BUILDING)}
            className={`py-2 px-4 rounded-md border ${
              filters.type === PropertyType.NEW_BUILDING 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            Новостройки
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.HOUSE)}
            className={`py-2 px-4 rounded-md border ${
              filters.type === PropertyType.HOUSE 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            Дома и участки
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.COMMERCIAL)}
            className={`py-2 px-4 rounded-md border ${
              filters.type === PropertyType.COMMERCIAL 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors col-span-2 md:col-span-4 mt-2`}
          >
            Коммерческая
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Количество комнат</h3>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(room => (
            <button
              key={room}
              onClick={() => handleRoomChange(room)}
              className={`flex-1 py-2 px-4 rounded-md border ${
                filters.rooms?.includes(room)
                  ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
              } transition-colors`}
            >
              {room}
            </button>
          ))}
          <button
            onClick={() => handleRoomChange(5)}
            className={`flex-1 py-2 px-4 rounded-md border ${
              filters.rooms?.includes(5)
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            5+
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Стоимость, ₽</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="От"
                value={filters.priceMin || ''}
                onChange={handlePriceMinChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="До"
                value={filters.priceMax || ''}
                onChange={handlePriceMaxChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Площадь, м²</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="От"
                value={filters.areaMin || ''}
                onChange={handleAreaMinChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="До"
                value={filters.areaMax || ''}
                onChange={handleAreaMaxChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <button 
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center text-[#0E54CE] hover:text-[#0E54CE]/80"
        >
          <SlidersHorizontal size={18} className="mr-2" />
          <span>Расширенный поиск</span>
          {isAdvancedOpen ? (
            <ChevronUp size={18} className="ml-2" />
          ) : (
            <ChevronDown size={18} className="ml-2" />
          )}
        </button>
        
        {isAdvancedOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notFirstFloor"
                checked={!!filters.notFirstFloor}
                onChange={(e) => handleAdvancedFilterChange('notFirstFloor', e.target.checked)}
                className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
              />
              <label htmlFor="notFirstFloor" className="ml-2 text-gray-700">
                Не первый этаж
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notLastFloor"
                checked={!!filters.notLastFloor}
                onChange={(e) => handleAdvancedFilterChange('notLastFloor', e.target.checked)}
                className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
              />
              <label htmlFor="notLastFloor" className="ml-2 text-gray-700">
                Не последний этаж
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasFurniture"
                checked={!!filters.hasFurniture}
                onChange={(e) => handleAdvancedFilterChange('hasFurniture', e.target.checked)}
                className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
              />
              <label htmlFor="hasFurniture" className="ml-2 text-gray-700">
                С мебелью
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default PropertyFilter;