"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Блокируем скролл фона, добавляем Esc-закрытие и автофокус
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Фокус на кнопку закрытия
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // На мобильных — снизу (bottom sheet), на >=sm — по центру
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 sm:bg-black/80"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 1 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              // На мобилках — лист на всю ширину c округлением сверху
              className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl mx-0 sm:mx-4 overflow-hidden"
              // Ограничение высоты + прокрутка содержимого
              style={{
                maxHeight: "calc(100dvh - 0.75rem)", // безопасно для мобильных браузеров
                paddingBottom: "env(safe-area-inset-bottom)", // safe area iOS
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#344EAD] to-[#4A5BBF] text-white p-4 sm:p-6 relative">
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Закрыть окно контактов"
                  className="absolute top-3 right-3 rounded-full p-1 sm:p-3 transition-colors hover:bg-white/10 active:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
                <h2
                  id="contact-modal-title"
                  className="text-lg sm:text-2xl font-bold leading-tight pr-10"
                >
                  Контакты
                </h2>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto overscroll-contain">
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-x-2 sm:gap-y-2 text-gray-800">
                  <span className="font-semibold leading-tight">
                    Котельникова Мария Станиславовна
                  </span>

                  {/* Разделители только на широких экранах */}
                  <span className="hidden sm:inline text-gray-300">•</span>

                  <a
                    href="mailto:m.kotelnikova@g.nsu.ru"
                    className="hover:underline break-words"
                  >
                    m.kotelnikova@g.nsu.ru
                  </a>

                  <span className="hidden sm:inline text-gray-300">•</span>

                  <a href="tel:+79139210054" className="hover:underline">
                    +7-913-921-00-54
                  </a>
                </div>

                <motion.a
                  href="https://vk.com/ff_fest_nsu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0077FF]/40"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label="Открыть сообщество ФизФест во ВКонтакте"
                >
                  <div className="bg-[#0077FF] text-white p-2.5 rounded-lg group-hover:bg-[#0066DD] transition-colors">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-.906-1.49-.906s-.132-.026-.132.4v1.594c0 .429-.138.686-1.355.686-2.024 0-4.287-1.225-5.853-3.52-2.415-3.422-3.089-5.984-3.089-6.522 0-.37.074-.714.469-.714H5.27c.443 0 .608.303.777.638.883 1.75 2.375 3.278 2.973 3.278.226 0 .325-.104.325-.677V9.631c-.06-1.435-.854-1.57-.854-2.081 0-.303.251-.605.659-.605h2.716c.443 0 .607.225.607.614v3.655c0 .443.203.607.329.607.226 0 .445-.164.89-.608 1.353-1.518 2.32-3.847 2.32-3.847.132-.303.336-.605.779-.605h1.744c.525 0 .643.27.525.638-.197.625-2.102 3.673-2.102 3.673-.188.303-.259.435 0 .748.198.235.850.838 1.284 1.349.733.859 1.289 1.578 1.289 2.081.001.222-.11.584-.683.584z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-sm font-medium text-gray-900">
                      ВКонтакте
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      ФизФест в ВК
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
