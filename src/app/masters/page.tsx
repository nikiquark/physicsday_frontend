"use client";

import { useState, useEffect } from "react";
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
import { API_BASE_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookie";

const inter = Inter({ subsets: ["latin"] });


// Types based on Django models
interface Workshop {
  id: number;
  name: string;
  restriction: string;
  time: string;
  room: string;
  limit: number;
  limit_left: number;
  ordering: number;
  image: string;
}

interface ParticipantData {
  name: string;
  email: string;
  phone: string;
  city: string;
  school: string;
  class_number: number;
  workshop: number;
}

function getLimitText(x: number): string {
  if (x === 0) return 'Места закончились';
  if ((x % 100) > 10 && (x % 100) < 15) return `Осталось ${x} мест`;
  if (x % 10 === 1) return `Осталось ${x} место`;
  if (x % 10 > 1 && x % 10 < 5) return `Осталось ${x} места`;
  return `Осталось ${x} мест`;
}

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshopId: number) => void;
  isSelected: boolean;
}

const WorkshopCard = ({ workshop, onSelect, isSelected }: WorkshopCardProps) => {
  const isAvailable = workshop.limit_left > 0;
  
  // Construct full image URL
  const imageUrl = workshop.image.startsWith('http') 
    ? workshop.image 
    : `${API_BASE_URL}/media/${workshop.image}`;
  
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`
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
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null);
  const [isOpen, modalContent, showModal, closeModal] = useModal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch workshops from API
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/workshops/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (err) {
        console.error('Error fetching workshops:', err);
        setError('Не удалось загрузить список мастер-классов. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

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

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'city', 'school', 'class_number'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      showModal(
        'error',
        'Заполните все поля',
        'Пожалуйста, заполните все обязательные поля формы.'
      );
      return;
    }

    setIsSubmitting(true);
    showModal('loading', 'Регистрация...', 'Пожалуйста, подождите...');

    try {
      const participantData: ParticipantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        school: formData.school,
        class_number: parseInt(formData.class_number),
        workshop: selectedWorkshop
      };

      const csrfToken = getCookie('csrftoken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const response = await fetch(`${API_BASE_URL}/workshops/participants`, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(participantData),
      });

      if (response.ok) {
        showModal(
          'success',
          'Регистрация прошла успешно!',
          'Благодарим за регистрацию на мастер-класс 🎉'
        );
        
        // Refresh workshops data to get updated limit_left
        const workshopsResponse = await fetch(`${API_BASE_URL}/workshops/`);
        if (workshopsResponse.ok) {
          const updatedWorkshops = await workshopsResponse.json();
          setWorkshops(updatedWorkshops);
        }
        
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
        
      } else if (response.status === 406) {
        // Not Acceptable - workshop is full
        showModal(
          'error',
          'Места закончились',
          'К сожалению, места на этот мастер-класс закончились.'
        );
        
        // Refresh workshops to update limit_left
        const workshopsResponse = await fetch(`${API_BASE_URL}/workshops/`);
        if (workshopsResponse.ok) {
          const updatedWorkshops = await workshopsResponse.json();
          setWorkshops(updatedWorkshops);
        }
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        showModal(
          'error',
          'Ошибка регистрации',
          'Произошла ошибка при регистрации. Пожалуйста, проверьте данные и попробуйте снова.'
        );
        console.error('Registration error:', errorData);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showModal(
        'error',
        'Ошибка соединения',
        'Не удалось отправить данные. Проверьте интернет-соединение и попробуйте снова.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedWorkshopData = workshops.find(w => w.id === selectedWorkshop);

  if (loading) {
    return (
      <main className="font-sans text-gray-900 scroll-smooth">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#344EAD] mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка мастер-классов...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main className="font-sans text-gray-900 scroll-smooth">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#344EAD] text-white px-6 py-2 rounded-xl hover:bg-[#2a3f92]"
            >
              Обновить страницу
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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
          
          {workshops.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>Мастер-классы пока не доступны</p>
            </div>
          ) : (
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
          )}
        </FadeInSection>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-20 bg-white px-4">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-4">Регистрация на мастер-класс</h2>
          <p className="text-center text-gray-600 mb-12 font-bold text-xl">(только для школьников)</p>
          
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