"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalState {
  isOpen: boolean;
  content: ReactNode | null;
  title?: string;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
    title: undefined
  });

  const openModal = (content: ReactNode, title?: string) => {
    setModalState({
      isOpen: true,
      content,
      title
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      content: null,
      title: undefined
    });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
