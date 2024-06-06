import { useState, useEffect } from "react";

const SearchComponent = () => {
  const [data, setData] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    fetch("../../../test.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (query) {
      const filteredResults = data.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, data]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        value={query}
        onChange={(event: any) => setQuery(event?.target?.value)}
        placeholder="Search..."
        style={{ width: "100%", padding: "8px" }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            borderRadius: "4px",
            // backgroundColor: "white",
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 1000,
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
    </div>
  );
};

export default SearchComponent;
