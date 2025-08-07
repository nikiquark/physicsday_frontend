"use client";

import {  useState } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { Calendar, Clock, Trophy, LucideIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import { FlyingCats } from "@/components/animations/FlyingCats";
import { SequentialFadeIn } from "@/components/animations/SequentialFadeIn";
import { BENEFITS, API_BASE_URL } from "@/lib/constants";
import { getCookie } from "@/lib/cookie";

const inter = Inter({ subsets: ["latin"] });


// API service for participant registration
const participantService = {
  async create(participantData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    school: string;
    class_number: number;
  }) {
    const csrfToken = getCookie('csrftoken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch(`${API_BASE_URL}/olympiads/participants`, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(participantData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

const BenefitCard = ({ icon: Icon, title, description }: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start space-x-4 h-54"
    >
      {/* <div className="flex-shrink-0">
        <img src="/cat.png" alt="Cat" className="w-12 h-12 object-contain" />
      </div> */}
      <div className="flex-1">
        <div className="flex items-center mb-3">
        
          <Icon className="w-6 h-6 text-[#344EAD] mr-2" />
          <h3 className="text-xl font-bold text-gray-900 lowercase">{title}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default function OlympiadPage() {
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

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'city', 'school', 'class_number'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      showModal(
        'error',
        'Заполните все поля',
        'Все поля формы обязательны для заполнения.'
      );
      return false;
    }

    if (!formData.agreement) {
      showModal(
        'error',
        'Требуется согласие',
        'Необходимо дать согласие на обработку персональных данных для продолжения регистрации.'
      );
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal(
        'error',
        'Неверный формат email',
        'Пожалуйста, введите корректный email адрес.'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    showModal('loading', 'Регистрация...', 'Отправляем ваши данные...');

    try {
      // Prepare data for API (convert class_number to integer)
      const apiData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        school: formData.school.trim(),
        class_number: parseInt(formData.class_number, 10)
      };

      // Send data to Django backend
      const result = await participantService.create(apiData);
      
      showModal(
        'success',
        'Регистрация прошла успешно!',
        `Благодарим за регистрацию на олимпиаду 🎉`
      );
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        school: '',
        class_number: '',
        agreement: false
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Произошла ошибка при регистрации. Попробуйте позже.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Не удается подключиться к серверу. Проверьте подключение к интернету.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Проверьте правильность заполнения всех полей.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Ошибка сервера. Попробуйте позже.';
        } else {
          errorMessage = error.message;
        }
      }
      
      showModal(
        'error',
        'Ошибка регистрации',
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="font-sans text-gray-900 scroll-smooth">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#344EAD] text-white flex items-center justify-center pt-20">
        <FlyingCats />
        <div className="text-center px-4 max-w-5xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            ФизФест<br />
            Олимпиады по физике
          </h1>
          
          {/* Классы */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">1-4</div>
              <div className="text-sm">классы</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">5-7</div>
              <div className="text-sm">классы</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">8-9</div>
              <div className="text-sm">классы</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold">10-11</div>
              <div className="text-sm">классы</div>
            </div>
          </div>

          {/* Важная информация */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-red-300" />
                <div>
                  <div className="font-semibold">Регистрация</div>
                  <div className="text-gray-200">до 10:00 2 октября</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-yellow-300" />
                <div>
                  <div className="font-semibold">Даты проведения</div>
                  <div className="text-gray-200">4 — 6 октября 2025</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 md:col-span-2">
                <Trophy className="w-6 h-6 text-green-300" />
                <div>
                  <div className="font-semibold">Подведение итогов</div>
                  <div className="text-gray-200">не позднее 31 октября 2025</div>
                </div>
              </div>
            </div>
          </div>

          <a 
            href="#register" 
            className="inline-block bg-white text-[#344EAD] font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl"
          >
            Зарегистрироваться на олимпиаду
          </a>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <FadeInSection>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
              Участие в олимпиадах — это
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((benefit, index) => (
                <SequentialFadeIn key={index} index={index}>
                  <BenefitCard {...benefit} />
                </SequentialFadeIn>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 bg-white px-4">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-1">Регистрация на олимпиаду</h2>
          <p className="text-center text-gray-600 mb-12 font-bold text-xl">(только для школьников)</p>
          
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
                !isSubmitting
                  ? 'bg-[#344EAD] text-white hover:bg-[#2a3f92]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Нажимая кнопку «Зарегистрироваться», вы подтверждаете согласие на обработку персональных данных и на получение рассылки от НГУ.
            </p>
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