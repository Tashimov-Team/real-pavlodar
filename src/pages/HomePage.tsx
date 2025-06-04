import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Shield, Clock, Phone } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import { PropertyType } from '../types';

const HomePage: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
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
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Найдите идеальную недвижимость вместе с нами
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Мы поможем вам найти недвижимость вашей мечты с лучшими условиями и профессиональным сопровождением сделки.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/catalog"
                  className="bg-[#0E54CE] hover:bg-[#0E54CE]/90 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 text-center"
                >
                  Смотреть каталог
                </Link>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-md transition-colors duration-300"
                >
                  Оставить заявку
                </button>
              </div>
            </div>
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
              <p className="text-gray-600">Более 10 000 объектов недвижимости различного типа и стоимости</p>
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