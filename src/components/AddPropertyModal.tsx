import React, { useState } from 'react';
import { PropertyType, DealType, Property } from '../types';

interface AddPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>) => void;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<PropertyType>(PropertyType.SECONDARY);
    const [dealType, setDealType] = useState<DealType>(DealType.BUY);
    const [price, setPrice] = useState(0);
    const [area, setArea] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 55.751244, lng: 37.618423 });

    const handleSubmit = () => {
        const newProperty: Omit<Property, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'> = {
            title,
            description,
            type,
            dealType,
            price,
            area,
            rooms,
            address,
            coordinates,
            realtorId: '',
            images: [],
        };
        onSave(newProperty);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Добавить новый объект</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Название</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Тип объекта</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as PropertyType)}
                        className="w-full p-2 border rounded"
                    >
                        {Object.values(PropertyType).map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Тип сделки</label>
                    <select
                        value={dealType}
                        onChange={(e) => setDealType(e.target.value as DealType)}
                        className="w-full p-2 border rounded"
                    >
                        {Object.values(DealType).map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Цена</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Площадь</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Количество комнат</label>
                    <input
                        type="number"
                        value={rooms}
                        onChange={(e) => setRooms(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Адрес</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Отмена
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-[#0E54CE] text-white rounded hover:bg-[#0E54CE]/90"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPropertyModal;