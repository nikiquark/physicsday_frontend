"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { CheckCircle, Clock, MapPin, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { FlyingCats } from "@/components/animations/FlyingCats";
import { SequentialFadeIn } from "@/components/animations/SequentialFadeIn";

const inter = Inter({ subsets: ["latin"] });

// Мокированные данные мастер-классов
const mockWorkshops = [
  {
    id: 1,
    name: "Квантовая физика для начинающих",
    restriction: "8-11 класс",
    time: "14:00-15:30",
    room: "Аудитория 2-05",
    limit_left: 15,
    image: "https://optim.tildacdn.com/tild6138-6365-4264-b738-353737633039/-/resize/800x600/-/format/webp/MasterClass.jpg.webp"
  },
  {
    id: 2,
    name: "Оптика и лазеры",
    restriction: "9-11 класс",
    time: "15:45-17:15",
    room: "Лаборатория оптики",
    limit_left: 8,
    image: "https://optim.tildacdn.com/tild3266-3863-4136-a437-663966666133/-/resize/800x600/-/format/webp/Dem2.jpg.webp"
  },
  {
    id: 3,
    name: "Электроника и схемотехника",
    restriction: "7-10 класс",
    time: "14:00-15:30",
    room: "Лаборатория электроники",
    limit_left: 0,
    image: "https://optim.tildacdn.com/tild3465-3031-4536-a361-636162353030/-/resize/800x600/-/format/webp/Street3.jpg.webp"
  },
  {
    id: 4,
    name: "Астрофизика и телескопы",
    restriction: "6-11 класс",
    time: "16:00-17:30",
    room: "Планетарий НГУ",
    limit_left: 22,
    image: "https://optim.tildacdn.com/tild3162-6533-4330-b762-666234333932/-/resize/800x600/-/format/webp/Pogosov3_2.jpg.webp"
  },
  {
    id: 5,
    name: "Механика и робототехника",
    restriction: "5-9 класс",
    time: "13:00-14:30",
    room: "Мастерская",
    limit_left: 3,
    image: "https://optim.tildacdn.com/tild6637-6461-4563-b336-366137323830/-/resize/800x600/-/format/webp/Quest.jpg.webp"
  },
  {
    id: 6,
    name: "Ядерная физика",
    restriction: "10-11 класс",
    time: "15:00-16:30",
    room: "Аудитория 3-12",
    limit_left: 12,
    image: "https://optim.tildacdn.com/tild6435-3966-4331-b164-653962656466/-/resize/800x600/-/format/webp/83142585.jpg.webp"
  }
];

function getLimitText(x: number): string {
  if (x === 0) return 'Места закончились';
  if ((x % 100) > 10 && (x % 100) < 15) return `Осталось ${x} мест`;
  if (x % 10 === 1) return `Осталось ${x} место`;
  if (x % 10 > 1 && x % 10 < 5) return `Осталось ${x} места`;
  return `Осталось ${x} мест`;
}

interface WorkshopCardProps {
  workshop: {
    id: number;
    name: string;
    restriction: string;
    time: string;
    room: string;
    limit_left: number;
    image: string;
  };
  onSelect: (workshopId: number) => void;
  isSelected: boolean;
}

const WorkshopCard = ({ workshop, onSelect, isSelected }: WorkshopCardProps) => {
  const isAvailable = workshop.limit_left > 0;
  
  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
      className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-[#344EAD] ring-opacity-50' : ''
      } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}`}
      style={{ height: '300px' }}
      onClick={() => isAvailable && onSelect(workshop.id)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${workshop.image})`
        }}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div>
          <h3 className="text-xl font-bold mb-2 leading-tight">{workshop.name}</h3>
          <p className="text-sm text-gray-200 mb-4">{workshop.restriction}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2" />
            {workshop.time}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {workshop.room}
          </div>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2" />
            <span className={workshop.limit_left === 0 ? 'text-red-300' : 'text-green-300'}>
              {getLimitText(workshop.limit_left)}
            </span>
          </div>
        </div>
        
        {isSelected && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState(mockWorkshops);
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null);
  const [isOpen, modalContent, showModal, closeModal] = useModal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    school: '',
    class_number: '',
    agreement: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };


  const handleWorkshopSelect = (workshopId: number) => {
    setSelectedWorkshop(workshopId);
    // Прокрутка к форме регистрации
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!selectedWorkshop) {
      showModal(
        'error',
        'Выберите мастер-класс',
        'Необходимо выбрать мастер-класс для регистрации.'
      );
      return;
    }

    if (!formData.agreement) {
      showModal(
        'error',
        'Требуется согласие',
        'Необходимо дать согласие на обработку персональных данных для продолжения регистрации.'
      );
      return;
    }

    setIsSubmitting(true);
    showModal('loading', 'Регистрация...', 'Пожалуйста, подождите...');

    // Мокирование API запроса
    setTimeout(() => {
      const selectedWorkshopData = workshops.find(w => w.id === selectedWorkshop);
      
      if (!selectedWorkshopData || selectedWorkshopData.limit_left === 0) {
        showModal(
          'error',
          'Места закончились',
          'К сожалению, места на этот мастер-класс закончились.'
        );
      } else {
        // Симулируем успешную регистрацию
        showModal(
          'success',
          'Регистрация прошла успешно!',
          'Спасибо за регистрацию на мастер-класс! Подтверждение отправлено на указанный email.'
        );
        
        // Обновляем количество мест
        setWorkshops(prev => prev.map(w => 
          w.id === selectedWorkshop 
            ? { ...w, limit_left: Math.max(0, w.limit_left - 1) }
            : w
        ));
        
        // Сброс формы
        setFormData({
          name: '',
          email: '',
          phone: '',
          city: '',
          school: '',
          class_number: '',
          agreement: false
        });
        setSelectedWorkshop(null);
      }
      
      setIsSubmitting(false);
    }, 1500);
  };

  const selectedWorkshopData = workshops.find(w => w.id === selectedWorkshop);

  return (
    <main className="font-sans text-gray-900 scroll-smooth">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 bg-[#344EAD] text-white flex items-center justify-center pt-20">
        <FlyingCats />
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Мастер-классы
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
            Практические занятия с экспертами в области физики для школьников всех возрастов
          </p>
        </div>
      </section>

      {/* Workshops Section */}
      <section className="py-20 bg-gray-50">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-4">Доступные мастер-классы</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto px-4">
            Выберите интересующий вас мастер-класс, кликнув по карточке. После выбора вы сможете зарегистрироваться в форме ниже.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto">
            {workshops.map((workshop, index) => (
              <SequentialFadeIn key={workshop.id} index={index}>
                <WorkshopCard
                  workshop={workshop}
                  onSelect={handleWorkshopSelect}
                  isSelected={selectedWorkshop === workshop.id}
                />
              </SequentialFadeIn>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-white px-4">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-4">Регистрация на мастер-класс</h2>
          <p className="text-center text-gray-600 mb-8">(только для школьников)</p>
          
          {selectedWorkshopData && (
            <div className="max-w-xl mx-auto mb-8 p-6 bg-[#344EAD] text-white rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Выбранный мастер-класс:</h3>
              <p className="text-lg font-medium">{selectedWorkshopData.name}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p>📅 {selectedWorkshopData.time}</p>
                <p>📍 {selectedWorkshopData.room}</p>
                <p>🎓 {selectedWorkshopData.restriction}</p>
                <p>👥 {getLimitText(selectedWorkshopData.limit_left)}</p>
              </div>
            </div>
          )}

          <div className="max-w-xl mx-auto grid gap-6">
            <input 
              name="name"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="text" 
              placeholder="ФИО" 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="email"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="phone"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="text" 
              placeholder="Телефон или ссылка на профиль ВК/Телеграм" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="city"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="text" 
              placeholder="Город" 
              value={formData.city}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="school"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="text" 
              placeholder="Школа" 
              value={formData.school}
              onChange={handleInputChange}
              required 
            />
            <select
              name="class_number"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent"
              value={formData.class_number}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Выберите класс</option>
              {Array.from({ length: 11 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num.toString()}>{num}</option>
              ))}
            </select>

            <label className="flex items-center space-x-3">
              <input 
                name="agreement"
                type="checkbox" 
                checked={formData.agreement}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#344EAD] rounded focus:ring-[#344EAD]"
                required 
              />
              <span className="text-gray-700">Я даю свое согласие на обработку персональных данных</span>
            </label>

            <button 
              className={`py-3 rounded-xl font-semibold transition w-full ${
                selectedWorkshop && !isSubmitting
                  ? 'bg-[#344EAD] text-white hover:bg-[#2a3f92]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={!selectedWorkshop || isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            {!selectedWorkshop && (
              <p className="text-sm text-red-600 text-center">
                Сначала выберите мастер-класс из списка выше
              </p>
            )}
          </div>
        </FadeInSection>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={closeModal}
        type={modalContent.type}
        title={modalContent.title}
        message={modalContent.message}
      />
    </main>
  );
}