import React from "react";
import "./style.css";
import { X } from "phosphor-react";

interface ModalProps {
  onClose: () => void;
  children: any;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, isOpen }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="backdrop" onClick={onClose} />
      <div className="content">
        <div className="close-button" onClick={onClose}>
          <X size={40} />
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
