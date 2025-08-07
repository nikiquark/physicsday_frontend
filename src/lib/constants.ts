import { BookOpen, Gift, Lightbulb, Star, Target, Trophy } from "lucide-react";
import { ProgramItem } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const PROGRAM_ITEMS: ProgramItem[] = [
    {
      title: "Экскурсии в\u00A0научные институты Академгородка",
      image: "https://optim.tildacdn.com/tild3465-3031-4536-a361-636162353030/-/resize/800x600/-/format/webp/Street3.jpg.webp"
    },
    {
      title:"Уникальные физические демонстрации",
      image: "https://optim.tildacdn.com/tild3266-3863-4136-a437-663966666133/-/resize/800x600/-/format/webp/Dem2.jpg.webp"
    },
    {
      title:"Встречи с\u00A0ведущими учеными и\u00A0экспертами в\u00A0различных областях физики",
      image: "https://optim.tildacdn.com/tild3162-6533-4330-b762-666234333932/-/resize/800x600/-/format/webp/Pogosov3_2.jpg.webp"
    },
    {
      title:"ФизКвест",
      image: "https://optim.tildacdn.com/tild6637-6461-4563-b336-366137323830/-/resize/800x600/-/format/webp/Quest.jpg.webp"
    },
    {
      title:"Physics Street",
      image: "https://optim.tildacdn.com/tild3465-3031-4536-a361-636162353030/-/resize/800x600/-/format/webp/Street3.jpg.webp"
    },
    {
      title:"Мастер-классы",
      image: "https://optim.tildacdn.com/tild6138-6365-4264-b738-353737633039/-/resize/800x600/-/format/webp/MasterClass.jpg.webp"
    },
    {
      title:"ФизФест-олимпиады",
      image: "https://optim.tildacdn.com/tild6435-3966-4331-b164-653962656466/-/resize/800x600/-/format/webp/83142585.jpg.webp"
    },
    {
      title:"Призы и\u00A0подарки от\u00A0организаторов",
      image: "https://optim.tildacdn.com/tild3837-3962-4464-b637-303739616330/-/resize/800x600/-/format/webp/image.png.webp"
    },
    {
      title:"",
      image: "https://optim.tildacdn.com/tild3065-6538-4238-a433-623763623937/-/resize/800x600/-/format/webp/FF_Cat-12_1.png.webp"
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