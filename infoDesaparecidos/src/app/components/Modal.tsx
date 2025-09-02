import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-900 rounded shadow-lg w-full max-w-2xl p-6 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            onClick={() => router.back()}
          >
            ✕
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
