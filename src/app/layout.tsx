import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ФизФест | День физики в НГУ",
    description: 'Фестиваль науки ФизФест НГУ - масштабное событие для школьников и любителей физики. Мастер-классы, олимпиады, эксперименты и встречи с учеными-практиками. Присоединяйтесь к празднику науки в Новосибирском государственном университете!',
    keywords: [
        'ФизФест',
        'НГУ',
        'Новосибирский государственный университет',
        'фестиваль науки',
        'физика',
        'школьники',
        'мастер-классы',
        'олимпиады по физике',
        'эксперименты',
        'популяризация науки',
        'Новосибирск',
        'научный фестиваль',
        'студенты НГУ',
        'физические опыты',
        'образование',
        'наука для школьников',
        'физфак НГУ',
        'молодые ученые',
        'научно-популярные мероприятия',
        'регистрация на фестиваль'
    ],
    authors: [{ name: 'Okhotnikov Nikita', url: 'https://okhotnikov.space' }],
    creator: 'Okhotnikov Nikita',
    publisher: 'Okhotnikov Nikita',
    openGraph: {
        title: 'ФизФест 2025 - Фестиваль науки НГУ',
        description: 'Присоединяйтесь к фестивалю науки ФизФест! Мастер-классы, олимпиады и эксперименты для школьников и всех любителей физики.',
        type: 'website',
        locale: 'ru_RU',
        siteName: 'ФизФест НГУ'
    },
    metadataBase: new URL('https://physicsday.ru'),
    alternates: {
        canonical: '/'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
        other: [
            {
                rel: 'android-chrome-192x192',
                url: '/android-chrome-192x192.png',
            },
            {
                rel: 'android-chrome-512x512',
                url: '/android-chrome-512x512.png',
            },
        ],
    },
    manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
