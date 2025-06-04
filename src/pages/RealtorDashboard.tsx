import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, ListFilter, Bell, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
import PropertyCard from '../components/PropertyCard';
import { Property, PropertyType } from '../types';

const RealtorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, addProperty, isPending } = useProperties();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'properties' | 'requests' | 'settings'>('properties');
  
  // Filter properties for the current realtor
  const realtorProperties = properties.filter(prop => prop.realtorId === user?.id);
  
  const handleAddProperty = async () => {
    if (isPending) return;
    
    try {
      const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'> = {
        title: 'Новый объект',
        description: 'Описание объекта',
        type: PropertyType.SECONDARY,
        price: 0,
        area: 0,
        rooms: 1,
        address: '',
        coordinates: {
          lat: 55.751244,
          lng: 37.618423
        },
        images: [],
        realtorId: user?.id || '',
      };
      
      await addProperty(newProperty);
      // Navigate to edit page would go here
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 size={28} className="text-[#0E54CE]" />
              <span>Личный кабинет</span>
            </h1>
            <p className="text-gray-600 mt-1">Добро пожаловать, {user?.name}</p>
          </div>
          
          <button
            onClick={handleAddProperty}
            disabled={isPending}
            className={`inline-flex items-center bg-[#0E54CE] text-white px-4 py-2 rounded-md transition-colors ${
              isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0E54CE]/90'
            }`}
          >
            <Plus size={20} className="mr-2" />
            <span>Добавить объект</span>
          </button>
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
              Мои объекты
            </button>
            
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-[#0E54CE] text-[#0E54CE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell size={20} className="inline-block mr-2" />
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
        {activeTab === 'properties' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Мои объекты ({realtorProperties.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realtorProperties.map(property => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  {!property.isApproved && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-md">
                      На модерации
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Здесь будут отображаться заявки от пользователей
            </p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Здесь будут настройки профиля
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtorDashboard;