import React, { useState, useRef } from 'react';
import { Property, PropertyType, DealType, BuildingType, BalconyType, ParkingType, FurnitureType, FlooringType, SecurityFeatures } from '../types';
import { MapPin, Plus, X, Upload, Camera } from 'lucide-react';
import PropertyMap from './PropertyMap';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => Promise<void>;
  isLoading: boolean;
  onClose?: () => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ initialData, onSubmit, isLoading, onClose }) => {
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    type: PropertyType.SECONDARY,
    dealType: DealType.BUY,
    price: 0,
    area: 0,
    rooms: 1,
    address: '',
    coordinates: { lat: 55.751244, lng: 37.618423 },
    floor: undefined,
    totalFloors: undefined,
    buildingType: undefined,
    constructionYear: undefined,
    balconyType: undefined,
    parkingType: undefined,
    furnitureType: FurnitureType.NONE,
    flooringType: undefined,
    ceilingHeight: undefined,
    security: {
      intercom: false,
      cctv: false,
      security: false,
      concierge: false
    },
    images: [],
    ownerName: '',
    ownerPhone: '',
    ...initialData
  });

  const [error, setError] = useState<string>('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value ? Number(value) : undefined
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSecurityChange = (feature: keyof SecurityFeatures) => {
    setFormData(prev => ({
      ...prev,
      security: {
        ...prev.security!,
        [feature]: !prev.security![feature]
      }
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Можно загружать только изображения');
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Размер файла не должен превышать 5MB');
        }

        // Create preview URL
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке изображений');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.title || !formData.price || !formData.area || !formData.address) {
        throw new Error('Пожалуйста, заполните все обязательные поля');
      }

      if (!formData.ownerName || !formData.ownerPhone) {
        throw new Error('Пожалуйста, укажите контактные данные');
      }

      await onSubmit(formData as Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Редактировать объект' : 'Добавить новый объект'}
          </h1>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Контактная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя контактного лица <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                placeholder="Введите имя"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="ownerPhone"
                value={formData.ownerPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                placeholder="+7 (___) ___-__-__"
              />
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Основная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Заголовок <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                placeholder="Например: 2-комнатная квартира в центре"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип сделки <span className="text-red-500">*</span>
              </label>
              <select
                name="dealType"
                value={formData.dealType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
              >
                <option value={DealType.BUY}>Продажа</option>
                <option value={DealType.RENT}>Аренда</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип недвижимости <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
              >
                <option value={PropertyType.SECONDARY}>Вторичная</option>
                <option value={PropertyType.NEW_BUILDING}>Новостройка</option>
                <option value={PropertyType.HOUSE}>Дом/участок</option>
                <option value={PropertyType.COMMERCIAL}>Коммерческая</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Стоимость, ₸ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Площадь, м² <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество комнат <span className="text-red-500">*</span>
              </label>
              <select
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              placeholder="Подробное описание объекта..."
            />
          </div>
        </div>

        {/* Building Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Информация о доме</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип дома
              </label>
              <select
                name="buildingType"
                value={formData.buildingType || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              >
                <option value="">Не указано</option>
                <option value={BuildingType.BRICK}>Кирпичный</option>
                <option value={BuildingType.PANEL}>Панельный</option>
                <option value={BuildingType.MONOLITHIC}>Монолитный</option>
                <option value={BuildingType.WOODEN}>Деревянный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Год постройки
              </label>
              <input
                type="number"
                name="constructionYear"
                value={formData.constructionYear || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                min="1900"
                max={new Date().getFullYear()}
                placeholder="2020"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Этаж
              </label>
              <input
                type="number"
                name="floor"
                value={formData.floor || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                min="1"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Этажей в доме
              </label>
              <input
                type="number"
                name="totalFloors"
                value={formData.totalFloors || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                min="1"
                placeholder="9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Высота потолков, м
              </label>
              <input
                type="number"
                name="ceilingHeight"
                value={formData.ceilingHeight || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                min="2"
                max="10"
                step="0.1"
                placeholder="2.7"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFirstFloor"
                  checked={formData.isFirstFloor || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Первый этаж</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isLastFloor"
                  checked={formData.isLastFloor || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Последний этаж</span>
              </label>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Дополнительные характеристики</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Балкон
              </label>
              <select
                name="balconyType"
                value={formData.balconyType || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              >
                <option value="">Не указано</option>
                <option value={BalconyType.NONE}>Нет</option>
                <option value={BalconyType.BALCONY}>Балкон</option>
                <option value={BalconyType.LOGGIA}>Лоджия</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Парковка
              </label>
              <select
                name="parkingType"
                value={formData.parkingType || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              >
                <option value="">Не указано</option>
                <option value={ParkingType.NONE}>Нет</option>
                <option value={ParkingType.STREET}>Уличная</option>
                <option value={ParkingType.GUARDED}>Охраняемая</option>
                <option value={ParkingType.UNDERGROUND}>Подземная</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Мебель
              </label>
              <select
                name="furnitureType"
                value={formData.furnitureType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              >
                <option value={FurnitureType.NONE}>Без мебели</option>
                <option value={FurnitureType.PARTIAL}>Частично меблирована</option>
                <option value={FurnitureType.FULL}>Полностью меблирована</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Напольное покрытие
              </label>
              <select
                name="flooringType"
                value={formData.flooringType || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
              >
                <option value="">Не указано</option>
                <option value={FlooringType.LAMINATE}>Ламинат</option>
                <option value={FlooringType.LINOLEUM}>Линолеум</option>
                <option value={FlooringType.PARQUET}>Паркет</option>
                <option value={FlooringType.TILE}>Плитка</option>
                <option value={FlooringType.CARPET}>Ковролин</option>
              </select>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Безопасность
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.security?.intercom}
                  onChange={() => handleSecurityChange('intercom')}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Домофон</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.security?.cctv}
                  onChange={() => handleSecurityChange('cctv')}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Видеонаблюдение</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.security?.security}
                  onChange={() => handleSecurityChange('security')}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Охрана</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.security?.concierge}
                  onChange={() => handleSecurityChange('concierge')}
                  className="h-4 w-4 text-[#0E54CE] border-gray-300 rounded focus:ring-[#0E54CE]"
                />
                <span className="ml-2 text-sm text-gray-700">Консьерж</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Расположение</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E54CE]"
                required
                placeholder="Введите полный адрес"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[#0E54CE] text-white rounded-lg hover:bg-[#0E54CE]/90 transition-colors"
              >
                <MapPin size={20} />
              </button>
            </div>
          </div>

          <div className="h-[300px] bg-gray-100 rounded-lg">
            <PropertyMap
              properties={[]}
              height="300px"
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Фотографии</h2>
          
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
              className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0E54CE] transition-colors ${
                uploadingImages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0E54CE]"></div>
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-[#0E54CE]" />
                  <span>Выберите фотографии</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Максимальный размер файла: 5MB. Поддерживаемые форматы: JPG, PNG, GIF
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images?.map((image, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={image}
                  alt={`Фото ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X size={16} />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#0E54CE] text-white text-xs rounded-md">
                    Главное фото
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4 pb-8">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 bg-[#0E54CE] text-white rounded-lg transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0E54CE]/90'
            }`}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить объект'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;