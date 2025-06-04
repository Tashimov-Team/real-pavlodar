import React, { useRef, useEffect, useState } from 'react';
import { Property } from '../types';

interface PropertyMapProps {
  properties: Property[];
  onAreaSelect?: (bounds: {north: number, south: number, east: number, west: number}) => void;
  height?: string;
}

// This is a placeholder for the actual map implementation
// In a real project, you would use Google Maps or Yandex Maps API
const PropertyMap: React.FC<PropertyMapProps> = ({ properties, onAreaSelect, height = '400px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAreaDraw = () => {
    setIsDrawing(!isDrawing);
    
    if (isDrawing && onAreaSelect) {
      // Simulate area selection with mock data
      onAreaSelect({
        north: 55.761244,
        south: 55.731244,
        east: 37.638423,
        west: 37.608423
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Карта объектов</h3>
        {onAreaSelect && (
          <button
            onClick={handleAreaDraw}
            className={`px-3 py-1 rounded-md text-sm ${
              isDrawing 
                ? 'bg-red-500 text-white' 
                : 'bg-[#0E54CE] text-white'
            }`}
          >
            {isDrawing ? 'Завершить выделение' : 'Выделить область'}
          </button>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="relative"
        style={{ height }}
      >
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E54CE]"></div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-gray-200">
            {/* This would be replaced with actual map rendering */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <p className="text-center">
                Здесь будет интерактивная карта с {properties.length} объектами
              </p>
            </div>
            
            {/* Simulated property markers */}
            {properties.slice(0, 3).map((property, index) => (
              <div 
                key={property.id}
                className="absolute bg-[#0E54CE] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
                style={{ 
                  top: `${30 + (index * 10)}%`, 
                  left: `${20 + (index * 15)}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {index + 1}
              </div>
            ))}
            
            {/* Simulated area selection */}
            {isDrawing && (
              <div 
                className="absolute border-2 border-dashed border-[#0E54CE] bg-[#0E54CE]/10"
                style={{
                  top: '30%',
                  left: '20%',
                  width: '40%',
                  height: '30%'
                }}
              ></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyMap;