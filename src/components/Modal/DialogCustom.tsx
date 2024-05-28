import React, { useState } from "react";

interface DialogProps {
  title: string;
  content: string;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, content, onClose }) => {
  return (
    <div className="dialog">
      <div className="dialog-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <div className="dialog-actions">
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string;
  actions?: React.ReactNode;
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  title = "Dialog",
  content = "Conteúdo do diálogo",
  actions = null,
}) => {
  if (!isOpen) return null;

  return (
    <div className="custom-dialog-overlay">
      <div className="custom-dialog">
        <Dialog title={title} content={content} onClose={onClose} />
        {actions && <div className="custom-dialog-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default CustomDialog;
