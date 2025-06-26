import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Ruler, Home, Phone, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

interface FeedCardProps {
  property: any;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ property, onFavoriteToggle }) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (property.images && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      setCurrentImageIndex(property.images?.length - 1 || 0);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    setIsToggling(true);
    try {
      await apiService.toggleFavorite(property.id);
      const newFavoriteState = !isFavorite;
      setIsFavorite(newFavoriteState);
      onFavoriteToggle?.(property.id, newFavoriteState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'Квартира',
      house: 'Дом',
      commercial: 'Коммерческая',
      land: 'Участок'
    };
    return labels[type] || type;
  };

  const getDealTypeLabel = (deal: string) => {
    return deal === 'sale' ? 'Продажа' : 'Аренда';
  };

  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image section */}
        <div className="relative h-48 overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[currentImageIndex]?.path || property.images[currentImageIndex]}
              alt={property.address}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Home size={48} className="text-gray-400" />
            </div>
          )}
          
          {/* Image counter */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded-full">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          )}
          
          {/* Image navigation */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
          
          {/* Favorite button */}
          {user && (
            <button
              onClick={handleFavoriteClick}
              disabled={isToggling}
              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md transition-transform duration-300 hover:scale-110 disabled:opacity-50"
            >
              <Heart 
                size={18} 
                className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
              />
            </button>
          )}
          
          {/* Property type and deal type badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <div className="bg-[#0E54CE] text-white text-xs py-1 px-2 rounded-md">
              {getPropertyTypeLabel(property.type)}
            </div>
            <div className="bg-green-500 text-white text-xs py-1 px-2 rounded-md">
              {getDealTypeLabel(property.deal)}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="text-2xl font-bold text-[#0E54CE] mb-2">
              {formatPrice(property.price)}
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-3">
            {property.rooms && (
              <div className="flex items-center text-gray-700">
                <Home size={16} className="mr-1" />
                <span>{property.rooms} {property.rooms === 1 ? 'комната' : property.rooms < 5 ? 'комнаты' : 'комнат'}</span>
              </div>
            )}
            
            {property.height && (
              <div className="flex items-center text-gray-700">
                <Ruler size={16} className="mr-1" />
                <span>{property.height} м²</span>
              </div>
            )}
            
            {property.floor && property.total_floors && (
              <div className="text-gray-700">
                {property.floor}/{property.total_floors} этаж
              </div>
            )}
          </div>

          {/* Owner info (only for realtors) */}
          {user?.role === 'realtor' && property.name && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <User size={14} />
                <span>{property.name}</span>
              </div>
              {property.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{property.phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Description preview */}
          {property.description && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeedCard;