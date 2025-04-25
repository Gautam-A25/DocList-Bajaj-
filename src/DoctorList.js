import React from "react";

const DoctorList = ({ doctors }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {doctors && doctors.length > 0 ? (
      doctors.map((doctor) => (
        <div
          key={doctor.id}
          data-testid="doctor-card"
          style={{
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            padding: 20,
            display: "flex",
            gap: 16,
          }}
        >
          <div style={{ minWidth: 60 }}>
            <img
              src={
                doctor.image || doctor.photo || "https://via.placeholder.com/60"
              }
              alt={doctor.name}
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60";
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div
              data-testid="doctor-name"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#333",
                marginBottom: 4,
              }}
            >
              {doctor.name}
            </div>

            <div
              data-testid="doctor-specialty"
              style={{ color: "#666", fontSize: 14, marginBottom: 2 }}
            >
              {doctor.specialities &&
                doctor.specialities
                  .map((s) => (typeof s === "object" ? s.name : s))
                  .join(", ")}
            </div>

            <div
              data-testid="doctor-experience"
              style={{ fontSize: 13, color: "#777", marginBottom: 6 }}
            >
              {doctor.experience}
            </div>

            {/* Consultation details */}
            <div style={{ marginTop: 10 }}>
              {(doctor.consultationMode === "video" ||
                doctor.video_consult) && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: 6 }}
                  >
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect
                      x="1"
                      y="5"
                      width="15"
                      height="14"
                      rx="2"
                      ry="2"
                    ></rect>
                  </svg>
                  <span>Video Consultation</span>
                </div>
              )}

              {doctor.clinic && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                    marginTop: 4,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: 6 }}
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>
                    {typeof doctor.clinic === "string"
                      ? doctor.clinic
                      : doctor.clinic && typeof doctor.clinic === "object"
                      ? doctor.clinic.name || "Clinic"
                      : "Clinic"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div
              data-testid="doctor-fee"
              style={{ fontWeight: 700, fontSize: 16, color: "#333" }}
            >
              {typeof doctor.fees === "string" && doctor.fees.includes("₹")
                ? doctor.fees
                : `₹ ${doctor.fees}`}
            </div>

            <button
              style={{
                marginTop: 15,
                background: "#0078d7",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      ))
    ) : (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
        No doctors found matching your criteria
      </div>
    )}
  </div>
);

export default DoctorList;
