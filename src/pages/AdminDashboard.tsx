import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Building2, Users, Settings, ListFilter, BarChart2, MessageSquare, Eye, Phone, Download, Trash2, Edit, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
import PropertyCard from '../components/PropertyCard';
import PropertyForm from '../components/PropertyForm';
import { Property, ContactRequest, User, UserRole } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, createUser, deleteUser } = useAuth();
  const { 
    properties, 
    updateProperty, 
    deleteProperty, 
    loadProperties, 
    getStatistics, 
    getApplications, 
    exportApplications 
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'users' | 'requests' | 'settings'>('dashboard');
  const [statistics, setStatistics] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalRequests: 0,
    pendingRequests: 0
  });

  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.USER
  });

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Load statistics when dashboard tab is active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStatistics();
    }
  }, [activeTab]);

  // Load applications when requests tab is active
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchApplications();
    }
  }, [activeTab]);

  // Fetch real statistics from API
  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const stats = await getStatistics();
      setStatistics({
        totalProperties: stats.total_properties || 0,
        totalViews: stats.total_views || 0,
        totalRequests: stats.total_requests || 0,
        pendingRequests: stats.pending_requests || 0
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch applications from API
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const apps = await getApplications();
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export applications
  const handleExportApplications = async () => {
    try {
      setIsLoading(true);
      const blob = await exportApplications();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applications.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      await createUser(newUser);
      setShowAddUserForm(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: UserRole.USER
      });
      // Refresh users list
      // In a real app, you would fetch the updated users list
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        setIsLoading(true);
        await deleteUser(userId);
        // Refresh users list
        // In a real app, you would fetch the updated users list
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот объект?')) {
      try {
        setIsLoading(true);
        await deleteProperty(propertyId);
      } catch (error) {
        console.error('Error deleting property:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
                <Building2 size={20} className="inline-block mr-2" />
                Управление объектами
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
                Управление аккаунтами
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
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Загрузка статистики...</p>
                  </div>
                ) : (
                  <>
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Всего объектов</h3>
                          <Building2 size={24} className="text-[#0E54CE]" />
                        </div>
                        <p className="text-3xl font-bold text-[#0E54CE]">{statistics.totalProperties}</p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Просмотры</h3>
                          <Eye size={24} className="text-[#0E54CE]" />
                        </div>
                        <p className="text-3xl font-bold text-[#0E54CE]">{statistics.totalViews}</p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Заявки</h3>
                          <Phone size={24} className="text-[#0E54CE]" />
                        </div>
                        <p className="text-3xl font-bold text-[#0E54CE]">{statistics.totalRequests}</p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Ожидают ответа</h3>
                          <MessageSquare size={24} className="text-[#0E54CE]" />
                        </div>
                        <p className="text-3xl font-bold text-[#0E54CE]">{statistics.pendingRequests}</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Учет статистики</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-800">Общая статистика сайта</h3>
                          <button 
                            className="px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
                            onClick={fetchStatistics}
                          >
                            Обновить данные
                          </button>
                        </div>

                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Дополнительная информация</h4>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex justify-between">
                              <span>Активные объекты:</span>
                              <span className="font-medium">{properties.filter(p => p.status === 'active').length}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>На модерации:</span>
                              <span className="font-medium">{pendingProperties.length}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Всего пользователей:</span>
                              <span className="font-medium">{users.length}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
          )}

          {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Управление всеми объектами риелторов
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Загрузка объектов...</p>
                  </div>
                ) : (
                  <>
                    {/* Pending Properties Section */}
                    {pendingProperties.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                          Объекты на модерации ({pendingProperties.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pendingProperties.map(property => (
                            <div key={property.id} className="relative">
                              <PropertyCard property={property} />
                              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleApproveProperty(property.id)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                  Одобрить
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(property.id)}
                                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Properties Section */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Все объекты ({properties.length})
                      </h3>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Название
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Тип
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Цена
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
                              {properties.map(property => (
                                <tr key={property.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {property.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {property.title}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {property.type}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {property.price.toLocaleString()} ₸
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      property.isApproved 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {property.isApproved ? 'Активен' : 'На модерации'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleDeleteProperty(property.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <Trash2 size={18} />
                                      </button>
                                      {!property.isApproved && (
                                        <button
                                          onClick={() => handleApproveProperty(property.id)}
                                          className="text-green-500 hover:text-green-700"
                                        >
                                          <Edit size={18} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
          )}

          {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Управление всеми аккаунтами
                  </h2>
                  <button
                    onClick={() => setShowAddUserForm(!showAddUserForm)}
                    className="px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors flex items-center gap-2"
                  >
                    <UserPlus size={18} />
                    {showAddUserForm ? 'Отменить' : 'Добавить пользователя'}
                  </button>
                </div>

                {showAddUserForm && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Добавить нового пользователя</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0E54CE] focus:border-[#0E54CE]"
                          placeholder="Введите имя"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0E54CE] focus:border-[#0E54CE]"
                          placeholder="Введите email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0E54CE] focus:border-[#0E54CE]"
                          placeholder="Введите пароль"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#0E54CE] focus:border-[#0E54CE]"
                        >
                          <option value={UserRole.USER}>Пользователь</option>
                          <option value={UserRole.REALTOR}>Риелтор</option>
                          <option value={UserRole.MODERATOR}>Модератор</option>
                          <option value={UserRole.ADMIN}>Администратор</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleAddUser}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors"
                      >
                        {isLoading ? 'Добавление...' : 'Добавить пользователя'}
                      </button>
                    </div>
                  </div>
                )}

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Загрузка пользователей...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Имя
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Роль
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.length > 0 ? (
                            users.map(user => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                Нет пользователей
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
          )}

          {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Просмотр и экспорт заявок
                  </h2>
                  <button
                    onClick={handleExportApplications}
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#0E54CE] text-white rounded-md hover:bg-[#0E54CE]/90 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    {isLoading ? 'Экспорт...' : 'Экспорт заявок'}
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Загрузка заявок...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
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
                                Объект
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
                            {applications.length > 0 ? (
                              applications.map(app => (
                                <tr key={app.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.id}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(app.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {app.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.phone}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.property_id}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {app.message}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      app.status === 'processed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {app.status === 'processed' ? 'Обработана' : 'Новая'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {app.status !== 'processed' && (
                                      <button
                                        onClick={() => handleProcessRequest(app.id)}
                                        className="text-[#0E54CE] hover:text-[#0E54CE]/80"
                                      >
                                        Обработать
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Нет заявок
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
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
