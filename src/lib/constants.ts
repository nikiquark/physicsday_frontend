import { BookOpen, Gift, Lightbulb, Star, Target, Trophy } from "lucide-react";
import { ProgramItem } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const PROGRAM_ITEMS: ProgramItem[] = [
    {
      title: "Экскурсии в\u00A0научные институты Академгородка",
      image: "/institutes.jpg"
    },
    {
      title:"Уникальные физические демонстрации",
      image: "/dem.jpg"
    },
    {
      title:"Встречи с\u00A0ведущими учеными и\u00A0экспертами в\u00A0различных областях физики",
      image: "/pogosov.jpg"
    },
    {
      title:"ФизКвест",
      image: "/quest.jpg"
    },
    {
      title:"Physics Street",
      image: "/street.jpg"
    },
    {
      title:"Мастер-классы",
      image: "/masters.jpg"
    },
    {
      title:"ФизФест-олимпиады",
      image: "/olympiads.jpg"
    },
    {
      title:"Призы и\u00A0подарки от\u00A0организаторов",
      image: "/presents.png"
    },
    {
      title:"",
      image: "/cat1.png"
    }
];

export const BENEFITS = [
  {
    icon: BookOpen,
    title: "Кругозор и\u00A0эрудиция",
    description: "Шанс продемонстрировать широкий кругозор и эрудицию в области физики"
  },
  {
    icon: Target,
    title: "Оценка знаний",
    description: "Уникальная возможность проявить свои способности и оценить уровень своих знаний"
  },
  {
    icon: Lightbulb,
    title: "Мотивация",
    description: "Мотивация для дальнейшего изучения физики и расширения своих знаний"
  },
  {
    icon: Trophy,
    title: "Опыт",
    description: "Приобретение олимпиадного опыта"
  },
  {
    icon: Star,
    title: "Первый шаг",
    description: "Первый шаг на пути к победам в различных олимпиадах по физике в старших классах"
  },
  {
    icon: Gift,
    title: "Подарки и\u00A0дипломы",
    description: "Победители и призеры ФизФест - олимпиад будут награждены памятными подарками, все участники - дипломами"
  }
];

export const USER_ROLES= [
    "Школьник",
    "Родитель", 
    "Дошкольник",
    "Студент/аспирант и др."
] as const;