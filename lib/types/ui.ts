import { ReactNode } from "react";

/**
 * Modal types
 */
export interface Modal {
  id: string;
  component: ReactNode;
  props?: Record<string, any>;
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

/**
 * Modal props
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

/**
 * Form field props
 */
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Button props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

/**
 * Card props
 */
export interface CardProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
