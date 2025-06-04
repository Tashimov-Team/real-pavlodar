import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#0E54CE]">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6">Страница не найдена</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          К сожалению, запрашиваемая страница не существует или была удалена.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#0E54CE] text-white py-3 px-6 rounded-md hover:bg-[#0E54CE]/90 transition-colors"
        >
          <Home size={20} />
          <span>Вернуться на главную</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;