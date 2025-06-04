import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <Building2 size={28} />
              <span>HomeFind</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Сервис по подбору недвижимости для всех типов клиентов. Находим лучшие предложения на рынке с 2020 года.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Разделы сайта</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Типы недвижимости</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog?type=secondary" className="text-gray-400 hover:text-white transition-colors">
                  Вторичная
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=new_building" className="text-gray-400 hover:text-white transition-colors">
                  Новостройки
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=house" className="text-gray-400 hover:text-white transition-colors">
                  Дома и участки
                </Link>
              </li>
              <li>
                <Link to="/catalog?type=commercial" className="text-gray-400 hover:text-white transition-colors">
                  Коммерческая
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#0E54CE] mt-1 flex-shrink-0" />
                <span className="text-gray-400">123456, г. Москва, ул. Примерная, д. 1, офис 123</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-[#0E54CE] flex-shrink-0" />
                <span className="text-gray-400">+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-[#0E54CE] flex-shrink-0" />
                <span className="text-gray-400">info@homefind.ru</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500 text-center">
          <p>&copy; {new Date().getFullYear()} HomeFind. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;