import { useState, useRef, useEffect } from "react";
import { XCircle } from "phosphor-react";
import { request } from "../../utils/request";

const InputShell = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (command: string) => void;
  isLoading: boolean;
}) => {
  const [command, setCommand] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !isLoading) {
      onSubmit(command);
      setCommand("");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "5px" }}>$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e: any) => setCommand(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "white",
          fontSize: "18px",
          outline: "none",
          flex: 1,
        }}
      />
    </div>
  );
};

const Shell = ({
  onClose,
  clientId,
}: {
  onClose: () => void;
  clientId: string;
}) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const input = document.querySelector(".input-shell") as HTMLInputElement;
    if (outputRef.current) {
      let outputHeight = outputRef.current.scrollHeight;
      outputRef.current.scrollTop = outputHeight;

      const outputEl = document.querySelector(".output")?.lastElementChild;

      if (input && outputEl) {
        // @ts-ignore
        input.style.top = `${outputRef.current.scrollHeight + 60}px`;
        // outputRef.current.scrollTop = outputRef.current.scrollHeight;
        input.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [output]);

  const handleCommandSubmit = async (command: string) => {
    setIsLoading(true);
    try {
      const result = await request.post("/sockets/send-command", {
        clientId,
        command,
      });
      console.log(result.data);
      setOutput((prevOutput) => [...prevOutput, result.data]);
    } catch (err: any) {
      console.log(err.response.data.message);
      setOutput((prevOutput) => [...prevOutput, err.response.data.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        zIndex: 3,
      }}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "black",
          borderRadius: "5px",
          textAlign: "left",
          width: "1000px",
          height: "800px",
          maxHeight: "80%",
          overflow: "auto",
          border: "1px solid white",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            border: "none",
            position: "fixed",
            top: "5px",
            right: "5px",
            color: "white",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          <XCircle size="40" />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "85%",
            marginBottom: "10px",
            position: "absolute",
          }}
          className="input-shell"
        >
          <InputShell onSubmit={handleCommandSubmit} isLoading={isLoading} />
        </div>
        <div ref={outputRef} className="output" style={{ marginTop: "35px" }}>
          {output.map((line, index) => (
            <>
              <div
                key={index}
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "18px",
                  margin: "15px",
                }}
              >
                {line}
                <hr />
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shell;
