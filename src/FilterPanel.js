import { useSearchParams } from "react-router-dom";
import React from "react";

const SPECIALTIES = [
  "General-Physician",
  "Dentist",
  "Dermatologist",
  "Paediatrician",
  "Gynaecologist",
  "ENT",
  "Diabetologist",
  "Cardiologist",
  "Physiotherapist",
  "Endocrinologist",
  "Orthopaedic",
  "Ophthalmologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Psychiatrist",
  "Urologist",
  "Dietitian-Nutritionist",
  "Psychologist",
  "Sexologist",
  "Nephrologist",
  "Neurologist",
  "Oncologist",
  "Ayurveda",
  "Homeopath",
];

const FilterPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(searchParams);

    if (type === "consultation") {
      if (params.get("consultation") === value || value === "all") {
        params.delete("consultation");
      } else {
        params.set("consultation", value);
      }
    } else if (type === "specialty") {
      const specialties = params.getAll("specialty");
      if (specialties.includes(value)) {
        // Remove this specialty
        params.delete("specialty");
        specialties.forEach((s) => {
          if (s !== value) params.append("specialty", s);
        });
      } else {
        params.append("specialty", value);
      }
    } else if (type === "sort") {
      if (params.get("sort") === value) {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
    }

    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const consultationMode = searchParams.get("consultation");

  return (
    <div className="filter-panel">
      <div className="filter-section" data-testid="filter-header-sort">
        <h3>Sort By</h3>
        <div className="sort-buttons">
          <button
            data-testid="sort-fees"
            onClick={() => handleFilterChange("sort", "fees")}
            className={searchParams.get("sort") === "fees" ? "active" : ""}
            style={{
              padding: "8px 12px",
              margin: "5px 0",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              background:
                searchParams.get("sort") === "fees" ? "#e6f7ff" : "#fff",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            Price: Low-High
          </button>
          <button
            data-testid="sort-experience"
            onClick={() => handleFilterChange("sort", "experience")}
            className={
              searchParams.get("sort") === "experience" ? "active" : ""
            }
            style={{
              padding: "8px 12px",
              margin: "5px 0",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              background:
                searchParams.get("sort") === "experience" ? "#e6f7ff" : "#fff",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            Experience: Most Experience First
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div
          className="filter-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Filters</h3>
          <button
            onClick={clearAllFilters}
            style={{
              color: "#0078d7",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="filter-section" data-testid="filter-header-speciality">
        <h3>Specialities</h3>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          {SPECIALTIES.map((specialty) => (
            <div
              key={specialty}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 0",
              }}
            >
              <input
                type="checkbox"
                id={`specialty-${specialty}`}
                data-testid={`filter-specialty-${specialty}`}
                checked={searchParams.getAll("specialty").includes(specialty)}
                onChange={() => handleFilterChange("specialty", specialty)}
                style={{ marginRight: "8px" }}
              />
              <label htmlFor={`specialty-${specialty}`}>
                {specialty.replace(/-/g, " ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section" data-testid="filter-header-moc">
        <h3>Mode of consultation</h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              data-testid="filter-video-consult"
              checked={consultationMode === "video"}
              onChange={() => handleFilterChange("consultation", "video")}
              style={{ marginRight: "8px" }}
            />
            Video Consultation
          </label>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              data-testid="filter-in-clinic"
              checked={consultationMode === "clinic"}
              onChange={() => handleFilterChange("consultation", "clinic")}
              style={{ marginRight: "8px" }}
            />
            In-clinic Consultation
          </label>
          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="radio"
              checked={!consultationMode}
              onChange={() => handleFilterChange("consultation", "all")}
              style={{ marginRight: "8px" }}
            />
            All
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
