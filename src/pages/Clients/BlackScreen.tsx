import React from "react";
import { XCircle } from "phosphor-react";

const BlackScreen = ({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) => {
  const screenStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    zIndex: 3,
  };

  const contentStyle: React.CSSProperties = {
    padding: "20px",
    backgroundColor: "black",
    borderRadius: "5px",
    textAlign: "left",
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
  };

  return (
    <div style={screenStyle}>
      <div style={contentStyle}>
        <button
          onClick={onClose}
          style={{
            border: "none",
            position: "relative",
            color: "white",
            left: "90%",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          <XCircle size="40" />
        </button>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            margin: 0,
            fontSize: "18px",
          }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
};

export default BlackScreen;
