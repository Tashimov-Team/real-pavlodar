import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Shield, Clock, Phone, MapPin, Home } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import { PropertyType, DealType } from '../types';
import { useProperties } from '../context/PropertiesContext';

const HomePage: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { properties } = useProperties();
  const [quickFilters, setQuickFilters] = useState({
    dealType: DealType.BUY,
    type: undefined as PropertyType | undefined,
    priceMin: '',
    priceMax: '',
    rooms: [] as number[]
  });

  // Get top 5 properties (in a real app, this would be based on views/popularity)
  const topProperties = properties.slice(0, 5);

  const handleQuickSearch = () => {
    const searchParams = new URLSearchParams();
    if (quickFilters.dealType) searchParams.append('dealType', quickFilters.dealType);
    if (quickFilters.type) searchParams.append('type', quickFilters.type);
    if (quickFilters.priceMin) searchParams.append('priceMin', quickFilters.priceMin);
    if (quickFilters.priceMax) searchParams.append('priceMax', quickFilters.priceMax);
    if (quickFilters.rooms.length) searchParams.append('rooms', quickFilters.rooms.join(','));

    window.location.href = `/catalog?${searchParams.toString()}`;
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
              src="https://images.pexels.com/photos/1642125/pexels-photo-1642125.jpeg"
              alt="Modern building"
              className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-center">
                Найдите идеальную недвижимость вместе с нами
              </h1>

              {/* Quick Search Filters */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['Купить', 'Снять'].map(type => (
                      <button
                          key={type}
                          onClick={() => setQuickFilters(prev => ({ ...prev, dealType: type.toLowerCase() }))}
                          className={`w-full px-4 py-2 rounded-md ${
                              quickFilters.dealType === type.toLowerCase()
                                  ? 'bg-[#0E54CE] text-white'
                                  : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {type}
                      </button>
                  ))}
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Rooms */}
                  <div>
                    <label className="block text-gray-700 mb-2">Комнатность</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, '4+'].map(room => (
                          <button
                              key={room}
                              onClick={() => {
                                setQuickFilters(prev => ({
                                  ...prev,
                                  rooms: prev.rooms.includes(room)
                                      ? prev.rooms.filter(r => r !== room)
                                      : [...prev.rooms, room]
                                }));
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg border ${
                                  quickFilters.rooms.includes(room)
                                      ? 'bg-[#0E54CE] text-white border-[#0E54CE]'
                                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#0E54CE]'
                              }`}
                          >
                            {room}
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-gray-700 mb-2">Стоимость, ₸</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="Цена от"
                            value={quickFilters.priceMin}
                            onChange={(e) => setQuickFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE] pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₸</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                            type="number"
                            placeholder="до"
                            value={quickFilters.priceMax}
                            onChange={(e) => setQuickFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE] pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">₸</span>
                      </div>
                    </div>
                  </div>

                  {/* Area Range */}
                  <div>
                    <label className="block text-gray-700 mb-2">Площадь, м²</label>
                    <div className="flex gap-2">
                      <input
                          type="number"
                          placeholder="От"
                          value={quickFilters.areaMin}
                          onChange={(e) => setQuickFilters(prev => ({ ...prev, areaMin: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                      />
                      <input
                          type="number"
                          placeholder="До"
                          value={quickFilters.areaMax}
                          onChange={(e) => setQuickFilters(prev => ({ ...prev, areaMax: e.target.value }))}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                      onClick={handleQuickSearch}
                      className="flex-1 py-3 bg-[#0E54CE] text-white rounded-lg hover:bg-[#0E54CE] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Показать предложения</span>
                  </button>
                  <button
                      onClick={() => setQuickFilters({ dealType: undefined, rooms: [], priceMin: '', priceMax: '', areaMin: '', areaMax: '' })}
                      className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные предложения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProperties.map(property => (
                <Link
                    key={property.id}
                    to={`/property/${property.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#0E54CE] text-white text-xs py-1 px-2 rounded-md">
                      {property.type === PropertyType.SECONDARY ? 'Вторичная' :
                          property.type === PropertyType.NEW_BUILDING ? 'Новостройка' :
                              property.type === PropertyType.HOUSE ? 'Дом' : 'Коммерческая'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{property.title}</h3>
                    <div className="text-xl font-bold text-[#0E54CE] mb-2">
                      {new Intl.NumberFormat('ru-RU', {
                        style: 'currency',
                        currency: 'RUB',
                        maximumFractionDigits: 0
                      }).format(property.price)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span className="truncate">{property.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <Home size={16} className="mr-1" />
                        <span>{property.rooms} комн.</span>
                      </div>
                      <div>{property.area} м²</div>
                      {property.floor && (
                          <div>{property.floor}/{property.totalFloors} этаж</div>
                      )}
                    </div>
                  </div>
                </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E54CE] text-white rounded-lg hover:bg-[#0E54CE]/90 transition-colors"
            >
              <Search size={20} />
              <span>Смотреть все предложения</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Типы недвижимости</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to={`/catalog?type=${PropertyType.SECONDARY}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/2121120/pexels-photo-2121120.jpeg"
                    alt="Вторичная недвижимость"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Вторичная недвижимость</h3>
                  <p className="text-gray-600 mb-4">Большой выбор квартир в готовых домах с развитой инфраструктурой</p>
                  <div className="text-[#0E54CE] font-medium flex items-center">
                    <span>Подробнее</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link 
              to={`/catalog?type=${PropertyType.NEW_BUILDING}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
                    alt="Новостройки"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Новостройки</h3>
                  <p className="text-gray-600 mb-4">Современные жилые комплексы с улучшенными планировками и отделкой</p>
                  <div className="text-[#0E54CE] font-medium flex items-center">
                    <span>Подробнее</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link 
              to={`/catalog?type=${PropertyType.HOUSE}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg"
                    alt="Дома и участки"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Дома и участки</h3>
                  <p className="text-gray-600 mb-4">Частные дома, коттеджи и земельные участки для строительства</p>
                  <div className="text-[#0E54CE] font-medium flex items-center">
                    <span>Подробнее</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link 
              to={`/catalog?type=${PropertyType.COMMERCIAL}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg"
                    alt="Коммерческая недвижимость"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Коммерческая недвижимость</h3>
                  <p className="text-gray-600 mb-4">Офисы, торговые помещения и другие объекты для бизнеса</p>
                  <div className="text-[#0E54CE] font-medium flex items-center">
                    <span>Подробнее</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
                <Search className="text-[#0E54CE]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Широкий выбор объектов</h3>
              <p className="text-gray-600">Более 500 объектов недвижимости различного типа и стоимости</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
                <Shield className="text-[#0E54CE]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Юридическая чистота</h3>
              <p className="text-gray-600">Все объекты проходят тщательную юридическую проверку перед публикацией</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
                <Clock className="text-[#0E54CE]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Быстрое оформление</h3>
              <p className="text-gray-600">Полное сопровождение сделки от просмотра до получения ключей</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
                <Building2 className="text-[#0E54CE]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Профессиональные риелторы</h3>
              <p className="text-gray-600">Команда опытных специалистов с глубоким знанием рынка недвижимости</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0E54CE]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Не нашли подходящий вариант?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Оставьте заявку, и наш специалист подберет для вас варианты, соответствующие вашим требованиям
          </p>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="inline-flex items-center bg-white hover:bg-gray-100 text-[#0E54CE] font-bold py-3 px-6 rounded-md transition-colors"
          >
            <Phone size={20} className="mr-2" />
            <span>Оставить заявку</span>
          </button>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default HomePage;