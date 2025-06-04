import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Home, Building2, DollarSign, Ruler } from 'lucide-react';
import { PropertyFilters, PropertyType, DealType, BuildingType, BalconyType, ParkingType, FurnitureType } from '../types';

interface PropertyFilterProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ filters, onFilterChange }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleDealTypeChange = (type: DealType) => {
    onFilterChange({ ...filters, dealType: type });
  };

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
  
  const handleAdvancedFilterChange = (key: keyof PropertyFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const handleResetFilters = () => {
    onFilterChange({});
    setIsAdvancedOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Deal Type Selection */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => handleDealTypeChange(DealType.BUY)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.dealType === DealType.BUY || !filters.dealType
                ? 'bg-white shadow text-[#0E54CE]'
                : 'text-gray-600 hover:text-[#0E54CE]'
            }`}
          >
            Купить
          </button>
          <button
            onClick={() => handleDealTypeChange(DealType.RENT)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filters.dealType === DealType.RENT
                ? 'bg-white shadow text-[#0E54CE]'
                : 'text-gray-600 hover:text-[#0E54CE]'
            }`}
          >
            Снять
          </button>
        </div>
      </div>

      {/* Property Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Тип недвижимости</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`py-3 px-4 rounded-lg border ${
              !filters.type 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors flex items-center justify-center gap-2`}
          >
            <Home size={20} />
            <span>Все</span>
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.SECONDARY)}
            className={`py-3 px-4 rounded-lg border ${
              filters.type === PropertyType.SECONDARY 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors flex items-center justify-center gap-2`}
          >
            <Building2 size={20} />
            <span>Вторичная</span>
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.NEW_BUILDING)}
            className={`py-3 px-4 rounded-lg border ${
              filters.type === PropertyType.NEW_BUILDING 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors flex items-center justify-center gap-2`}
          >
            <Building2 size={20} />
            <span>Новостройки</span>
          </button>
          <button
            onClick={() => handleTypeChange(PropertyType.HOUSE)}
            className={`py-3 px-4 rounded-lg border ${
              filters.type === PropertyType.HOUSE 
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors flex items-center justify-center gap-2`}
          >
            <Home size={20} />
            <span>Дома</span>
          </button>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleAdvancedFilterChange('hasPhotos', !filters.hasPhotos)}
            className={`px-4 py-2 rounded-lg border ${
              filters.hasPhotos
                ? 'bg-[#0E54CE]/10 text-[#0E54CE] border-[#0E54CE]'
                : 'bg-white text-gray-700 border-gray-200'
            } transition-colors`}
          >
            С фото
          </button>
          <button
            onClick={() => handleAdvancedFilterChange('isNewBuilding', !filters.isNewBuilding)}
            className={`px-4 py-2 rounded-lg border ${
              filters.isNewBuilding
                ? 'bg-[#0E54CE]/10 text-[#0E54CE] border-[#0E54CE]'
                : 'bg-white text-gray-700 border-gray-200'
            } transition-colors`}
          >
            Новостройка
          </button>
        </div>
      </div>

      {/* Rooms Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Количество комнат</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map(room => (
            <button
              key={room}
              onClick={() => handleRoomChange(room)}
              className={`min-w-[60px] py-2 px-4 rounded-lg border ${
                filters.rooms?.includes(room)
                  ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
              } transition-colors`}
            >
              {room}
            </button>
          ))}
          <button
            onClick={() => handleRoomChange(5)}
            className={`min-w-[60px] py-2 px-4 rounded-lg border ${
              filters.rooms?.includes(5)
                ? 'bg-[#0E54CE] text-white border-[#0E54CE]' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE] hover:text-[#0E54CE]'
            } transition-colors`}
          >
            5+
          </button>
        </div>
      </div>
      
      {/* Price and Area Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <DollarSign size={20} className="text-[#0E54CE]" />
            <span>Стоимость, ₸</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="От"
                value={filters.priceMin || ''}
                onChange={handlePriceMinChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="До"
                value={filters.priceMax || ''}
                onChange={handlePriceMaxChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Ruler size={20} className="text-[#0E54CE]" />
            <span>Площадь, м²</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                placeholder="От"
                value={filters.areaMin || ''}
                onChange={handleAreaMinChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="До"
                value={filters.areaMax || ''}
                onChange={handleAreaMaxChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Filters */}
      <div className="border-t pt-4">
        <button 
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center text-[#0E54CE] hover:text-[#0E54CE]/80"
        >
          <SlidersHorizontal size={20} className="mr-2" />
          <span>Расширенный поиск</span>
          {isAdvancedOpen ? (
            <ChevronUp size={20} className="ml-2" />
          ) : (
            <ChevronDown size={20} className="ml-2" />
          )}
        </button>
        
        {isAdvancedOpen && (
          <div className="mt-6 space-y-6">
            {/* Building Features */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Характеристики дома</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                {/* Building Type */}
                <div className="col-span-full">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Тип дома</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(BuildingType).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          const current = filters.buildingType || [];
                          const updated = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          handleAdvancedFilterChange('buildingType', updated);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.buildingType?.includes(type)
                            ? 'bg-[#0E54CE]/10 text-[#0E54CE] border border-[#0E54CE]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === BuildingType.BRICK ? 'Кирпичный' :
                         type === BuildingType.PANEL ? 'Панельный' :
                         type === BuildingType.MONOLITHIC ? 'Монолитный' :
                         'Деревянный'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Дополнительно</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Balcony Type */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Балкон</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(BalconyType).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          const current = filters.balconyType || [];
                          const updated = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          handleAdvancedFilterChange('balconyType', updated);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.balconyType?.includes(type)
                            ? 'bg-[#0E54CE]/10 text-[#0E54CE] border border-[#0E54CE]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === BalconyType.NONE ? 'Нет' :
                         type === BalconyType.BALCONY ? 'Балкон' :
                         'Лоджия'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parking Type */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Парковка</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(ParkingType).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          const current = filters.parkingType || [];
                          const updated = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          handleAdvancedFilterChange('parkingType', updated);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.parkingType?.includes(type)
                            ? 'bg-[#0E54CE]/10 text-[#0E54CE] border border-[#0E54CE]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === ParkingType.NONE ? 'Нет' :
                         type === ParkingType.STREET ? 'Уличная' :
                         type === ParkingType.GUARDED ? 'Охраняемая' :
                         'Подземная'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Furniture Type */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Мебель</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(FurnitureType).map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          const current = filters.furnitureType || [];
                          const updated = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          handleAdvancedFilterChange('furnitureType', updated);
                        }}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.furnitureType?.includes(type)
                            ? 'bg-[#0E54CE]/10 text-[#0E54CE] border border-[#0E54CE]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === FurnitureType.NONE ? 'Без мебели' :
                         type === FurnitureType.PARTIAL ? 'Частично' :
                         'Полностью'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Construction Year Range */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Год постройки</h4>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.constructionYearMin || ''}
                  onChange={(e) => handleAdvancedFilterChange('constructionYearMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={filters.constructionYearMax || ''}
                  onChange={(e) => handleAdvancedFilterChange('constructionYearMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Reset Filters */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  );
};

export default PropertyFilter;