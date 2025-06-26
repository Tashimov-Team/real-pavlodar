import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, Heart, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ContactModal from './ContactModal';
import { UserRole } from '../types';

const Header = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Лента', path: '/feed' },
    { name: 'О нас', path: '/about' },
    { name: 'Контакты', path: '/contact' }
  ];

  return (
      <header className="fixed w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[#0E54CE]">
            <img src="/logo.png" alt="HomeFind" className="w-28" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium transition-colors ${
                        pathname === item.path
                            ? 'text-[#0E54CE]'
                            : 'text-gray-700 hover:text-[#0E54CE]'
                    }`}
                >
                  {item.name}
                </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
                onClick={() => setIsContactModalOpen(true)}
                className="py-2 px-4 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
            >
              Оставить заявку
            </button>

            {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
                    <User size={20} />
                    <span className="hidden lg:inline">{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {user?.role !== UserRole.GUEST && (
                        <Link to="/realtor" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                          Личный кабинет
                        </Link>
                    )}

                    {(user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN) && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                          Админ панель
                        </Link>
                    )}

                    <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Выйти
                    </button>
                  </div>
                </div>
            ) : (
                <Link to="/login" className="flex items-center gap-1 py-2 px-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                  <LogIn size={20} />
                  <span className="hidden lg:inline">Войти</span>
                </Link>
            )}

            <Link to="/favorites" className="py-2 px-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
              <Heart size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
                <X size={24} className="text-gray-700" />
            ) : (
                <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className="block py-2 text-gray-700 hover:text-[#0E54CE] transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
            ))}

            <div className="flex flex-col space-y-3 pt-4 border-t">
              <button
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="py-2 px-4 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors text-center"
              >
                Оставить заявку
              </button>

              {isAuthenticated ? (
                  <>
                  {user?.role !== UserRole.GUEST && (
                      <Link
                          to="/realtor"
                          className="py-2 px-4 border border-gray-300 rounded-md text-center"
                          onClick={() => setIsOpen(false)}
                      >
                        Личный кабинет
                      </Link>
                  )}

                  {(user?.role === UserRole.MODERATOR ||user?.role === UserRole.ADMIN) && (
                    <Link
                    to="/admin"
                    className="py-2 px-4 border border-gray-300 rounded-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                  Админ панель
                  </Link>
              )}

              <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="py-2 px-4 text-red-600 rounded-md text-center"
              >
                Выйти
              </button>
            </>
            ) : (
            <Link
                to="/login"
                className="py-2 px-4 border border-gray-300 rounded-md text-center"
                onClick={() => setIsOpen(false)}
            >
              Войти
            </Link>
            )}

            <Link
                to="/favorites"
                className="py-2 px-4 border border-gray-300 rounded-md text-center flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
            >
              <Heart size={20} />
              <span>Избранное</span>
            </Link>
          </div>
        </div>
      </div>

{/* Contact Modal */}
  <ContactModal
      isOpen={isContactModalOpen}
      onClose={() => setIsContactModalOpen(false)}
  />
</header>
);
};

export default Header;