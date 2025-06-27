import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Building2, Plus, ListFilter, Bell, Settings, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import ProfileSettings from '../components/ProfileSettings';
import { Property, PropertyType } from '../types';

const RealtorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { properties, addProperty, updateProperty, deleteProperty, isPending, loadProperties } = useProperties();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'properties' | 'requests' | 'settings'>('properties');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const realtorProperties = properties.filter(prop => prop.realtorId === user?.id);
  const pendingProperties = realtorProperties.filter(prop => !prop.isApproved);
  const approvedProperties = realtorProperties.filter(prop => prop.isApproved);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        await deleteProperty(propertyId);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleSaveProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => {
    try {
      const propertyWithRealtor = {
        ...propertyData,
        realtorId: user?.id || '',
      };

      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyWithRealtor);
      } else {
        await addProperty(propertyWithRealtor);
      }
      
      setShowPropertyForm(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  };

  const getPropertyStats = () => {
    return {
      total: realtorProperties.length,
      approved: approvedProperties.length,
      pending: pendingProperties.length,
      views: realtorProperties.reduce((sum, prop) => sum + (prop.views || 0), 0)
    };
  };

  const stats = getPropertyStats();

  if (showPropertyForm) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <PropertyForm
            initialData={editingProperty || undefined}
            onSubmit={handleSaveProperty}
            isLoading={isPending}
            onClose={() => {
              setShowPropertyForm(false);
              setEditingProperty(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 size={32} className="text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Личный кабинет</h1>
              <p className="text-gray-600">Добро пожаловать, {user?.name}</p>
            </div>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего объектов</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building2 size={24} className="text-[#0E54CE]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Опубликовано</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Eye size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">На модерации</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Bell size={24} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Просмотры</p>
                <p className="text-2xl font-bold text-blue-600">{stats.views}</p>
              </div>
              <Eye size={24} className="text-blue-500" />
            </div>
          </div>
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
            {/* Pending Properties */}
            {pendingProperties.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  На модерации ({pendingProperties.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingProperties.map(property => (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-md">
                        На модерации
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                          <Edit size={16} className="text-[#0E54CE]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Properties */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Опубликованные объекты ({approvedProperties.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedProperties.map(property => (
                  <div key={property.id} className="relative group">
                    <PropertyCard property={property} />
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditProperty(property)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Edit size={16} className="text-[#0E54CE]" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {realtorProperties.length === 0 && (
              <div className="text-center py-16">
                <Building2 size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Пока нет объектов</h3>
                <p className="text-gray-600 mb-6">
                  Добавьте свой первый объект недвижимости
                </p>
                <button
                  onClick={handleAddProperty}
                  className="inline-flex items-center bg-[#0E54CE] text-white px-6 py-3 rounded-md hover:bg-[#0E54CE]/90 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  <span>Добавить объект</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Заявки от клиентов</h2>
            <p className="text-gray-600">
              Здесь будут отображаться заявки от пользователей, интересующихся вашими объектами
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Настройки профиля</h2>
              <p className="text-gray-600 mb-4">
                Управляйте информацией вашего профиля и настройками аккаунта
              </p>
              <button
                onClick={() => setShowProfileSettings(true)}
                className="inline-flex items-center bg-[#0E54CE] text-white px-4 py-2 rounded-md hover:bg-[#0E54CE]/90 transition-colors"
              >
                <Settings size={20} className="mr-2" />
                <span>Редактировать профиль</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Уведомления</h2>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                  />
                  <span className="ml-2 text-gray-700">Уведомления о новых заявках</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                  />
                  <span className="ml-2 text-gray-700">Уведомления о модерации объектов</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                  />
                  <span className="ml-2 text-gray-700">Email-рассылка</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Settings Modal */}
      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </div>
  );
};

export default RealtorDashboard;