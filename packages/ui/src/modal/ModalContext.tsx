import React, { createContext, useContext, useState, useCallback } from 'react';

interface ModalData {
  props?: Record<string, unknown>;
}

interface ModalContextType {
  activeModal: string | null;
  modalData: ModalData | null;
  openModal: (modalId: string, data?: ModalData) => void;
  closeModal: () => void;
  isModalOpen: (modalId: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const openModal = useCallback((modalId: string, data?: ModalData) => {
    setActiveModal(modalId);
    setModalData(data || null);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  const isModalOpen = useCallback(
    (modalId: string) => activeModal === modalId,
    [activeModal]
  );

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export type { ModalContextType, ModalData };
