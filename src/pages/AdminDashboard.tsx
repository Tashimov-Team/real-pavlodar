import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Settings, ListFilter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
import PropertyCard from '../components/PropertyCard';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, updateProperty } = useProperties();
  const [activeTab, setActiveTab] = useState<'properties' | 'users' | 'settings'>('properties');
  
  // Filter unapproved properties
  const pendingProperties = properties.filter(prop => !prop.isApproved);

  const handleApproveProperty = async (propertyId: string) => {
    try {
      await updateProperty(propertyId, { isApproved: true });
    } catch (error) {
      console.error('Error approving property:', error);
    }
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
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-[#0E54CE] text-[#0E54CE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users size={20} className="inline-block mr-2" />
              Пользователи
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
        
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Здесь будет список пользователей и управление ими
            </p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Здесь будут настройки сайта
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;