import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import FeedCard from '../components/FeedCard';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Since there's no specific favorites endpoint, we'll need to track them locally
      // or implement a way to get user's favorite properties
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        return;
      }

      // Load each favorite property
      const favoriteProperties = await Promise.all(
        favoriteIds.map(async (id: string) => {
          try {
            return await apiService.getRealty(id);
          } catch (error) {
            console.error(`Error loading favorite property ${id}:`, error);
            return null;
          }
        })
      );

      setFavorites(favoriteProperties.filter(Boolean));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке избранного');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (propertyId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove from favorites list
      setFavorites(prev => prev.filter(property => property.id !== propertyId));
      
      // Update localStorage
      const currentFavorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
      const updatedFavorites = currentFavorites.filter((id: string) => id !== propertyId);
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Войдите в аккаунт</h1>
            <p className="text-gray-600">Чтобы просматривать избранные объекты, необходимо войти в систему</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E54CE]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Ошибка загрузки</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadFavorites}
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
          <div className="flex items-center gap-3">
            <Heart size={32} className="text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">Избранное</h1>
          </div>
          <button
            onClick={loadFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
          >
            <RefreshCw size={20} />
            <span>Обновить</span>
          </button>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Пока нет избранных объектов</h2>
            <p className="text-gray-600 mb-6">
              Добавляйте понравившиеся объекты в избранное, нажимая на иконку сердечка
            </p>
            <a
              href="/feed"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
            >
              <span>Перейти к ленте</span>
            </a>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Найдено {favorites.length} {favorites.length === 1 ? 'объект' : favorites.length < 5 ? 'объекта' : 'объектов'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <FeedCard
                  key={property.id}
                  property={property}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;