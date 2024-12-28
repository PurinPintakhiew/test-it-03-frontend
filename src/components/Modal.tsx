import React from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-1/2 max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="text-white font-bold bg-blue-800 p-2">{title}</div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
