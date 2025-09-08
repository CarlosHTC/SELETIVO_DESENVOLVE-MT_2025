"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useModal } from './ModalContext';
import DetalhesModal from './DetalhesModal';
import EnviarInformacoesModal from './EnviarInformacoesModal';

interface ModalTabsProps {
  id: string;
  paginaAtual?: number;
}

export default function ModalTabs({ id, paginaAtual }: ModalTabsProps) {
  const [activeTab, setActiveTab] = useState<'detalhes' | 'enviar'>('detalhes');
  const router = useRouter();
  const { closeModal } = useModal();

  const handleTabChange = (tab: 'detalhes' | 'enviar') => {
    setActiveTab(tab);
  };

  const handleClose = () => {
    closeModal();
    // Volta para a página principal
    router.push('/', undefined, { shallow: true });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Cabeçalho com abas */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-0 flex-shrink-0">
        <div className="flex space-x-1 px-6">
          <button
            onClick={() => handleTabChange('detalhes')}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'detalhes'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            📋 Detalhes
          </button>
          <button
            onClick={() => handleTabChange('enviar')}
            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === 'enviar'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            📤 Enviar Informações
          </button>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'detalhes' ? (
          <DetalhesModal 
            id={id} 
            paginaAtual={paginaAtual} 
            onTabChange={handleTabChange}
          />
        ) : (
          <EnviarInformacoesModal 
            id={id} 
            paginaAtual={paginaAtual} 
          />
        )}
      </div>
    </div>
  );
}