import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Ruler, Home } from 'lucide-react';
import { Property, PropertyType } from '../types';
import { useProperties } from '../context/PropertiesContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { toggleFavorite, favoriteProperties } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isFavorite = favoriteProperties.includes(property.id);
  
  const propertyTypeLabels = {
    [PropertyType.SECONDARY]: 'Вторичная',
    [PropertyType.NEW_BUILDING]: 'Новостройка',
    [PropertyType.HOUSE]: 'Дом/участок',
    [PropertyType.COMMERCIAL]: 'Коммерческая',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < property.images.length - 1) {
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
      setCurrentImageIndex(property.images.length - 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Image section with navigation */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Image counter */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded-full">
            {currentImageIndex + 1} / {property.images.length}
          </div>
          
          {/* Image navigation */}
          {property.images.length > 1 && (
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
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md transition-transform duration-300 hover:scale-110"
          >
            <Heart 
              size={18} 
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
            />
          </button>
          
          {/* Property type badge */}
          <div className="absolute top-2 left-2 bg-[#0E54CE] text-white text-xs py-1 px-2 rounded-md">
            {propertyTypeLabels[property.type]}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{property.title}</h3>
          </div>
          
          <div className="text-2xl font-bold text-[#0E54CE] mb-3">
            {formatPrice(property.price)}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin size={16} className="mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-gray-700">
              <Home size={16} className="mr-1" />
              <span>{property.rooms} {property.rooms === 1 ? 'комната' : property.rooms < 5 ? 'комнаты' : 'комнат'}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Ruler size={16} className="mr-1" />
              <span>{property.area} м²</span>
            </div>
            
            {property.floor && (
              <div className="text-gray-700">
                {property.floor}/{property.totalFloors} этаж
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;