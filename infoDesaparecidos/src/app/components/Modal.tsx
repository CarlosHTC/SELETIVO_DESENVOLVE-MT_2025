"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "./ModalContext";

export default function Modal() {
  const { modalState, closeModal } = useModal();

  if (!modalState.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] min-h-[60vh] flex flex-col relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fixo */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            {modalState.title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalState.title}
              </h2>
            )}
            <button
              className="text-gray-600 hover:text-red-600 text-2xl font-bold transition-colors"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>
          
          {/* Conteúdo com scroll */}
          <div className="flex-1 overflow-y-auto">
            {modalState.content}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
