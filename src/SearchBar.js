import { useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

function SearchBar({ doctors }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );
  const suggestionRef = useRef(null);

  useEffect(() => {
    setInputValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (value) => {
    setInputValue(value);

    if (doctors && value) {
      const filtered = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(inputValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }} ref={suggestionRef}>
      <div
        style={{
          display: "flex",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          background: "white",
        }}
      >
        <input
          data-testid="autocomplete-input"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Symptoms, Doctors, Specialities, Clinics..."
          style={{
            padding: "12px 16px",
            fontSize: "16px",
            border: "none",
            outline: "none",
            flex: 1,
          }}
        />
        <button
          onClick={() => handleSubmit(inputValue)}
          style={{
            background: "#0078d7",
            border: "none",
            color: "white",
            padding: "0 20px",
            cursor: "pointer",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderTop: "none",
            zIndex: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              onClick={() => {
                handleSubmit(doctor.name);
                setInputValue(doctor.name);
              }}
              style={{
                padding: "10px 16px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "bold" }}>{doctor.name}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {doctor.specialities &&
                    doctor.specialities
                      .map((s) => (typeof s === "object" ? s.name : s))
                      .join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
