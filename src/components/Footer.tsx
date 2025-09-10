export default function Footer() {
  return (
      <footer id="contacts" className="bg-[#344EAD] py-10 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0">
          <div className="text-left">
            <p className="mb-2">Контакты: m.kotelnikova@g.nsu.ru, <span className="whitespace-nowrap">+7-913-921-00-54</span></p>
            <p className="text-sm">© Физический факультет НГУ</p>
            <p className="text-xs text-white/70 mt-1">
              Made by <a href="https://okhotnikov.space" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline-offset-2 underline">Nikita Okhotnikov</a>
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="mb-3">Мы в соцсетях</p>
            <a 
              href="https://vk.ru/ff_fest_nsu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-75 transition-opacity"
              aria-label="Мы ВКонтакте"
            >
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="currentColor"
                className="text-white hover:text-blue-300 transition-colors"
              >
                <path d="M3 15.48C3 9.59687 3 6.65531 4.82765 4.82765C6.65531 3 9.59687 3 15.48 3H16.52C22.4031 3 25.3447 3 27.1723 4.82765C29 6.65531 29 9.59687 29 15.48V16.52C29 22.4031 29 25.3447 27.1723 27.1723C25.3447 29 22.4031 29 16.52 29H15.48C9.59687 29 6.65531 29 4.82765 27.1723C3 25.3447 3 22.4031 3 16.52V15.48Z" fill="#0077FF"/>
<path d="M16.8226 21.8C10.9119 21.8 7.5405 17.746 7.40002 11H10.3608C10.458 15.9514 12.6408 18.0486 14.3697 18.4811V11H17.1576V15.2703C18.8649 15.0865 20.6585 13.1405 21.2636 11H24.0516C23.5869 13.6378 21.6419 15.5838 20.2587 16.3838C21.6419 17.0324 23.8572 18.7297 24.7 21.8H21.6311C20.9719 19.7459 19.3296 18.1567 17.1576 17.9405V21.8H16.8226Z" fill="white"/>

              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}