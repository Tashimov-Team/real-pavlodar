import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Ruler, Home, Phone, ArrowLeft } from 'lucide-react';
import { useProperties } from '../context/PropertiesContext';
import { PropertyType } from '../types';
import ContactModal from '../components/ContactModal';
import PropertyMap from '../components/PropertyMap';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPropertyById, toggleFavorite, favoriteProperties } = useProperties();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const property = getPropertyById(id || '');
  
  if (!property) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="container mx-auto">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Объект не найден
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

  const handleNextImage = () => {
    if (currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    } else {
      setCurrentImageIndex(property.images.length - 1);
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
              <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
              <span className="px-3 py-1 bg-[#0E54CE] text-white text-sm rounded-md">
                {propertyTypeLabels[property.type]}
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
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-500' 
                  : 'border-gray-300 text-gray-700 hover:border-[#0E54CE] hover:text-[#0E54CE]'
              }`}
            >
              <Heart size={20} className={isFavorite ? 'fill-red-500' : ''} />
              <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
            </button>
            
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
              <div className="relative aspect-video">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
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
                    {property.images.map((image, index) => (
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
                          src={image}
                          alt={`${property.title} - изображение ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Property details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Характеристики</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <Home size={20} className="text-[#0E54CE]" />
                  <span>
                    {property.rooms} {property.rooms === 1 ? 'комната' : property.rooms < 5 ? 'комнаты' : 'комнат'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Ruler size={20} className="text-[#0E54CE]" />
                  <span>{property.area} м²</span>
                </div>
                
                {property.floor && (
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
                      <line x1="3" y1="15" x2="21" y2="15"/>
                    </svg>
                    <span>{property.floor}/{property.totalFloors} этаж</span>
                  </div>
                )}
                
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
                  <span>{property.hasFurniture ? 'С мебелью' : 'Без мебели'}</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Описание</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
          
          {/* Right column - Map and contact */}
          <div className="space-y-8">
            {/* Map */}
            <PropertyMap 
              properties={[property]} 
              height="300px"
            />
            
            {/* Contact card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Связаться с нами</h2>
              <p className="text-gray-600 mb-6">
                Оставьте заявку, и наш специалист свяжется с вами для уточнения деталей и организации просмотра
              </p>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
              >
                <Phone size={20} />
                <span>Оставить заявку</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        propertyId={property.id}
      />
    </div>
  );
};

export default PropertyDetailPage;