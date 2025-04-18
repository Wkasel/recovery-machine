import { ReactNode } from "react";

export interface Modal {
  id: string;
  component: ReactNode;
  onClose?: () => void;
}

export interface ModalContextType {
  openModal: (modal: Omit<Modal, "id">) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  getModal: (id: string) => Modal | undefined;
  isModalOpen: (id: string) => boolean;
  getModals: () => Modal[];
}
