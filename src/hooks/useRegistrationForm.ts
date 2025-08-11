import { useState } from 'react';
import { UserRole } from "@/lib/types";

export interface BaseFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  agreement: boolean;
}

export interface PhysicsDayFormData extends BaseFormData {
  school: string;
  class: string;
}

export interface StudentFormData extends BaseFormData {
  school: string;
  class_number: string;
}

export interface WorkshopFormData extends StudentFormData {
  selectedWorkshop: number | null;
}

type FormDataType = BaseFormData | PhysicsDayFormData | StudentFormData | WorkshopFormData;

interface UseRegistrationFormProps<T extends FormDataType> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  validate?: (data: T) => string | null;
}

export function useRegistrationForm<T extends FormDataType>({
  initialData,
  onSubmit,
  validate
}: UseRegistrationFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateClass = (classStr: string): boolean => {
    const classNum = parseInt(classStr, 10);
    return !isNaN(classNum) && classNum >= 1 && classNum <= 11;
  };

  const validateRequired = (data: T): string | null => {
    const requiredFields = ['name', 'email', 'phone', 'city'];
    const emptyFields = requiredFields.filter(field => !data[field as keyof T]);
    
    if (emptyFields.length > 0) {
      return 'Все обязательные поля должны быть заполнены.';
    }

    if (!data.agreement) {
      return 'Необходимо дать согласие на обработку персональных данных для продолжения регистрации.';
    }

    if (!validateEmail(data.email)) {
      return 'Пожалуйста, введите корректный email адрес.';
    }

    return null;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Basic validation
    const basicError = validateRequired(formData);
    if (basicError) {
      throw new Error(basicError);
    }

    // Custom validation
    if (validate) {
      const customError = validate(formData);
      if (customError) {
        throw new Error(customError);
      }
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData(initialData); // Reset form on success
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialData);
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormData
  };
}

// Specific form validators
export const validatePhysicsDayForm = (data: PhysicsDayFormData, role: UserRole): string | null => {
  if (role === "Школьник") {
    if (!data.school || !data.class) {
      return 'Для школьников поля "Школа" и "Класс" обязательны для заполнения.';
    }
    
    const classNum = parseInt(data.class, 10);
    if (isNaN(classNum) || classNum < 1 || classNum > 11) {
      return 'Пожалуйста, введите номер класса от 1 до 11.';
    }
  }
  
  return null;
};

export const validateStudentForm = (data: StudentFormData): string | null => {
  const requiredFields = ['school', 'class_number'];
  const emptyFields = requiredFields.filter(field => !data[field as keyof StudentFormData]);
  
  if (emptyFields.length > 0) {
    return 'Все поля формы обязательны для заполнения.';
  }
  
  const classNum = parseInt(data.class_number, 10);
  if (isNaN(classNum) || classNum < 1 || classNum > 11) {
    return 'Пожалуйста, введите номер класса от 1 до 11.';
  }
  
  return null;
};

export const validateWorkshopForm = (data: WorkshopFormData): string | null => {
  const studentError = validateStudentForm(data);
  if (studentError) return studentError;
  
  if (!data.selectedWorkshop) {
    return 'Необходимо выбрать мастер-класс для регистрации.';
  }
  
  return null;
};