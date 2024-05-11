import React, { useEffect } from "react";
import "./style.css";
import { X } from "phosphor-react";

interface ModalProps {
  onClose: () => void;
  children: any;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  useEffect(() => {
    // Adiciona uma classe ao body para prevenir o scroll do conteúdo por trás do modal
    document.body.classList.add("modal-open");

    return () => {
      // Remove a classe do body ao fechar o modal
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div className="modal-container">
      <div className="backdrop" onClick={onClose} />
      <div className="content">
        {/* <div style={{ marginBottom: "20px" }}> */}
        <div className="close-button" onClick={onClose}>
          <X size={40} />
        </div>
        {/* </div> */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
