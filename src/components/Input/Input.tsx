import { HTMLAttributes, forwardRef, useId } from "react";

type inputProps = HTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  hasError?: boolean; // Adicione a propriedade hasError
};

export const Input = forwardRef<HTMLInputElement, inputProps>(
  (
    {
      type = "text",
      name = "",
      label = "\u00A0",
      helperText = "",
      hasError = false,
      ...props
    },
    ref
  ) => {
    // console.log()
    const inputId = useId();
    hasError = helperText.length > 0;

    return (
      <div className="InputContent">
        <label className="Label" htmlFor={inputId}>
          {label}
        </label>
        <input
          id={inputId}
          type={type}
          name={name}
          ref={ref as React.RefObject<HTMLInputElement>}
          className={`InputStyle ${hasError ? "hasError" : ""}`} // Adicione a classe "hasError" se houver erro
          {...props}
        />
        {hasError && <p>{helperText}</p>}
      </div>
    );
  }
);
