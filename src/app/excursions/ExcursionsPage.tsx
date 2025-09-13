"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, MapPin, Users, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { Modal } from "@/components/ui/Modal";
import { useModal } from "@/hooks/useModal";
import { FlyingCats } from "@/components/animations/FlyingCats";
import { SequentialFadeIn } from "@/components/animations/SequentialFadeIn";
import { API_BASE_URL } from "@/lib/constants";
import { useExcursions } from "@/hooks/useExcursions";
import { apiService, getErrorMessage, ExcursionParticipantData } from "@/services/api";
import { useRegistrationForm, validateExcursionForm, ExcursionFormData } from "@/hooks/useRegistrationForm";

const inter = Inter({ subsets: ["latin"] });

// Types based on Django models
interface Institute {
  id: number;
  name: string;
  limit: number;
  limit_left: number;
  time: string;
  image: string;
  adress: string;
  ordering: number;
}

function getLimitText(x: number): string {
  if (x === 0) return 'Места закончились';
  if ((x % 100) > 10 && (x % 100) < 15) return `Осталось ${x} мест`;
  if (x % 10 === 1) return `Осталось ${x} место`;
  if (x % 10 > 1 && x % 10 < 5) return `Осталось ${x} места`;
  return `Осталось ${x} мест`;
}

interface InstituteCardProps {
  institute: Institute;
  onSelect: (instituteId: number) => void;
  isSelected: boolean;
}

const InstituteCard = ({ institute, onSelect, isSelected }: InstituteCardProps) => {
  const isAvailable = institute.limit_left > 0;
  
  // Construct full image URL
  const imageUrl = institute.image.startsWith('http') 
    ? institute.image 
    : `${API_BASE_URL}/media/${institute.image}`;
  
  return (
    <motion.div
      whileHover={isAvailable ? { scale: 1.02 } : {}}
      whileTap={isAvailable ? { scale: 0.98 } : {}}
      className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-[#344EAD] ring-opacity-50' : ''
      } ${!isAvailable ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl'}`}
      style={{ height: '350px' }}
      onClick={() => isAvailable && onSelect(institute.id)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`
        }}
      />
      
      <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
        <div>
          <h3 className="text-xl font-bold mb-4 leading-tight">{institute.name}</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2" />
            {institute.time}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {institute.adress}
          </div>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2" />
            <span className={institute.limit_left === 0 ? 'text-red-300' : 'text-green-300'}>
              {getLimitText(institute.limit_left)}
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

const initialFormData: ExcursionFormData = {
  name: '',
  email: '',
  phone: '',
  passport: '',
  underages_count: 0,
  underages: '',
  agreement: false,
  ageConfirmation: false,
  citizenshipConfirmation: false,
  selectedInstitute: null
};

export default function ExcursionPage() {
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(null);
  const [isOpen, modalContent, showModal, closeModal] = useModal();
  
  // Use excursions hook
  const { institutes, loading, error, refreshInstitutes } = useExcursions();

  const handleFormSubmit = async (data: ExcursionFormData) => {
    try {
      // Prepare data for API
      const apiData: ExcursionParticipantData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        passport: data.passport.trim(),
        underages_count: data.underages_count || 0, // Default to 0 if empty
        underages: data.underages.trim(),
        institute: selectedInstitute!
      };

      await apiService.createExcursionParticipant(apiData);
      
      showModal(
        'success',
        'Регистрация прошла успешно!',
        'Благодарим за регистрацию на экскурсию 🎉'
      );
      
      // Refresh institutes data to get updated limit_left
      await refreshInstitutes();
      
      // Reset selected institute
      setSelectedInstitute(null);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = getErrorMessage(error);
      
      // Special handling for institute full error
      if (error && typeof error === 'object' && 'status' in error && error.status === 406) {
        showModal(
          'error',
          'Места закончились',
          'К сожалению, места в этот институт закончились.'
        );
        // Refresh institutes to update limit_left
        await refreshInstitutes();
      } else {
        showModal(
          'error',
          'Ошибка регистрации',
          errorMessage
        );
      }
    }
  };

  const validateForm = (data: ExcursionFormData): string | null => {
    // Add selectedInstitute to form data for validation
    const dataWithInstitute = { ...data, selectedInstitute };
    return validateExcursionForm(dataWithInstitute);
  };

  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useRegistrationForm({
    initialData: initialFormData,
    onSubmit: handleFormSubmit,
    validate: validateForm
  });

  const handleInstituteSelect = (instituteId: number) => {
    setSelectedInstitute(instituteId);
    // Прокрутка к форме регистрации
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmitClick = async (e: React.MouseEvent) => {
    showModal('loading', 'Регистрация...', 'Пожалуйста, подождите...');
    
    try {
      await handleSubmit(e);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка валидации';
      
      // Determine modal title based on error type
      let title = 'Ошибка валидации';
      if (errorMessage.includes('согласие')) title = 'Требуется согласие';
      if (errorMessage.includes('поля')) title = 'Заполните все поля';
      if (errorMessage.includes('email')) title = 'Неверный формат email';
      if (errorMessage.includes('возраст')) title = 'Подтверждение возраста';
      if (errorMessage.includes('гражданство')) title = 'Подтверждение гражданства';
      if (errorMessage.includes('институт')) title = 'Выберите институт';
      
      showModal('error', title, errorMessage);
    }
  };

  const selectedInstituteData = institutes.find(i => i.id === selectedInstitute);

  if (loading) {
    return (
      <main className="font-sans text-gray-900 scroll-smooth">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#344EAD] mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка институтов...</p>
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
            Экскурсии в институты
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
            Посетите ведущие научные институты и познакомьтесь с современными исследованиями
          </p>
        </div>
      </section>

      {/* Citizenship Notice */}
      <section className="py-4 bg-yellow-50 border-b border-yellow-200">
        <div className="text-center px-4 max-w-5xl mx-auto">
          <p className="text-yellow-800 font-semibold">
            В соответствии с внутренними правилами институтов, вход на территорию разрешён только гражданам&nbsp;РФ
          </p>
        </div>
      </section>

      {/* Institutes Section */}
      <section className="py-8 bg-gray-50">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-4">Доступные институты</h2>
          <p className="text-center text-gray-600 font-bold mb-12 max-w-4xl mx-auto px-4">
            Выберите <span className="underline font-extrabold">один</span> интересующий вас институт для экскурсии.
          </p>
          
          {institutes.length === 0 ? (
            <div className="text-center text-gray-600">
              <p>Экскурсии пока не доступны</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 max-w-6xl mx-auto">
              {institutes.map((institute, index) => (
                <SequentialFadeIn key={institute.id} index={index}>
                  <InstituteCard
                    institute={institute}
                    onSelect={handleInstituteSelect}
                    isSelected={selectedInstitute === institute.id}
                  />
                </SequentialFadeIn>
              ))}
            </div>
          )}
        </FadeInSection>
      </section>

      {/* Registration Section */}
      <section id="registration" className="py-8 bg-white px-4">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-4">Регистрация на экскурсию</h2>
          <p className="text-center text-gray-600 mb-12 font-bold text-xl flex items-center justify-center"><Info className="mr-1" size={24} />  регистрацию детей осуществляют сопровождающие их лица</p>
          
          {selectedInstituteData && (
            <div className="max-w-xl mx-auto mb-8 p-6 bg-[#344EAD] text-white rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Выбранный институт:</h3>
              <p className="text-lg font-medium">{selectedInstituteData.name}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Clock size={16} /> {selectedInstituteData.time}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {selectedInstituteData.adress}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} /> {getLimitText(selectedInstituteData.limit_left)}
                </p>
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
              placeholder="Телефон для связи" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="passport"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="text" 
              placeholder="Серия и номер паспорта" 
              value={formData.passport}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="underages_count"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
              type="number" 
              min="0"
              placeholder="Количество детей (если есть)" 
              value={formData.underages_count || ''}
              onChange={handleInputChange}
            />
            <textarea 
              name="underages"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent resize-vertical min-h-[100px]" 
              placeholder="ФИО и возраст детей (если есть)"
              value={formData.underages}
              onChange={handleInputChange}
              rows={3}
            />

            <label className="flex items-center space-x-3">
              <input 
                name="ageConfirmation"
                type="checkbox" 
                checked={formData.ageConfirmation}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#344EAD] rounded focus:ring-[#344EAD]"
                required 
              />
              <span className="text-gray-700 font-semibold">Подтверждаю, что мне исполнилось 18 лет</span>
            </label>

            <label className="flex items-center space-x-3">
              <input 
                name="citizenshipConfirmation"
                type="checkbox" 
                checked={formData.citizenshipConfirmation}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#344EAD] rounded focus:ring-[#344EAD]"
                required 
              />
              <span className="text-gray-700 font-semibold">Подтверждаю, что являюсь гражданином РФ</span>
            </label>

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
                selectedInstitute && !isSubmitting
                  ? 'bg-[#344EAD] text-white hover:bg-[#2a3f92]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={onSubmitClick}
              disabled={!selectedInstitute || isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Нажимая кнопку «Зарегистрироваться», вы подтверждаете согласие на обработку персональных данных и на получение рассылки от НГУ.
            </p>

            {!selectedInstitute && (
              <p className="text-sm text-red-600 text-center">
                Сначала выберите институт из списка выше
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