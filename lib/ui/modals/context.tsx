"use client";

import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { Modal, ModalContextType } from "@/lib/ui/modals/types";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Create context with default values
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Modal provider component that manages modals state
 *
 * Wraps your application to provide modal functionality
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([]);

  // Open a new modal and return its ID
  const openModal = useCallback((modal: Omit<Modal, "id">) => {
    const id = uuidv4();

    setModals((prev) => [...prev, { ...modal, id }]);

    Logger.getInstance().debug("Modal opened", { component: "ModalProvider", modalId: id });

    return id;
  }, []);

  // Close a modal by ID
  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modalToClose = prev.find((modal) => modal.id === id);

      if (modalToClose?.onClose) {
        try {
          modalToClose.onClose();
        } catch (error) {
          Logger.getInstance().error(
            "Error in modal onClose handler",
            { component: "ModalProvider", modalId: id },
            AppError.from(error)
          );
        }
      }

      Logger.getInstance().debug("Modal closed", { component: "ModalProvider", modalId: id });

      return prev.filter((modal) => modal.id !== id);
    });
  }, []);

  // Close all modals
  const closeAllModals = useCallback(() => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        try {
          modal.onClose();
        } catch (error) {
          Logger.getInstance().error(
            "Error in modal onClose handler",
            { component: "ModalProvider", modalId: modal.id },
            AppError.from(error)
          );
        }
      }
    });

    setModals([]);

    Logger.getInstance().debug("All modals closed", { component: "ModalProvider" });
  }, [modals]);

  // Get a modal by ID
  const getModal = useCallback(
    (id: string) => {
      return modals.find((modal) => modal.id === id);
    },
    [modals]
  );

  // Check if a modal is open
  const isModalOpen = useCallback(
    (id: string) => {
      return modals.some((modal) => modal.id === id);
    },
    [modals]
  );

  // Get all modals
  const getModals = useCallback(() => {
    return modals;
  }, [modals]);

  // Context value
  const value: ModalContextType = {
    openModal,
    closeModal,
    closeAllModals,
    getModal,
    isModalOpen,
    getModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* Modal container for rendering modals */}
      <div id="modal-root">
        {modals.map((modal) => (
          <div key={modal.id} className="modal-container">
            {modal.component}
          </div>
        ))}
      </div>
    </ModalContext.Provider>
  );
}

/**
 * Hook to access the modal context
 *
 * @returns Modal context with methods for managing modals
 * @throws Error if used outside of a ModalProvider
 *
 * @example
 * ```tsx
 * const { openModal, closeModal } = useModal();
 *
 * const handleOpenModal = () => {
 *   openModal({
 *     component: <MyModal />,
 *     onClose: () => console.log('Modal closed')
 *   });
 * };
 * ```
 */
export function useModal(): ModalContextType {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}
