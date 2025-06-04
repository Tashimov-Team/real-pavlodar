import React from 'react';
import { Building2, Users, Award, Briefcase } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">О компании HomeFind</h1>
        
        <div className="max-w-3xl mx-auto text-lg text-gray-600 mb-12">
          <p className="mb-4">
            Real — это современный сервис по подбору недвижимости, который помогает людям находить идеальные варианты для жизни и бизнеса. Мы работаем на рынке недвижимости более 12 лет и за это время помогли тысячам клиентов обрести новый дом.
          </p>
          <p>
            Наша миссия — сделать процесс поиска и покупки недвижимости максимально простым, безопасным и комфортным для каждого клиента.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
              <Building2 className="text-[#0E54CE]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">500+</h3>
            <p className="text-gray-600">Объектов в базе</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
              <Users className="text-[#0E54CE]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">10000+</h3>
            <p className="text-gray-600">Довольных клиентов</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
              <Award className="text-[#0E54CE]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">20+</h3>
            <p className="text-gray-600">Профессиональных риелторов</p>
          </div>
          
          <div className="text-center">
            <div className="mb-4 mx-auto w-16 h-16 bg-[#0E54CE]/10 rounded-full flex items-center justify-center">
              <Briefcase className="text-[#0E54CE]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">3000+</h3>
            <p className="text-gray-600">Успешных сделок</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Наши преимущества</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Надежность</h3>
              <p className="text-gray-600">
                Все объекты проходят тщательную юридическую проверку. Мы гарантируем безопасность и законность каждой сделки.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Профессионализм</h3>
              <p className="text-gray-600">
                Наши специалисты имеют многолетний опыт работы на рынке недвижимости и регулярно повышают свою квалификацию.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Индивидуальный подход</h3>
              <p className="text-gray-600">
                Мы внимательно изучаем потребности каждого клиента и подбираем оптимальные варианты под конкретные запросы.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Прозрачность</h3>
              <p className="text-gray-600">
                Работаем открыто и честно. Все условия сделки обсуждаются заранее, без скрытых платежей и комиссий.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;