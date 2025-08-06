"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import { PROGRAM_ITEMS, USER_ROLES } from "@/lib/constants";
import { FadeInSection } from "@/components/animations/FadeInSection";
import { FlyingCats } from "@/components/animations/FlyingCats";
import { UserRole } from "@/lib/types";
import { SequentialFadeIn } from "@/components/animations/SequentialFadeIn";

const inter = Inter({ subsets: ["latin"] });


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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      showModal(
        'error',
        'Требуется согласие',
        'Необходимо дать согласие на обработку персональных данных для продолжения регистрации.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        role,
        school: role === "Школьник" ? formData.school : "",
        class: role === "Школьник" ? formData.class : ""
      };

      // const response = await fetch('http://localhost/api', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submitData)
      // });
      const response = { ok: true};

      if (response.ok) {
        showModal(
          'success',
          'Заявка зарегистрирована!',
          <>Благодарим за регистрацию!<br/>  <b>Регистрация на мастер-классы и олимпиады проходит отдельно через соответствующие разделы сайта.</b></>,
        );
        // Сброс формы
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
      } else {
        throw new Error('Ошибка отправки данных');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      showModal(
        'error',
        'Ошибка отправки',
        'Произошла ошибка при отправке формы. Проверьте подключение к интернету и попробуйте еще раз.'
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
              className="border p-3 rounded-xl w-full"
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
              className="border p-3 rounded-xl w-full" 
              type="text" 
              placeholder="ФИО" 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="email"
              className="border p-3 rounded-xl w-full" 
              type="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="phone"
              className="border p-3 rounded-xl w-full" 
              type="tel" 
              placeholder="Телефон" 
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
            <input 
              name="city"
              className="border p-3 rounded-xl w-full" 
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
                  className="border p-3 rounded-xl w-full" 
                  type="text" 
                  placeholder="Школа" 
                  value={formData.school}
                  onChange={handleInputChange}
                />
                <input 
                  name="class"
                  className="border p-3 rounded-xl w-full" 
                  type="text" 
                  placeholder="Класс" 
                  value={formData.class}
                  onChange={handleInputChange}
                />
              </>
            )}
            <label className="flex items-center space-x-2">
              <input 
                name="agreement"
                type="checkbox" 
                checked={formData.agreement}
                onChange={handleInputChange}
                required 
              />
              <span>Согласие на обработку данных</span>
            </label>
            <button 
              className="bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed" 
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