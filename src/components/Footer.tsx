export default function Footer() {
  return (
      <footer id="contacts" className="bg-[#344EAD] py-10 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <img className="h-16" src="/nsu_logo.webp" alt="Логотип НГУ"/>
          <div className="text-center md:text-right">
            <p className="mb-2">Контакты: m.kotelnikova@g.nsu.ru, <span className="whitespace-nowrap">+7-913-921-00-54</span></p>
            <p className="text-sm">© Физический факультет НГУ</p>
            <p className="text-xs text-white/70 mt-1">
              Made by <a href="https://okhotnikov.space" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline-offset-2 underline">Nikita Okhotnikov</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}