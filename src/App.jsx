import React, { useEffect, useState } from "react";
import axios from "axios";

// ── Fallback mock data (used when API is unavailable / CORS blocked) ─────────
const MOCK_INTERNSHIPS = [
  {
    id: 1, title: "Web Development", company_name: "Tech Mahindra",
    profile_name: "Web Development", location_names: ["Delhi", "Noida"],
    work_from_home: false, start_date: "Immediately", duration: "3 Months",
    stipend: { salary: "₹ 10,000 /month", salaryValue1: 10000 },
    posted_by_label: "Posted 2 days ago", actively_hiring: true,
  },
  {
    id: 2, title: "Android App Development", company_name: "Zomato",
    profile_name: "Android Development", location_names: [],
    work_from_home: true, start_date: "1 Jun' 25", duration: "2 Months",
    stipend: { salary: "₹ 5,000 /month", salaryValue1: 5000 },
    posted_by_label: "Posted 1 day ago", actively_hiring: true,
  },
  {
    id: 3, title: "Data Science", company_name: "KPMG India",
    profile_name: "Data Science", location_names: ["Mumbai"],
    work_from_home: false, start_date: "15 Jun' 25", duration: "5 Months",
    stipend: { salary: "₹ 20,000 /month", salaryValue1: 20000 },
    posted_by_label: "Posted 3 days ago", actively_hiring: true,
  },
  {
    id: 4, title: "UI/UX Design", company_name: "Swiggy",
    profile_name: "UI/UX Design", location_names: [],
    work_from_home: true, start_date: "Immediately", duration: "3 Months",
    stipend: { salary: "₹ 8,000 /month", salaryValue1: 8000 },
    posted_by_label: "Posted 5 hours ago", actively_hiring: true,
  },
  {
    id: 5, title: "Machine Learning", company_name: "Microsoft",
    profile_name: "Machine Learning", location_names: ["Hyderabad"],
    work_from_home: false, start_date: "1 Jul' 25", duration: "6 Months",
    stipend: { salary: "₹ 50,000 /month", salaryValue1: 50000 },
    posted_by_label: "Posted today", actively_hiring: true,
  },
  {
    id: 6, title: "Content Writing", company_name: "Unacademy",
    profile_name: "Content Writing", location_names: [],
    work_from_home: true, start_date: "Immediately", duration: "2 Months",
    stipend: { salary: "₹ 3,000 /month", salaryValue1: 3000 },
    posted_by_label: "Posted 4 days ago", actively_hiring: false,
  },
  {
    id: 7, title: "Business Development", company_name: "BYJU'S",
    profile_name: "Business Development", location_names: ["Bangalore", "Pune"],
    work_from_home: false, start_date: "15 Jul' 25", duration: "3 Months",
    stipend: { salary: "₹ 15,000 /month", salaryValue1: 15000 },
    posted_by_label: "Posted 1 week ago", actively_hiring: true,
  },
  {
    id: 8, title: "Full Stack Development", company_name: "Razorpay",
    profile_name: "Full Stack Development", location_names: [],
    work_from_home: true, start_date: "Immediately", duration: "6 Months",
    stipend: { salary: "₹ 25,000 /month", salaryValue1: 25000 },
    posted_by_label: "Posted 2 days ago", actively_hiring: true,
  },
];

// ── Generate a deterministic pastel logo color from a string ─────────────────
function getLogoStyle(name = "") {
  const palettes = [
    { bg: "#e8f4fd", text: "#1a6fad" },
    { bg: "#fff0f0", text: "#c0392b" },
    { bg: "#f0f4ff", text: "#2c3e90" },
    { bg: "#fff5ee", text: "#d35400" },
    { bg: "#f0fff4", text: "#1a7a4a" },
    { bg: "#fdf0ff", text: "#7d3c98" },
    { bg: "#fffbf0", text: "#b7770d" },
    { bg: "#f0f8ff", text: "#1a5276" },
  ];
  const idx = name.charCodeAt(0) % palettes.length;
  return palettes[idx];
}

// ── Internship Card ──────────────────────────────────────────────────────────
function InternshipCard({ item }) {
  const logoStyle = getLogoStyle(item.company_name);
  const initials = item.company_name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e8",
        borderRadius: "8px",
        padding: "20px 24px",
        marginBottom: "12px",
        transition: "box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.09)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Top row */}
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
        {/* Logo */}
        <div
          style={{
            width: "48px", height: "48px", borderRadius: "6px",
            background: logoStyle.bg, color: logoStyle.text,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "700", fontSize: "15px", flexShrink: 0,
            border: "1px solid #f0f0f0",
          }}
        >
          {item.company_logo_updated ? (
            <img
              src={item.company_logo_updated}
              alt={item.company_name}
              style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "4px" }}
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
          ) : null}
          <span style={{ display: item.company_logo_updated ? "none" : "flex" }}>{initials}</span>
        </div>

        {/* Title & company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#1a1a1a", lineHeight: 1.3 }}>
              {item.title}
            </h3>
            {item.actively_hiring && (
              <span style={{
                background: "#e8f5e9", color: "#2e7d32",
                fontSize: "11px", fontWeight: "500",
                padding: "2px 8px", borderRadius: "20px", whiteSpace: "nowrap",
              }}>
                Actively hiring
              </span>
            )}
          </div>
          <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#666" }}>
            {item.company_name}
          </p>
        </div>

        {/* View details button */}
        <button
          style={{
            background: "transparent", border: "1.5px solid #006bff",
            color: "#006bff", borderRadius: "4px", padding: "6px 16px",
            fontSize: "13px", fontWeight: "500", cursor: "pointer",
            whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#006bff";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#006bff";
          }}
        >
          View details
        </button>
      </div>

      {/* Details row */}
      <div style={{ display: "flex", gap: "28px", marginTop: "14px", flexWrap: "wrap" }}>
        {[
          {
            icon: "📍",
            label: item.work_from_home
              ? "Work from home"
              : (item.location_names || []).join(", ") || "Remote",
          },
          { icon: "📅", label: item.start_date },
          { icon: "⏱", label: item.duration },
          { icon: "💰", label: item.stipend?.salary || "Not disclosed" },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "13px" }}>{icon}</span>
            <span style={{ fontSize: "13px", color: "#444" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Tags + posted label */}
      <div style={{
        display: "flex", gap: "8px", marginTop: "12px",
        flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {item.work_from_home && <Tag bg="#e3f2fd" color="#1565c0" label="Work from home" />}
          {item.part_time && <Tag bg="#fce4ec" color="#880e4f" label="Part-time" />}
          {item.is_ppo && <Tag bg="#fff8e1" color="#f57f17" label="PPO" />}
          <Tag bg="#f5f5f5" color="#555" label="Internship" />
        </div>
        <span style={{ fontSize: "12px", color: "#999" }}>{item.posted_by_label}</span>
      </div>
    </div>
  );
}

function Tag({ bg, color, label }) {
  return (
    <span style={{
      background: bg, color, fontSize: "12px",
      padding: "3px 10px", borderRadius: "20px", fontWeight: "500",
    }}>
      {label}
    </span>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "36px", height: "20px", borderRadius: "10px",
        background: checked ? "#006bff" : "#e0e0e0",
        cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: "16px", height: "16px", borderRadius: "50%",
        background: "#fff", position: "absolute", top: "2px",
        left: checked ? "18px" : "2px",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [internships, setInternships] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [wfhOnly, setWfhOnly] = useState(false);
  const [partTimeOnly, setPartTimeOnly] = useState(false);

  // ── Fetch from Internshala API (from your original code) ──────────────────
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get("https://internshala.com/hiring/search");
        const data = Object.values(res.data.internships_meta);
        setInternships(data);
        setFilteredData(data);
      } catch (err) {
        console.warn("API unavailable, using mock data:", err.message);
        setError("Live data unavailable — showing sample internships.");
        setInternships(MOCK_INTERNSHIPS);
        setFilteredData(MOCK_INTERNSHIPS);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  // ── Live filtering (runs on every filter change) ──────────────────────────
  useEffect(() => {
    const result = internships.filter((item) => {
      const profileMatch =
        profile === "" ||
        item.profile_name?.toLowerCase().includes(profile.toLowerCase());

      const locationMatch =
        location === "" ||
        item.work_from_home ||
        (item.location_names || []).some((loc) =>
          loc.toLowerCase().includes(location.toLowerCase())
        );

      const durationMatch = duration === "" || item.duration === duration;

      const stipendMatch =
        stipend === "" ||
        (item.stipend?.salaryValue1 ?? 0) >= Number(stipend);

      const wfhMatch = !wfhOnly || item.work_from_home;

      const partTimeMatch = !partTimeOnly || item.part_time;

      return profileMatch && locationMatch && durationMatch && stipendMatch && wfhMatch && partTimeMatch;
    });
    setFilteredData(result);
  }, [profile, location, duration, stipend, wfhOnly, partTimeOnly, internships]);

  // ── Clear all filters ─────────────────────────────────────────────────────
  const clearFilters = () => {
    setProfile("");
    setLocation("");
    setDuration("");
    setStipend("");
    setWfhOnly(false);
    setPartTimeOnly(false);
  };

  const inputStyle = {
    width: "100%", border: "1px solid #ddd", borderRadius: "4px",
    padding: "8px 10px", fontSize: "13px", color: "#333",
    outline: "none", boxSizing: "border-box", marginBottom: "10px",
    fontFamily: "inherit",
  };

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "16px",
        background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{
          width: "40px", height: "40px", border: "3px solid #e0e0e0",
          borderTop: "3px solid #006bff", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Loading internships…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "0 32px", display: "flex", alignItems: "center",
        justifyContent: "space-between", height: "56px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#006bff" }}>
            internshala
          </span>
          {["Internships", "Jobs", "Courses", "Projects"].map((label) => (
            <span key={label} style={{
              fontSize: "13px", color: "#444", cursor: "pointer",
              fontWeight: label === "Internships" ? "600" : "400",
              borderBottom: label === "Internships" ? "2px solid #006bff" : "none",
              paddingBottom: "2px",
            }}>
              {label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            border: "1px solid #006bff", color: "#006bff", background: "transparent",
            padding: "6px 16px", borderRadius: "4px", fontSize: "13px", cursor: "pointer",
          }}>Login</button>
          <button style={{
            border: "none", color: "#fff", background: "#006bff",
            padding: "6px 16px", borderRadius: "4px", fontSize: "13px", cursor: "pointer",
          }}>Register</button>
        </div>
      </nav>

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          background: "#fff8e1", borderBottom: "1px solid #ffe082",
          padding: "10px 32px", fontSize: "13px", color: "#7d5a00",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Body ── */}
      <div style={{
        maxWidth: "1140px", margin: "0 auto", padding: "24px 16px",
        display: "flex", gap: "20px", alignItems: "flex-start",
      }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: "260px", flexShrink: 0, background: "#fff",
          border: "1px solid #e8e8e8", borderRadius: "8px",
          padding: "18px", position: "sticky", top: "72px",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: "14px",
          }}>
            <span style={{ fontSize: "15px", fontWeight: "600", color: "#1a1a1a" }}>Filters</span>
            <span onClick={clearFilters} style={{
              fontSize: "13px", color: "#006bff", cursor: "pointer", fontWeight: "500",
            }}>Clear all</span>
          </div>

          <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>PROFILE</label>
          <input type="text" placeholder="e.g. Marketing" value={profile}
            onChange={(e) => setProfile(e.target.value)} style={inputStyle} />

          <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>CITY</label>
          <input type="text" placeholder="e.g. Delhi" value={location}
            onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

          <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>DURATION</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}
            style={{ ...inputStyle, background: "#fff" }}>
            <option value="">All Durations</option>
            <option value="1 Month">1 Month</option>
            <option value="2 Months">2 Months</option>
            <option value="3 Months">3 Months</option>
            <option value="5 Months">5 Months</option>
            <option value="6 Months">6 Months</option>
          </select>

          <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>MINIMUM STIPEND (₹/month)</label>
          <input type="number" placeholder="e.g. 5000" value={stipend}
            onChange={(e) => setStipend(e.target.value)} style={inputStyle} />

          {/* Toggle: Work from home */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginTop: "4px", marginBottom: "10px",
          }}>
            <span style={{ fontSize: "13px", color: "#333" }}>Work from home</span>
            <Toggle checked={wfhOnly} onChange={setWfhOnly} />
          </div>

          {/* Toggle: Part-time */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", color: "#333" }}>Part-time</span>
            <Toggle checked={partTimeOnly} onChange={setPartTimeOnly} />
          </div>
        </div>

        {/* ── Listings ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>
              {filteredData.length} Total Internship{filteredData.length !== 1 ? "s" : ""}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#888" }}>
              Showing internships based on your preferences
            </p>
          </div>

          {filteredData.length === 0 ? (
            <div style={{
              background: "#fff", border: "1px solid #e8e8e8",
              borderRadius: "8px", padding: "48px", textAlign: "center",
            }}>
              <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🔍</p>
              <h3 style={{ margin: "0 0 6px", color: "#333" }}>No internships found</h3>
              <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>Try adjusting your filters</p>
            </div>
          ) : (
            filteredData.map((item) => <InternshipCard key={item.id} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}