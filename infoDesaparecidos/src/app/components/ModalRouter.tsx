"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useModal } from './ModalContext';
import ModalTabs from './ModalTabs';

interface ModalRouterProps {
  children: React.ReactNode;
}

export default function ModalRouter({ children }: ModalRouterProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Verifica se a URL corresponde a uma página que deve ser exibida como modal
      if (url.includes('/detalhes/') || url.includes('/enviar-informacoes/')) {
        const id = url.includes('/detalhes/') 
          ? url.split('/detalhes/')[1]?.split('?')[0]
          : url.split('/enviar-informacoes/')[1]?.split('?')[0];
        
        if (id) {
          const paginaAtual = new URLSearchParams(url.split('?')[1] || '').get('paginaAtual');
          setCurrentModal('pessoa');
          openModal(
            <ModalTabs 
              id={id} 
              paginaAtual={paginaAtual ? parseInt(paginaAtual) : undefined} 
            />, 
            `Informações - ID: ${id}`
          );
        }
      } else {
        // Se não for uma rota de modal, fecha o modal atual
        if (currentModal) {
          closeModal();
          setCurrentModal(null);
        }
      }
    };

    // Verifica a rota inicial
    if (router.isReady) {
      handleRouteChange(router.asPath);
    }

    // Escuta mudanças de rota
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router, openModal, closeModal, currentModal]);

  return <>{children}</>;
}
