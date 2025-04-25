import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DoctorList from "./DoctorList";
import FilterPanel from "./FilterPanel";
import SearchBar from "./SearchBar";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [searchParams] = useSearchParams();
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        let doctorsData = [];

        if (Array.isArray(data)) {
          doctorsData = data;
        } else if (data && Array.isArray(data.doctors)) {
          doctorsData = data.doctors;
        } else if (data && typeof data === "object") {
          const possibleArrays = Object.values(data).filter(Array.isArray);
          if (possibleArrays.length > 0) {
            doctorsData = possibleArrays[0];
          }
        }

        if (doctorsData.length === 0) {
          throw new Error("Could not extract doctors data from API response");
        }

        const normalizedDoctors = doctorsData.map((doc) => ({
          id: doc.id || Math.random().toString(36).substr(2, 9),
          name: doc.name || "Unknown Doctor",
          image: doc.photo || doc.image || "https://via.placeholder.com/60",
          specialities: Array.isArray(doc.specialities)
            ? doc.specialities.map((spec) =>
                typeof spec === "string" ? { name: spec } : spec
              )
            : doc.specialities
            ? [{ name: doc.specialities.toString() }]
            : [],
          fees: doc.fees || "0",
          experience: doc.experience || "No experience info",
          clinic: doc.clinic || null,
          consultationMode: doc.video_consult
            ? "video"
            : doc.in_clinic
            ? "clinic"
            : "unknown",
        }));

        setDoctors(normalizedDoctors);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError(error.message);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loading || doctors.length === 0) return;

    let result = [...doctors];

    const searchTerm = searchParams.get("search") || "";
    if (searchTerm) {
      result = result.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const consultation = searchParams.get("consultation");
    if (consultation) {
      result = result.filter((doctor) => {
        if (typeof doctor.consultationMode === "string") {
          return (
            doctor.consultationMode.toLowerCase() === consultation.toLowerCase()
          );
        }

        if (consultation === "video" && doctor.video_consult) {
          return true;
        }

        if (consultation === "clinic" && doctor.in_clinic) {
          return true;
        }

        return false;
      });
    }

    const specialties = searchParams.getAll("specialty");
    if (specialties.length > 0) {
      result = result.filter((doctor) => {
        if (!doctor.specialities || !Array.isArray(doctor.specialities)) {
          return false;
        }

        return specialties.some((selectedSpecialty) => {
          const normalizedSelectedSpecialty = selectedSpecialty
            .toLowerCase()
            .replace(/-/g, " ");

          return doctor.specialities.some((docSpec) => {
            const docSpecName =
              typeof docSpec === "string"
                ? docSpec.toLowerCase()
                : docSpec.name.toLowerCase();

            return (
              docSpecName === normalizedSelectedSpecialty ||
              docSpecName.includes(normalizedSelectedSpecialty) ||
              normalizedSelectedSpecialty.includes(docSpecName) ||
              docSpecName.replace(/\s+/g, "-").toLowerCase() ===
                selectedSpecialty.toLowerCase()
            );
          });
        });
      });
    }

    const sortBy = searchParams.get("sort");
    if (sortBy === "fees") {
      result.sort((a, b) => {
        const aFee =
          typeof a.fees === "string"
            ? parseInt(a.fees.replace(/[^\d]/g, ""), 10) || 0
            : parseInt(a.fees) || 0;
        const bFee =
          typeof b.fees === "string"
            ? parseInt(b.fees.replace(/[^\d]/g, ""), 10) || 0
            : parseInt(b.fees) || 0;
        return aFee - bFee;
      });
    } else if (sortBy === "experience") {
      result.sort((a, b) => {
        const getExperienceYears = (exp) => {
          if (typeof exp !== "string") return 0;
          const match = exp.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        };

        const aExp = getExperienceYears(a.experience);
        const bExp = getExperienceYears(b.experience);

        return bExp - aExp;
      });
    }

    setFilteredDoctors(result);
  }, [doctors, searchParams, loading]);

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <h2>Error loading doctors</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f7fafd",
      }}
    >
      {/* Header with search bar */}
      <header style={{ background: "#0078d7", padding: "16px 32px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <SearchBar doctors={doctors} />
        </div>
      </header>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flex: 1,
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: 260,
            background: "#fff",
            padding: 20,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            marginTop: 20,
            marginRight: 20,
            height: "fit-content",
            borderRadius: 8,
          }}
        >
          <FilterPanel />
        </aside>

        {/* Doctor list */}
        <main style={{ flex: 1, padding: "20px 0" }}>
          {loading ? (
            <div style={{ padding: 32, textAlign: "center" }}>
              Loading doctors...
            </div>
          ) : (
            <DoctorList doctors={filteredDoctors} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
