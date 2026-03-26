import React, { useState, useEffect, useRef } from "react";

// Inject Google Fonts + global styles
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Instrument+Sans:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #060810;
      --surface: #0d1117;
      --surface2: #111827;
      --border: rgba(255,255,255,0.07);
      --border-glow: rgba(99,202,183,0.3);
      --accent: #63cab7;
      --accent2: #f0a500;
      --accent3: #e05cff;
      --text: #e8edf5;
      --muted: #6b7a96;
      --danger: #ff5a5a;
      --success: #4ade80;
      --font-display: 'Syne', sans-serif;
      --font-body: 'Instrument Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    textarea, input {
      font-family: var(--font-body);
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(3deg); }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes counter {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes gradient-move {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes noise {
      0%, 100% { background-position: 0 0; }
      10% { background-position: -5% -10%; }
      20% { background-position: -15% 5%; }
      30% { background-position: 7% -25%; }
      40% { background-position: 20% 25%; }
      50% { background-position: -25% 10%; }
      60% { background-position: 15% 5%; }
      70% { background-position: 0% 15%; }
      80% { background-position: 25% 35%; }
      90% { background-position: -10% 10%; }
    }

    @media (max-width: 1100px) {
      .floating-templates { display: none !important; }
    }
  `}</style>
);

// Animated background blobs
const BackgroundCanvas = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(rgba(99,202,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,202,183,0.04) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    }} />
    <div style={{
      position: "absolute", width: 600, height: 600,
      borderRadius: "50%", top: "-200px", left: "-100px",
      background: "radial-gradient(circle, rgba(99,202,183,0.12) 0%, transparent 70%)",
      animation: "float 8s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", width: 500, height: 500,
      borderRadius: "50%", top: "30%", right: "-150px",
      background: "radial-gradient(circle, rgba(224,92,255,0.10) 0%, transparent 70%)",
      animation: "float 10s ease-in-out infinite reverse",
    }} />
    <div style={{
      position: "absolute", width: 400, height: 400,
      borderRadius: "50%", bottom: "-100px", left: "30%",
      background: "radial-gradient(circle, rgba(240,165,0,0.08) 0%, transparent 70%)",
      animation: "float 12s ease-in-out infinite",
    }} />
    <div style={{
      position: "absolute", width: "100%", height: "2px",
      background: "linear-gradient(90deg, transparent, rgba(99,202,183,0.3), transparent)",
      animation: "scan 6s linear infinite",
      opacity: 0.4,
    }} />
  </div>
);

// Floating Template Component
const FloatingTemplate = ({ style, delay }) => (
  <div style={{
    width: "140px",
    height: "190px",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "12px",
    padding: "15px",
    animation: `float 6s ease-in-out infinite`,
    animationDelay: delay,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    ...style
  }}>
    <div style={{ width: "40%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }} />
    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
    <div style={{ width: "90%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", marginTop: "10px" }} />
    <div style={{ width: "80%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
  </div>
);

// Pill badge
const Badge = ({ children, color = "var(--accent)" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "4px 12px", borderRadius: 999,
    border: `1px solid ${color}44`,
    background: `${color}11`,
    color, fontSize: 11, fontFamily: "var(--font-mono)",
    fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase",
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
    {children}
  </span>
);

// Glassy card
const Card = ({ children, style = {}, glow = false }) => (
  <div style={{
    background: "rgba(13,17,23,0.8)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${glow ? "var(--border-glow)" : "var(--border)"}`,
    borderRadius: 20,
    padding: "28px 32px",
    boxShadow: glow
      ? "0 0 40px rgba(99,202,183,0.08), 0 20px 60px rgba(0,0,0,0.4)"
      : "0 20px 60px rgba(0,0,0,0.4)",
    position: "relative",
    overflow: "hidden",
    ...style,
  }}>
    {glow && (
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
        opacity: 0.6,
      }} />
    )}
    {children}
  </div>
);

// Custom textarea
const StyledTextarea = ({ label, placeholder, value, onChange, rows = 4, mono = false }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          display: "block", marginBottom: 8,
          fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
          fontFamily: "var(--font-mono)", color: "var(--muted)",
        }}>{label}</label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", resize: "vertical",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 12, padding: "14px 16px",
          color: "var(--text)", fontSize: 14,
          fontFamily: mono ? "var(--font-mono)" : "var(--font-body)",
          lineHeight: 1.6, outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(99,202,183,0.1)" : "none",
        }}
      />
    </div>
  );
};

// Button
const Btn = ({ children, onClick, disabled, variant = "primary", icon }) => {
  const [hover, setHover] = useState(false);
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px 28px", borderRadius: 12, border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
    letterSpacing: "0.02em", transition: "all 0.2s", outline: "none",
    opacity: disabled ? 0.5 : 1,
    flex: 1,
  };
  const variants = {
    primary: {
      background: hover && !disabled ? "var(--accent)" : "transparent",
      color: hover && !disabled ? "#060810" : "var(--accent)",
      border: "1px solid var(--accent)",
      boxShadow: hover && !disabled ? "0 0 30px rgba(99,202,183,0.35)" : "none",
    },
    secondary: {
      background: hover && !disabled ? "rgba(240,165,0,0.15)" : "transparent",
      color: "var(--accent2)",
      border: "1px solid rgba(240,165,0,0.4)",
      boxShadow: hover && !disabled ? "0 0 20px rgba(240,165,0,0.2)" : "none",
    },
  };
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant] }}
    >
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      {children}
    </button>
  );
};

// Score ring
const ScoreRing = ({ score }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "var(--success)" : score >= 50 ? "var(--accent2)" : "var(--danger)";
  const label = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate" : "Needs Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 30, fontWeight: 800, fontFamily: "var(--font-display)", color, animation: "counter 0.8s ease" }}>
            {score}
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>/ 100</span>
        </div>
      </div>
      <Badge color={color}>{label}</Badge>
    </div>
  );
};

// Keyword chip
const KeywordChip = ({ word, type }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "4px 10px", borderRadius: 6, margin: "3px",
    fontSize: 12, fontFamily: "var(--font-mono)",
    background: type === "match" ? "rgba(74,222,128,0.1)" : "rgba(255,90,90,0.1)",
    color: type === "match" ? "var(--success)" : "var(--danger)",
    border: `1px solid ${type === "match" ? "rgba(74,222,128,0.25)" : "rgba(255,90,90,0.25)"}`,
  }}>
    {type === "match" ? "✓" : "✗"} {word}
  </span>
);

// Section heading
const SectionHead = ({ label, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    <h3 style={{
      fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
      color: "var(--text)", letterSpacing: "-0.01em",
    }}>{label}</h3>
    <div style={{ flex: 1, height: 1, background: "var(--border)", marginLeft: 8 }} />
  </div>
);

// Main App
export default function App() {
  const [text, setText] = useState("");
  const [jd, setJd] = useState("");
  const [file, setFile] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState("");
  const [activeTab, setActiveTab] = useState("paste");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleAIAnalysis = async () => {
    if (activeTab === "paste" && !text) return alert("Please paste your resume text first.");
    if (activeTab === "upload" && !file) return alert("Please upload a resume file.");

    setLoading(true); setLoadingType("ai");
    try {
      if (activeTab === "upload") {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jd || "");
        const res = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/upload", { method: "POST", body: formData });
        const data = await res.json();
        setAiResult(data.ai);
        if (data.ats) setAtsResult(data.ats);
      } else {
        const response = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: text, jobDescription: "" }),
        });
        const data = await response.json();
        setAiResult(data.ai);
      }
    } catch { alert("AI Analysis failed. Is the backend running?"); }
    setLoading(false); setLoadingType("");
  };

  const handleATSScore = async () => {
    if (!jd) return alert("Job Description is required for ATS scoring.");

    setLoading(true); setLoadingType("ats");
    try {
      if (activeTab === "upload") {
        if (!file) throw new Error("Please upload a resume file.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jd);
        const res = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/upload", { method: "POST", body: formData });
        const data = await res.json();
        setAtsResult(data.ats);
        if (data.ai) setAiResult(data.ai);
      } else {
        if (!text) throw new Error("Please paste your resume text first.");
        const response = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: text, jobDescription: jd }),
        });
        const data = await response.json();
        setAtsResult(data.ats);
      }
    } catch (err) { alert(err.message || "ATS Scoring failed."); }
    setLoading(false); setLoadingType("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundCanvas />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", padding: "40px 20px 80px" }}>

        {/* Hero Header */}
        <header style={{ textAlign: "center", marginBottom: 60, position: "relative", animation: "fadeUp 0.8s ease forwards" }}>

          {/* Left Floating Templates */}
          <div className="floating-templates" style={{ position: "absolute", left: "0", top: "40px", pointerEvents: "none" }}>
             <FloatingTemplate delay="0s" style={{ transform: "rotate(-12deg) translateX(-40px)" }} />
             <FloatingTemplate delay="2s" style={{ transform: "rotate(-5deg) translateY(60px) translateX(-20px)", opacity: 0.6 }} />
          </div>

          {/* Right Floating Templates */}
          <div className="floating-templates" style={{ position: "absolute", right: "0", top: "40px", pointerEvents: "none" }}>
             <FloatingTemplate delay="1s" style={{ transform: "rotate(12deg) translateX(40px)" }} />
             <FloatingTemplate delay="3.5s" style={{ transform: "rotate(8deg) translateY(60px) translateX(20px)", opacity: 0.6 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <Badge color="var(--accent)">Strategic Career Advice · ATS Optimization · Instant Resume Diagnostics</Badge>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            letterSpacing: "-0.03em", lineHeight: 1.05,
            marginBottom: 16,
            position: "relative", zIndex: 2
          }}>
            <span style={{
              background: "linear-gradient(135deg, #e8edf5 0%, var(--accent) 40%, #e05cff 80%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>
              Resume Intelligence
            </span>
            <br />
            <span style={{ color: "var(--text)", fontSize: "75%" }}>Engine</span>
          </h1>

          <p style={{
            color: "var(--muted)", fontSize: 16, maxWidth: 520, margin: "0 auto",
            fontFamily: "var(--font-body)", lineHeight: 1.7,
            position: "relative", zIndex: 2
          }}>
            Beat the ATS. Land more interviews. Get AI feedback on your resume in seconds —{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>built for students who mean business.</span>
          </p>

          <div style={{
            display: "flex", justifyContent: "center", gap: 40, marginTop: 36,
            flexWrap: "wrap",
            position: "relative", zIndex: 2
          }}>
            {[["98%", "Accuracy"], ["< 3s", "Analysis"], ["ATS+AI", "Dual Engine"]].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800,
                  color: "var(--accent)", letterSpacing: "-0.02em",
                }}>{val}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </header>

        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card glow style={{ marginBottom: 28, animation: "fadeUp 0.8s 0.15s ease both" }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: 120, height: 120,
              background: "radial-gradient(circle at top right, rgba(99,202,183,0.08), transparent 70%)",
              borderRadius: "0 20px 0 0",
            }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <SectionHead label="Job Description"  />
                <StyledTextarea
                  placeholder="Paste the job requirements here..."
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  rows={7}
                />
              </div>

              <div>
                <SectionHead label="Your Resume"  />
                <div style={{
                  display: "flex", background: "rgba(255,255,255,0.04)",
                  borderRadius: 10, padding: 4, marginBottom: 16, width: "fit-content",
                }}>
                  {["paste", "upload"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                      padding: "6px 18px", borderRadius: 8, border: "none",
                      cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 500,
                      transition: "all 0.2s",
                      background: activeTab === tab ? "var(--accent)" : "transparent",
                      color: activeTab === tab ? "#060810" : "var(--muted)",
                    }}>
                      {tab === "paste" ? "✏ Paste Text" : "Upload File"}
                    </button>
                  ))}
                </div>

                {activeTab === "paste" ? (
                  <StyledTextarea
                    placeholder="Paste your resume text here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={5}
                    mono
                  />
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 12, padding: "32px 20px",
                      textAlign: "center", cursor: "pointer",
                      background: dragOver ? "rgba(99,202,183,0.05)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s",
                      minHeight: 130,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                    <span style={{ fontSize: 32 }}>{file ? "✅" : "☁️"}</span>
                    <p style={{ color: file ? "var(--success)" : "var(--muted)", fontSize: 14, fontFamily: "var(--font-mono)" }}>
                      {file ? file.name : "Drop your resume or click to browse"}
                    </p>
                    {!file && <p style={{ color: "var(--muted)", fontSize: 11 }}>PDF, DOCX, TXT supported</p>}
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: "flex", gap: 14, marginTop: 24,
              paddingTop: 24, borderTop: "1px solid var(--border)",
            }}>
              <Btn onClick={handleAIAnalysis} disabled={loading} variant="primary" >
                {loading && loadingType === "ai" ? "Analyzing..." : " Resume Analysis"}
              </Btn>
              <Btn onClick={handleATSScore} disabled={loading} variant="secondary" >
                {loading && loadingType === "ats" ? "Scoring..." : "Calculate ATS Match"}
              </Btn>
            </div>

            {loading && (
              <div style={{ textAlign: "center", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", background: "var(--accent)",
                  animation: "pulse-ring 1.2s ease-out infinite",
                }} />
                <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
                  {loadingType === "ai" ? "Running AI diagnostics..." : "Scanning keyword patterns..."}
                </span>
              </div>
            )}
          </Card>

         {(aiResult || atsResult) && (
                     <div style={{
                       display: "grid",
                       gridTemplateColumns: aiResult && atsResult ? "1fr 1fr" : "1fr",
                       gap: 24, animation: "fadeUp 0.6s ease forwards",
                     }}>
                       {aiResult && (
                         <Card>
                           <SectionHead label="AI Resume Evaluation" />

                           {/* Title / Profile Summary */}
                           <div style={{
                             background: "rgba(99,202,183,0.08)", border: "1px solid rgba(99,202,183,0.2)",
                             borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                           }}>
                             <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>
                               {aiResult.title || "Resume Profile Identified"}
                             </span>
                           </div>

                           {/* Strengths List */}
                           <div style={{ marginBottom: 18 }}>
                             <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", marginBottom: 10 }}>✓ Key Strengths</p>
                             <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                               {aiResult.strengths && aiResult.strengths.length > 0 ? aiResult.strengths.map((s, i) => (
                                 <li key={i} style={{ padding: "8px 12px", marginBottom: 6, borderRadius: 8, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.12)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                                   {s}
                                 </li>
                               )) : <li style={{color: 'var(--muted)', fontSize: 12}}>No strengths identified.</li>}
                             </ul>
                           </div>

                           {/* Improvements List - ADDED THIS SECTION */}
                           <div style={{ marginBottom: 18 }}>
                             <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--danger)", marginBottom: 10 }}>⚠ Critical Improvements</p>
                             <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                               {aiResult.improvements && aiResult.improvements.length > 0 ? aiResult.improvements.map((imp, i) => (
                                 <li key={i} style={{ padding: "8px 12px", marginBottom: 6, borderRadius: 8, background: "rgba(255,90,90,0.06)", border: "1px solid rgba(255,90,90,0.12)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
                                   {imp}
                                 </li>
                               )) : <li style={{color: 'var(--muted)', fontSize: 12}}>No major improvements needed.</li>}
                             </ul>
                           </div>

                           {/* Career Advice */}
                           <div>
                             <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent2)", marginBottom: 10 }}>Strategic Career Advice</p>
                             <div style={{ background: "rgba(240,165,0,0.06)", border: "1px solid rgba(240,165,0,0.15)", borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#c9a85c", lineHeight: 1.7, borderLeft: "3px solid var(--accent2)" }}>
                               {aiResult.advice || "No specific advice generated."}
                             </div>
                           </div>
                         </Card>
                       )}

                       {atsResult && (
                         <Card>
                           <SectionHead label="ATS Diagnostics" />
                           <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                             <ScoreRing score={atsResult.score} />
                           </div>
                           <div style={{ marginBottom: 18 }}>
                             <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", marginBottom: 10 }}>Matched Keywords</p>
                             <div style={{ display: "flex", flexWrap: "wrap" }}>
                               {atsResult.matchedKeywords?.map((k, i) => <KeywordChip key={i} word={k} type="match" />)}
                             </div>
                           </div>
                           <div>
                             <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--danger)", marginBottom: 10 }}> Missing Keywords</p>
                             <div style={{ display: "flex", flexWrap: "wrap" }}>
                               {atsResult.missingKeywords?.map((k, i) => <KeywordChip key={i} word={k} type="miss" />)}
                             </div>
                           </div>
                         </Card>
                       )}
                     </div>
                   )}
        <footer style={{ textAlign: "center", marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
          <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
            Resume Intelligence Engine · Built for ambitious students · <span style={{ color: "var(--accent)" }}>Build by ANKITA JOSHI</span>
          </p>
        </footer>
      </div>
    </>
  );
}