"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import { API_BASE_URL, PROGRAM_ITEMS, USER_ROLES } from "@/lib/constants";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { FlyingCats } from "@/components/animations/FlyingCats";
import { UserRole } from "@/lib/types";
import { SequentialFadeIn } from "@/components/animations/SequentialFadeIn";

const inter = Inter({ subsets: ["latin"] });

// API service for participant registration
const participantService = {
  async create(participantData: {
    role: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    school: string | null;
    class_number: number | null;
  }) {
    const response = await fetch(`${API_BASE_URL}/physicsday/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(participantData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
};

export default function Home() {
  const [role, setRole] = useState<UserRole>("Школьник");
  const [isOpen, modalContent, showModal, closeModal] = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    school: '',
    class: '',
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
    const requiredFields = ['name', 'email', 'phone', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    // For students, school and class are also required
    if (role === "Школьник") {
      if (!formData.school || !formData.class) {
        emptyFields.push(...['school', 'class'].filter(field => !formData[field as keyof typeof formData]));
      }
    }
    
    if (emptyFields.length > 0) {
      showModal(
        'error',
        'Заполните все поля',
        'Все обязательные поля должны быть заполнены.'
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

    // Validate class number for students
    if (role === "Школьник" && formData.class) {
      const classNum = parseInt(formData.class, 10);
      if (isNaN(classNum) || classNum < 1 || classNum > 11) {
        showModal(
          'error',
          'Неверный класс',
          'Пожалуйста, введите номер класса от 1 до 11.'
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const apiData = {
        role: role,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        ...(role === "Школьник" ? {
          school: formData.school.trim(),
          class_number: parseInt(formData.class, 10)
        } : {
          school: null,
          class_number: null
        })
      };

      // Send data to Django backend
      const result = await participantService.create(apiData);

      showModal(
        'success',
        'Заявка зарегистрирована!',
        <>Благодарим за регистрацию 🎉<br/><b>Регистрация на мастер-классы и олимпиады проходит отдельно через соответствующие разделы сайта.</b></>,
      );
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        school: '',
        class: '',
        agreement: false
      });
      setRole("Школьник");

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
      <section id="about" className="relative h-screen bg-[#344EAD] text-white flex items-center justify-center pt-20">
        <FlyingCats />
        <div className="text-center px-4 max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            29 сентября 2025<br />
            ФИЗФЕСТ
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-4 font-medium">11:00 Главный корпус НГУ</p>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Фестиваль науки &quot;ФизФест&quot; — масштабное событие, организуемое студентами и молодыми учеными Новосибирского государственного университета с целью популяризации физики среди школьников и общественности. Участники смогут не только увлекательно провести время, но и пополнить свои знания в области естествознания, приобщиться к фундаментальной науке, познакомиться с учеными-практиками.
          </p>
          <a href="#register" className="bg-white text-[#344EAD] font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl">
            Зарегистрироваться
          </a>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="py-20 bg-gray-50">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-12">Программа</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
            {PROGRAM_ITEMS.map(({title, image}, idx) => (
              <SequentialFadeIn key={idx} index={idx}>
                <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
                  <img
                    src={image}
                    alt={title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${title ? 'brightness-50' : ''}`}
                  />
                  <div className="relative z-10 p-4 text-white text-lg font-semibold">
                    {title}
                  </div>
                </div>
              </SequentialFadeIn>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* Additional Registration Section */}
      <section className="py-20 bg-gray-50">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-12">Дополнительные события</h2>
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Мастер-классы */}
              <a 
                href="/masters" 
                className="group border-2 border-[#344EAD] hover:bg-[#344EAD] transition-all duration-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-lg"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#344EAD] group-hover:text-white mb-4">
                    Регистрация <br/> на мастер-классы
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-200">
                    Практические занятия с экспертами в области физики
                  </p>
                </div>
              </a>

              {/* Олимпиада */}
              <a 
                href="/olimpiads" 
                className="group border-2 border-[#344EAD] hover:bg-[#344EAD] transition-all duration-300 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] hover:shadow-lg"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#344EAD] group-hover:text-white mb-4">
                    Регистрация <br/> на олимпиады
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-200">
                    Участие в мини-олимпиадах по физике
                  </p>
                </div>
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 bg-white px-4">
        <FadeInSection>
          <h2 className="text-center text-3xl font-bold mb-12">Регистрация на ФизФест</h2>
          <div className="max-w-xl mx-auto grid gap-6">
            <select
              name="role"
              className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
            >
              {USER_ROLES.map((role, idx) => (
                <option key={idx}>{role}</option>
              ))}
            </select>
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
              type="tel" 
              placeholder="Телефон" 
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
            {role === "Школьник" && (
              <>
                <input 
                  name="school"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
                  type="text" 
                  placeholder="Школа" 
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                />
                <input 
                  name="class"
                  className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-[#344EAD] focus:border-transparent" 
                  type="number" 
                  placeholder="Класс (1-11)" 
                  min="1"
                  max="11"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
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
              {isSubmitting ? 'Отправка...' : 'Отправить'}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Нажимая кнопку «Отправить», вы подтверждаете согласие на обработку персональных данных и на получение рассылки от НГУ.
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