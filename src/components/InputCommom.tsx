import { FC, useEffect, useId, useState } from "react";

interface CustomInputProps {
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
  label?: string;
  className?: string;
  defaultValue?: string;
  typeData: "test" | "cpuData";
}

const CustomInput: FC<CustomInputProps> = ({
  type = "text",
  placeholder,
  label = "\u00A0",
  typeData,
  // onChange,
  style,
  defaultValue,
  className,
}) => {
  const inputId = useId();

  const [data, setData] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    fetch(`../../../${typeData}.json`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (query) {
      const regexExact = new RegExp(`^${query}$`, "i");
      const regexPartial = new RegExp(`${query}`, "i");

      const exactMatch = data.find((item) => regexExact.test(item));

      const partialMatches = data.filter(
        (item) => !exactMatch && regexPartial.test(item)
      );

      setResults(exactMatch ? [exactMatch] : partialMatches);
    } else {
      setResults([]);
    }
  }, [query, data]);

  // const handleResultClick = (result: string) => {
  //   onChange({ target: { value: result } } as any);
  // };

  return (
    <>
      <label htmlFor={inputId}>{label}</label>
      <input
        type={type}
        value={query || undefined}
        placeholder={placeholder}
        onChange={(event: any) => setQuery(event?.target?.value)}
        style={style}
        className={className}
        defaultValue={defaultValue}
      />
      {results.length > 0 &&
        !(results.length === 1 && results[0] === query) && (
          <ul
            style={{
              position: "absolute",
              top: "0",
              left: "75%",
              // right: 0,
              width: "max-content",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#222",
              listStyle: "none",
              margin: 0,
              padding: 0,
              maxHeight: "150px",
              overflowY: "auto",
              zIndex: 3,
            }}
          >
            {results.map((result, index) => (
              <li
                key={index}
                onClick={() => setQuery(result)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
    </>
  );
};

export default CustomInput;
