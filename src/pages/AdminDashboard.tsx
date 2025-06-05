import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Settings, ListFilter, BarChart2, MessageSquare, Eye, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import { Property, ContactRequest } from '../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, updateProperty } = useProperties();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'requests' | 'settings'>('dashboard');

  // Mock data for statistics
  const stats = {
    totalProperties: properties.length,
    totalViews: 1250,
    totalRequests: 45,
    pendingRequests: 12
  };

  // Mock data for contact requests
  const [contactRequests] = useState<ContactRequest[]>([
    {
      id: 'req-1',
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      message: 'Интересует квартира на ул. Примерная',
      propertyId: 'prop-1',
      createdAt: new Date().toISOString(),
      isProcessed: false
    },
    {
      id: 'req-2',
      name: 'Мария Иванова',
      phone: '+7 (999) 765-43-21',
      message: 'Хочу узнать подробнее о доме',
      propertyId: 'prop-2',
      createdAt: new Date().toISOString(),
      isProcessed: true
    }
  ]);

  // Filter unapproved properties
  const pendingProperties = properties.filter(prop => !prop.isApproved);

  const handleApproveProperty = async (propertyId: string) => {
    try {
      await updateProperty(propertyId, { isApproved: true });
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleProcessRequest = async (requestId: string) => {
    // In a real app, this would update the request status in the database
    console.log('Processing request:', requestId);
  };

  return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Settings size={28} className="text-[#0E54CE]" />
              <span>Панель администратора</span>
            </h1>
            <p className="text-gray-600 mt-1">Добро пожаловать, {user?.name}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'dashboard'
                          ? 'border-[#0E54CE] text-[#0E54CE]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <BarChart2 size={20} className="inline-block mr-2" />
                Статистика
              </button>

              <button
                  onClick={() => setActiveTab('properties')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'properties'
                          ? 'border-[#0E54CE] text-[#0E54CE]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <ListFilter size={20} className="inline-block mr-2" />
                Модерация объектов
              </button>

              <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'requests'
                          ? 'border-[#0E54CE] text-[#0E54CE]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <MessageSquare size={20} className="inline-block mr-2" />
                Заявки
              </button>

              <button
                  onClick={() => setActiveTab('settings')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'settings'
                          ? 'border-[#0E54CE] text-[#0E54CE]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Settings size={20} className="inline-block mr-2" />
                Настройки
              </button>
            </nav>
          </div>

          {/* Content */}
          {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Всего объектов</h3>
                      <Building2 size={24} className="text-[#0E54CE]" />
                    </div>
                    <p className="text-3xl font-bold text-[#0E54CE]">{stats.totalProperties}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Просмотры</h3>
                      <Eye size={24} className="text-[#0E54CE]" />
                    </div>
                    <p className="text-3xl font-bold text-[#0E54CE]">{stats.totalViews}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Заявки</h3>
                      <Phone size={24} className="text-[#0E54CE]" />
                    </div>
                    <p className="text-3xl font-bold text-[#0E54CE]">{stats.totalRequests}</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Ожидают ответа</h3>
                      <MessageSquare size={24} className="text-[#0E54CE]" />
                    </div>
                    <p className="text-3xl font-bold text-[#0E54CE]">{stats.pendingRequests}</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Последние действия</h2>
                  <div className="space-y-4">
                    {/* This would be populated with real activity data */}
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p>Новая заявка на просмотр квартиры</p>
                      <span className="text-sm text-gray-400">2 минуты назад</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p>Добавлен новый объект</p>
                      <span className="text-sm text-gray-400">15 минут назад</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p>Обновлена информация о квартире</p>
                      <span className="text-sm text-gray-400">1 час назад</span>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'properties' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Объекты на модерации ({pendingProperties.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingProperties.map(property => (
                      <div key={property.id} className="relative">
                        <PropertyCard property={property} />
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
                          <button
                              onClick={() => handleApproveProperty(property.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                          >
                            Одобрить
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}

          {activeTab === 'requests' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Заявки от пользователей
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Имя
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Телефон
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Сообщение
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {contactRequests.map(request => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {request.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {request.phone}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {request.message}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.isProcessed
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.isProcessed ? 'Обработана' : 'Новая'}
                          </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {!request.isProcessed && (
                                  <button
                                      onClick={() => handleProcessRequest(request.id)}
                                      className="text-[#0E54CE] hover:text-[#0E54CE]/80"
                                  >
                                    Обработать
                                  </button>
                              )}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Настройки сайта</h2>

                {/* Filter Sections Management */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Управление фильтрами</h3>
                  <div className="space-y-4">
                    {/* This would be populated with actual filter sections */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Тип недвижимости</h4>
                        <p className="text-sm text-gray-600">Фильтр по типу недвижимости</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[#0E54CE] hover:text-[#0E54CE]/80">
                          Редактировать
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          Скрыть
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-800">Цена</h4>
                        <p className="text-sm text-gray-600">Фильтр по диапазону цен</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[#0E54CE] hover:text-[#0E54CE]/80">
                          Редактировать
                        </button>
                        <button className="text-red-500 hover:text-red-600">
                          Скрыть
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="mt-4 px-4 py-2 border border-[#0E54CE] text-[#0E54CE] rounded-md hover:bg-[#0E54CE]/10 transition-colors">
                    Добавить новый фильтр
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdminDashboard;