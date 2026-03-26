import React, { useState, useEffect, useRef } from "react";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&family=Instrument+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #060810; --surface: #0d1117; --border: rgba(255,255,255,0.07);
      --accent: #63cab7; --accent2: #f0a500; --danger: #ff5a5a; --success: #4ade80;
      --text: #e8edf5; --muted: #6b7a96;
      --font-display: 'Syne', sans-serif; --font-body: 'Instrument Sans', sans-serif; --font-mono: 'DM Mono', monospace;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }
    @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  `}</style>
);

const BackgroundCanvas = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(99,202,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,202,183,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
    <div style={{ position: "absolute", width: "100%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(99,202,183,0.3), transparent)", animation: "scan 6s linear infinite", opacity: 0.4 }} />
  </div>
);

const Card = ({ children, style = {}, glow = false }) => (
  <div style={{ background: "rgba(13,17,23,0.8)", backdropFilter: "blur(20px)", border: `1px solid ${glow ? "rgba(99,202,183,0.3)" : "var(--border)"}`, borderRadius: 20, padding: "28px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", position: "relative", ...style }}>
    {children}
  </div>
);

const StyledTextarea = ({ label, placeholder, value, onChange, rows = 4, mono = false }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", marginBottom: 8, fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--muted)", textTransform: "uppercase" }}>{label}</label>
    <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px", color: "var(--text)", fontSize: 14, fontFamily: mono ? "var(--font-mono)" : "var(--font-body)", outline: "none" }} />
  </div>
);

const Btn = ({ children, onClick, disabled, variant = "primary" }) => {
  const [hover, setHover] = useState(false);
  const isSec = variant === "secondary";
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ flex: 1, padding: "13px 28px", borderRadius: 12, border: isSec ? "1px solid rgba(240,165,0,0.4)" : "1px solid var(--accent)", background: hover ? (isSec ? "rgba(240,165,0,0.1)" : "var(--accent)") : "transparent", color: hover && !isSec ? "#060810" : (isSec ? "var(--accent2)" : "var(--accent)"), cursor: "pointer", fontWeight: 600, transition: "0.2s" }}>
      {children}
    </button>
  );
};

const ScoreRing = ({ score }) => {
  const r = 54, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "var(--success)" : score >= 50 ? "var(--accent2)" : "var(--danger)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 30, color }}>{score}</div>
      </div>
    </div>
  );
};

export default function App() {
  const [text, setText] = useState("");
  const [jd, setJd] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAIAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription: "" }),
      });
      const data = await response.json();
      setAiResult(data.ai);
    } catch { alert("Backend error."); }
    setLoading(false);
  };

  const handleATSScore = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://resume-intelligence-engine-1.onrender.com/api/resume/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text, jobDescription: jd }),
      });
      const data = await response.json();
      setAtsResult(data.ats);
    } catch { alert("Error."); }
    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundCanvas />
      <div style={{ position: "relative", zIndex: 1, padding: "40px 20px" }}>
        <header style={{ textAlign: "center", marginBottom: 50 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", fontWeight: 800 }}>Resume <span style={{ color: "var(--accent)" }}>Intelligence</span></h1>
        </header>

        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Card glow style={{ marginBottom: 25 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 25 }}>
              <StyledTextarea label="Job Description" value={jd} onChange={e => setJd(e.target.value)} rows={6} />
              <StyledTextarea label="Resume Text" value={text} onChange={e => setText(e.target.value)} rows={6} mono />
            </div>
            <div style={{ display: "flex", gap: 15 }}>
              <Btn onClick={handleAIAnalysis} disabled={loading}>{loading ? "Analyzing..." : "AI Evaluation"}</Btn>
              <Btn onClick={handleATSScore} variant="secondary" disabled={loading}>{loading ? "ATS Score" : "ATS Score"}</Btn>
            </div>
          </Card>

          {(aiResult || atsResult) && (
            <div style={{ display: "grid", gridTemplateColumns: aiResult && atsResult ? "1.2fr 0.8fr" : "1fr", gap: 20 }}>
              {aiResult && (
                <Card>
                  <h3 style={{ marginBottom: 15, fontFamily: "var(--font-display)" }}>AI Analysis</h3>
                  <div style={{ background: "rgba(99,202,183,0.1)", padding: 12, borderRadius: 10, color: "var(--accent)", fontWeight: 700, marginBottom: 20 }}>{aiResult.title}</div>

                  {/* SECTION 1: STRENGTHS */}
                  <p style={{ fontSize: 11, color: "var(--success)", textTransform: "uppercase", marginBottom: 8 }}>✓ Strengths</p>
                  <ul style={{ listStyle: "none", marginBottom: 20 }}>
                    {aiResult.strengths?.map((s, i) => <li key={i} style={{ padding: 8, background: "rgba(74,222,128,0.05)", marginBottom: 5, borderRadius: 6, fontSize: 13 }}>{s}</li>)}
                  </ul>

                  {/* SECTION 2: IMPROVEMENTS */}
                  <p style={{ fontSize: 11, color: "var(--danger)", textTransform: "uppercase", marginBottom: 8 }}>⚠ Improvements</p>
                  <ul style={{ listStyle: "none", marginBottom: 20 }}>
                    {aiResult.improvements?.map((imp, i) => <li key={i} style={{ padding: 8, background: "rgba(255,90,90,0.05)", marginBottom: 5, borderRadius: 6, fontSize: 13 }}>{imp}</li>)}
                  </ul>

                  {/* SECTION 3: STRATEGIC ADVICE */}
                  <p style={{ fontSize: 11, color: "var(--accent2)", textTransform: "uppercase", marginBottom: 8 }}>Strategic Advice</p>
                  <div style={{ padding: 15, background: "rgba(240,165,0,0.1)", borderRadius: 10, fontSize: 13, lineHeight: 1.6 }}>{aiResult.advice}</div>
                </Card>
              )}
              {atsResult && (
                <Card>
                   <ScoreRing score={atsResult.score} />
                   <div style={{ marginTop: 20 }}>
                     <p style={{ fontSize: 11, color: "var(--success)", textTransform: "uppercase" }}>Matched</p>
                     <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 5 }}>{atsResult.matchedKeywords?.map(k => <span key={k} style={{ fontSize: 11, padding: "4px 8px", background: "rgba(74,222,128,0.1)", borderRadius: 4 }}>{k}</span>)}</div>
                   </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}