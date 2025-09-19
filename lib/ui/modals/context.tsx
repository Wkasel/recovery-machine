"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface Modal {
  id: string;
  component: ReactNode;
  props?: Record<string, any>;
}

interface ModalContextType {
  modals: Modal[];
  openModal: (id: string, component: ReactNode, props?: Record<string, any>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = (id: string, component: ReactNode, props?: Record<string, any>) => {
    setModals((prev) => [...prev.filter((m) => m.id !== id), { id, component, props }]);
  };

  const closeModal = (id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        closeAllModals,
      }}
    >
      {children}
      {/* Render modals */}
      {modals.map((modal) => (
        <div key={modal.id} className="modal-container">
          {modal.component}
        </div>
      ))}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
