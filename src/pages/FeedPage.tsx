import React, { useState, useEffect, useCallback } from 'react';
import { Filter, RefreshCw } from 'lucide-react';
import FeedCard from '../components/FeedCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface FeedFilters {
  deal?: string;
  type?: string;
  rooms?: number;
  price_from?: number;
  price_to?: number;
  area_from?: number;
  area_to?: number;
  is_new_building?: boolean;
  not_first_floor?: boolean;
  not_last_floor?: boolean;
  balcony?: boolean;
  parking?: boolean;
  furniture?: boolean;
  with_photos?: boolean;
  year_from?: number;
  year_to?: number;
}

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FeedFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMoreProperties = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const response = await apiService.getFeed({
        ...filters,
        page: currentPage,
      });

      if (currentPage === 1) {
        setProperties(response.data);
      } else {
        setProperties(prev => [...prev, ...response.data]);
      }

      setHasMore(response.next_page_url !== null);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке');
    } finally {
      setLoading(false);
      setIsFetchingComplete();
    }
  }, [currentPage, filters, hasMore, loading]);

  const { observer, isFetching, setIsFetchingComplete } = useInfiniteScroll(
    loadMoreProperties,
    { threshold: 0.1 }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    setProperties([]);
    
    try {
      const response = await apiService.getFeed({
        ...filters,
        page: 1,
      });
      
      setProperties(response.data);
      setHasMore(response.next_page_url !== null);
      setCurrentPage(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters: FeedFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setHasMore(true);
    setProperties([]);
  };

  const handleFavoriteToggle = (propertyId: string, isFavorite: boolean) => {
    // Update local state if needed
    console.log(`Property ${propertyId} favorite status: ${isFavorite}`);
  };

  // Initial load
  useEffect(() => {
    loadMoreProperties();
  }, []);

  // Reload when filters change
  useEffect(() => {
    if (currentPage === 1 && Object.keys(filters).length > 0) {
      loadMoreProperties();
    }
  }, [filters]);

  if (error && properties.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка загрузки</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Лента недвижимости</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              <span>Фильтры</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-[#0E54CE] text-white rounded-md transition-colors ${
                refreshing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0E54CE]/90'
              }`}
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
              <span>Обновить</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Фильтры</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Deal Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип сделки
                </label>
                <select
                  value={filters.deal || ''}
                  onChange={(e) => handleFilterChange({ ...filters, deal: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                >
                  <option value="">Все</option>
                  <option value="sale">Продажа</option>
                  <option value="rent">Аренда</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип недвижимости
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange({ ...filters, type: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                >
                  <option value="">Все</option>
                  <option value="apartment">Квартира</option>
                  <option value="house">Дом</option>
                  <option value="commercial">Коммерческая</option>
                  <option value="land">Участок</option>
                </select>
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Комнат
                </label>
                <select
                  value={filters.rooms || ''}
                  onChange={(e) => handleFilterChange({ ...filters, rooms: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                >
                  <option value="">Любое</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Price From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена от, ₸
                </label>
                <input
                  type="number"
                  value={filters.price_from || ''}
                  onChange={(e) => handleFilterChange({ ...filters, price_from: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                  placeholder="Минимальная цена"
                />
              </div>

              {/* Price To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена до, ₸
                </label>
                <input
                  type="number"
                  value={filters.price_to || ''}
                  onChange={(e) => handleFilterChange({ ...filters, price_to: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                  placeholder="Максимальная цена"
                />
              </div>

              {/* Area From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Площадь от, м²
                </label>
                <input
                  type="number"
                  value={filters.area_from || ''}
                  onChange={(e) => handleFilterChange({ ...filters, area_from: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                  placeholder="Минимальная площадь"
                />
              </div>

              {/* Area To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Площадь до, м²
                </label>
                <input
                  type="number"
                  value={filters.area_to || ''}
                  onChange={(e) => handleFilterChange({ ...filters, area_to: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                  placeholder="Максимальная площадь"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_new_building || false}
                  onChange={(e) => handleFilterChange({ ...filters, is_new_building: e.target.checked || undefined })}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Новостройка</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.not_first_floor || false}
                  onChange={(e) => handleFilterChange({ ...filters, not_first_floor: e.target.checked || undefined })}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Не первый этаж</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.balcony || false}
                  onChange={(e) => handleFilterChange({ ...filters, balcony: e.target.checked || undefined })}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Балкон</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.with_photos || false}
                  onChange={(e) => handleFilterChange({ ...filters, with_photos: e.target.checked || undefined })}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">С фото</span>
              </label>
            </div>

            {/* Reset Filters */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleFilterChange({})}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <FeedCard
              key={property.id}
              property={property}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {(loading || isFetching) && properties.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E54CE]"></div>
          </div>
        )}

        {/* Initial loading */}
        {loading && properties.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E54CE]"></div>
          </div>
        )}

        {/* No more properties */}
        {!hasMore && properties.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Больше объектов нет</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Объекты не найдены</h2>
            <p className="text-gray-600">Попробуйте изменить фильтры поиска</p>
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observer} className="h-4" />
      </div>
    </div>
  );
};

export default FeedPage;