import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactModal from '../components/ContactModal';

const ContactPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Контакты</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Наш офис</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={24} className="text-[#0E54CE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Адрес</h3>
                    <p className="text-gray-600">140000, г. Павлодар, ул. Лермонтова, д. 93/2, этаж 1</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-[#0E54CE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Телефон 1</h3>
                    <p className="text-gray-600">+7 (705) 614‒07‒91</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={24} className="text-[#0E54CE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Телефон 2</h3>
                    <p className="text-gray-600">+7 (775) 362-60-91</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail size={24} className="text-[#0E54CE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">real.pv@mail.ru</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock size={24} className="text-[#0E54CE] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Режим работы</h3>
                    <p className="text-gray-600">
                      Пн-Пт: 10:00 - 18:00<br />
                      Сб: 10:00 - 14:00<br />
                      Вс: выходной
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-8 w-full py-3 px-6 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative w-full h-[400px] bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <p className="text-center">
                  Здесь будет карта с расположением офиса
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ContactPage;