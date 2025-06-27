import React from 'react';
import { Phone, Mail, User } from 'lucide-react';

interface RealtorContactCardProps {
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  onContact?: () => void;
}

const RealtorContactCard: React.FC<RealtorContactCardProps> = ({
  name,
  phone,
  email,
  avatar,
  onContact
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={24} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
          <p className="text-sm text-gray-600">Риелтор</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={16} className="text-[#0E54CE] flex-shrink-0" />
          <a 
            href={`tel:${phone}`}
            className="hover:text-[#0E54CE] transition-colors truncate"
          >
            {phone}
          </a>
        </div>
        
        {email && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Mail size={16} className="text-[#0E54CE] flex-shrink-0" />
            <a 
              href={`mailto:${email}`}
              className="hover:text-[#0E54CE] transition-colors truncate"
            >
              {email}
            </a>
          </div>
        )}
      </div>

      {onContact && (
        <button
          onClick={onContact}
          className="w-full mt-3 px-3 py-2 bg-[#0E54CE] text-white text-sm rounded-md hover:bg-[#0E54CE]/90 transition-colors"
        >
          Связаться
        </button>
      )}
    </div>
  );
};

export default RealtorContactCard;