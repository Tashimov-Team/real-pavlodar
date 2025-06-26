import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Ruler, Home, Phone, ArrowLeft, User, Mail, Calendar, Building } from 'lucide-react';
import { useProperties } from '../context/PropertiesContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import ContactModal from '../components/ContactModal';
import PropertyMap from '../components/PropertyMap';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favoriteProperties, toggleFavorite } = useProperties();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const propertyData = await apiService.getRealty(id);
        setProperty(propertyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке объекта');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E54CE]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Объект не найден'}
            </h1>
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center text-[#0E54CE] hover:text-[#0E54CE]/80"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Вернуться в каталог</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favoriteProperties.includes(property.id.toString());
  
  const getPropertyTypeLabel = (type: string, isNewBuilding?: boolean) => {
    if (type === 'apartment') {
      return isNewBuilding ? 'Новостройка' : 'Вторичная';
    }
    const labels: Record<string, string> = {
      house: 'Дом',
      commercial: 'Коммерческая',
      land: 'Участок'
    };
    return labels[type] || type;
  };

  const getDealTypeLabel = (deal: string) => {
    return deal === 'sale' ? 'Продажа' : 'Аренда';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNextImage = () => {
    if (property.images && currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      setCurrentImageIndex(property.images?.length - 1 || 0);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;
    
    setIsToggling(true);
    try {
      await toggleFavorite(property.id.toString());
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-[#0E54CE]"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Назад</span>
          </button>
        </div>
        
        {/* Property header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">
                {getPropertyTypeLabel(property.type, property.is_new_building)} {property.rooms ? `${property.rooms}-комн.` : ''}
              </h1>
              <span className="px-3 py-1 bg-[#0E54CE] text-white text-sm rounded-md">
                {getDealTypeLabel(property.deal)}
              </span>
            </div>
            <p className="flex items-center text-gray-600 mb-2">
              <MapPin size={18} className="mr-2" />
              {property.address}
            </p>
            <div className="text-3xl font-bold text-[#0E54CE]">
              {formatPrice(property.price)}
            </div>
          </div>
          
          <div className="flex gap-3">
            {user && (
              <button
                onClick={handleFavoriteToggle}
                disabled={isToggling}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors disabled:opacity-50 ${
                  isFavorite 
                    ? 'bg-red-50 border-red-200 text-red-500' 
                    : 'border-gray-300 text-gray-700 hover:border-[#0E54CE] hover:text-[#0E54CE]'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500' : ''} />
                <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
              </button>
            )}
            
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
            >
              <Phone size={20} />
              <span>Связаться</span>
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <>
                  <div className="relative aspect-video">
                    <img
                      src={property.images[currentImageIndex]?.path || property.images[currentImageIndex]}
                      alt={property.address}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image navigation */}
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ArrowLeft size={24} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ArrowLeft size={24} className="rotate-180" />
                        </button>
                        
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm py-1 px-3 rounded-full">
                          {currentImageIndex + 1} / {property.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail strip */}
                  {property.images.length > 1 && (
                    <div className="p-4 overflow-x-auto">
                      <div className="flex gap-2">
                        {property.images.map((image: any, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex 
                                ? 'border-[#0E54CE]' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.path || image}
                              alt={`${property.address} - изображение ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <Home size={64} className="text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Property details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Характеристики</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.rooms && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Home size={20} className="text-[#0E54CE]" />
                    <span>
                      {property.rooms} {property.rooms === 1 ? 'комната' : property.rooms < 5 ? 'комнаты' : 'комнат'}
                    </span>
                  </div>
                )}
                
                {property.height && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Ruler size={20} className="text-[#0E54CE]" />
                    <span>{property.height} м²</span>
                  </div>
                )}
                
                {property.floor && property.total_floors && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building size={20} className="text-[#0E54CE]" />
                    <span>{property.floor}/{property.total_floors} этаж</span>
                  </div>
                )}
                
                {property.year_built && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar size={20} className="text-[#0E54CE]" />
                    <span>Год постройки: {property.year_built}</span>
                  </div>
                )}
                
                {property.balcony && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-[#0E54CE]"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                    </svg>
                    <span>Балкон: {property.balcony === 'yes' ? 'Есть' : 'Нет'}</span>
                  </div>
                )}
                
                {property.parking && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-[#0E54CE]"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10,9 9,9 8,9"/>
                    </svg>
                    <span>Парковка: {property.parking === 'yes' ? 'Есть' : 'Нет'}</span>
                  </div>
                )}
                
                {property.furniture && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-[#0E54CE]"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span>Мебель: {property.furniture === 'yes' ? 'Есть' : 'Нет'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Описание</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>
            )}
          </div>
          
          {/* Right column - Realtor info and contact */}
          <div className="space-y-8">
            {/* Realtor info */}
            {property.name && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Контактная информация</h2>
                
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{property.name}</h3>
                    <p className="text-gray-600">Владелец</p>
                  </div>
                </div>
                
                {property.phone && (
                  <div className="flex items-center gap-3 text-gray-700 mb-3">
                    <Phone size={20} className="text-[#0E54CE]" />
                    <a 
                      href={`tel:${property.phone}`}
                      className="hover:text-[#0E54CE] transition-colors"
                    >
                      {property.phone}
                    </a>
                  </div>
                )}
                
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
                >
                  <Phone size={20} />
                  <span>Связаться с владельцем</span>
                </button>
              </div>
            )}

            {/* Map */}
            {property.coordinates && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-bold text-gray-800">Расположение</h2>
                </div>
                <div className="h-[300px] bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Карта с координатами объекта</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        propertyId={property.id.toString()}
      />
    </div>
  );
};

export default PropertyDetailPage;