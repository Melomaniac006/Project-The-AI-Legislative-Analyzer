import { useState, useRef, useEffect } from "react";

const API = "http://localhost:8000";

const C = {
  black:    "#0A0A0A",
  charcoal: "#111111",
  gunmetal: "#1A1A1A",
  iron:     "#222222",
  steel:    "#2E2E2E",
  ash:      "#555555",
  silver:   "#888888",
  pearl:    "#CCCCCC",
  white:    "#F5F5F5",
  pure:     "#FFFFFF",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Courier+Prime:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A0A0A; font-family: 'EB Garamond', Georgia, serif; color: #F5F5F5; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #2E2E2E; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fade-up { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }

  .pinstripe {
    background-image: repeating-linear-gradient(
      90deg, transparent, transparent 59px,
      rgba(255,255,255,0.018) 59px, rgba(255,255,255,0.018) 60px
    );
  }
  .ruled {
    background-image: repeating-linear-gradient(
      180deg, transparent, transparent 27px,
      rgba(255,255,255,0.03) 27px, rgba(255,255,255,0.03) 28px
    );
  }

  .serif { font-family: 'Playfair Display', Georgia, serif; }
  .mono  { font-family: 'Courier Prime', monospace; }

  .hover-lift { transition: transform 0.15s, box-shadow 0.15s; }
  .hover-lift:hover  { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(255,255,255,0.08); }
  .hover-lift:active { transform: translateY(0px); }

  button { cursor: pointer; }
  input:focus { outline: none; }

  .bracket::before, .bracket::after {
    content: '';
    position: absolute;
    width: 12px; height: 12px;
  }
  .bracket::before { top: 8px; left: 8px;
    border-top: 1.5px solid #555; border-left: 1.5px solid #555; }
  .bracket::after  { bottom: 8px; right: 8px;
    border-bottom: 1.5px solid #555; border-right: 1.5px solid #555; }
`;

/* ── Advocate Wig SVG Logo ── */
function WigIcon({ size = 34, invert = false }) {
  const fg = invert ? C.black : C.white;
  const bg = invert ? C.white : "transparent";
  return (
    <svg width={size} height={size} viewBox="0 0 40 42" fill="none">
      {/* robe collar */}
      <path d="M10 28 Q10 38 20 40 Q30 38 30 28" stroke={fg} strokeWidth="1.4" fill="none"/>
      {/* bands (two white tabs) */}
      <rect x="16" y="32" width="3.5" height="6" rx="0.5" fill={fg}/>
      <rect x="20.5" y="32" width="3.5" height="6" rx="0.5" fill={fg}/>
      {/* wig dome */}
      <path d="M8 22 Q8 6 20 4 Q32 6 32 22" stroke={fg} strokeWidth="1.6" fill="none"/>
      {/* side curls */}
      <path d="M8 18 Q3 20 5 25 Q7 28 10 26" stroke={fg} strokeWidth="1.2" fill="none"/>
      <path d="M32 18 Q37 20 35 25 Q33 28 30 26" stroke={fg} strokeWidth="1.2" fill="none"/>
      {/* wig body */}
      <rect x="8" y="22" width="24" height="10" rx="1" stroke={fg} strokeWidth="1.4" fill="none"/>
      {/* horizontal lines on wig */}
      <line x1="11" y1="25.5" x2="29" y2="25.5" stroke={fg} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.6"/>
      <line x1="11" y1="28.5" x2="29" y2="28.5" stroke={fg} strokeWidth="0.7" strokeDasharray="2.5 2.5" opacity="0.6"/>
      {/* scales of justice - small */}
      <line x1="20" y1="10" x2="20" y2="16" stroke={fg} strokeWidth="1" opacity="0.5"/>
      <line x1="15" y1="12" x2="25" y2="12" stroke={fg} strokeWidth="1" opacity="0.5"/>
      <path d="M14 12 Q12 15 14 16 Q16 15 14 12" stroke={fg} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M26 12 Q24 15 26 16 Q28 15 26 12" stroke={fg} strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
  );
}

function Spinner({ size = 16 }) {
  return (
    <span style={{
      display:"inline-block", width:size, height:size,
      border:`2px solid rgba(255,255,255,0.15)`,
      borderTop:`2px solid ${C.white}`,
      borderRadius:"50%",
      animation:"spin 0.7s linear infinite",
      verticalAlign:"middle",
    }}/>
  );
}

function Tag({ children, white }) {
  return (
    <span className="mono" style={{
      border:`1px solid ${white ? C.white : C.steel}`,
      color: white ? C.white : C.silver,
      fontSize:9, letterSpacing:2.5, padding:"3px 11px",
      textTransform:"uppercase", display:"inline-block",
    }}>{children}</span>
  );
}

function ImpactBadge({ level }) {
  const s = {
    high:   { bg: C.white,  color: C.black, label:"HIGH" },
    medium: { bg: C.steel,  color: C.white, label:"MED"  },
    low:    { bg:"transparent", color: C.silver, label:"LOW", border: C.ash },
  }[level] || { bg:"transparent", color:C.silver, label:"—", border:C.ash };
  return (
    <span className="mono" style={{
      fontSize:8, letterSpacing:2, fontWeight:700,
      padding:"2px 7px", background:s.bg, color:s.color,
      border:`1px solid ${s.border||s.bg}`, textTransform:"uppercase",
    }}>{s.label}</span>
  );
}

function StatCard({ label, value, sub, highlight, delay=0 }) {
  return (
    <div className="fade-up hover-lift" style={{
      animationDelay:`${delay}ms`, flex:1, minWidth:130,
      background: highlight ? C.white : C.gunmetal,
      border:`1px solid ${highlight ? C.white : C.steel}`,
      padding:"22px 20px", position:"relative", overflow:"hidden",
    }}>
      <span style={{
        position:"absolute", top:7, right:7, width:9, height:9,
        borderTop:`1.5px solid ${highlight ? C.ash : C.steel}`,
        borderRight:`1.5px solid ${highlight ? C.ash : C.steel}`,
      }}/>
      <div className="mono" style={{
        fontSize:8, letterSpacing:2.5, textTransform:"uppercase",
        color: highlight ? C.ash : C.silver, marginBottom:10,
      }}>{label}</div>
      <div className="serif" style={{
        fontSize:30, fontWeight:900, lineHeight:1,
        color: highlight ? C.black : C.white,
      }}>{value}</div>
      {sub && <div className="mono" style={{
        fontSize:10, color: highlight ? C.ash : C.ash, marginTop:5,
      }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      position:"absolute", top:-1, left:20,
      background:C.white, color:C.black,
      fontFamily:"'Courier Prime',monospace",
      fontSize:8, letterSpacing:3, padding:"3px 12px", textTransform:"uppercase",
    }}>{children}</div>
  );
}

export default function App() {
  const [step, setStep]         = useState("upload");
  const [uploadData, setUpload] = useState(null);
  const [stats, setStats]       = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQ]        = useState("");
  const [asking, setAsking]     = useState(false);
  const [error, setError]       = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const chatRef = useRef();

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  async function handleFile(file) {
    setError(""); setStep("compressing");
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await fetch(`${API}/upload`, { method:"POST", body:fd });
      if (!r.ok) throw new Error((await r.json()).detail);
      setUpload(await r.json());
      const r2 = await fetch(`${API}/compress`, { method:"POST" });
      if (!r2.ok) throw new Error((await r2.json()).detail);
      setStats(await r2.json()); setStep("compressed");
    } catch(e) { setError(e.message); setStep("upload"); }
  }

  async function handleAnalyze() {
    setStep("analyzing"); setError("");
    try {
      const r = await fetch(`${API}/analyze`, { method:"POST" });
      if (!r.ok) throw new Error((await r.json()).detail);
      setAnalysis(await r.json()); setStep("done");
    } catch(e) { setError(e.message); setStep("compressed"); }
  }

  async function handleAsk() {
    if (!question.trim()) return;
    const q = question.trim(); setQ(""); setAsking(true);
    setMessages(m => [...m, { role:"user", text:q }]);
    try {
      const r = await fetch(`${API}/ask`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ question:q }),
      });
      const d = await r.json();
      setMessages(m => [...m, { role:"ai", text: d.answer }]);
    } catch { setMessages(m => [...m, { role:"ai", text:"Could not retrieve an answer." }]); }
    setAsking(false);
  }

  function reset() {
    setStep("upload"); setUpload(null); setStats(null);
    setAnalysis(null); setMessages([]); setError("");
  }

  const loading = step === "compressing" || step === "analyzing";

  return (
    <>
      <style>{STYLES}</style>
      <div className="pinstripe" style={{ minHeight:"100vh", background:C.black }}>

        {/* ════ HEADER ════ */}
        <header style={{
          background:C.charcoal, borderBottom:`1px solid ${C.steel}`,
          position:"sticky", top:0, zIndex:100, height:62,
          padding:"0 40px", display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{
              width:42, height:42, background:C.white,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <WigIcon size={30} invert />
            </div>
            <div>
              <div className="serif" style={{
                fontSize:21, fontWeight:900, letterSpacing:3,
                textTransform:"uppercase", color:C.white, lineHeight:1,
              }}>
                Vakeel<span style={{ color:C.silver, fontWeight:700 }}>AI</span>
              </div>
              <div className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:3.5, textTransform:"uppercase", marginTop:2 }}>
                Citizen's Legislative Dashboard
              </div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {uploadData && (
              <div className="mono" style={{
                background:C.iron, border:`1px solid ${C.steel}`,
                color:C.pearl, padding:"6px 14px", fontSize:11, letterSpacing:1,
                display:"flex", alignItems:"center", gap:8,
              }}>
                <span style={{ color:C.ash }}>§</span> {uploadData.filename}
              </div>
            )}
            {step !== "upload" && (
              <button onClick={reset} className="hover-lift" style={{
                background:"transparent", border:`1px solid ${C.steel}`,
                color:C.silver, padding:"7px 18px",
                fontFamily:"'Courier Prime',monospace", fontSize:10, letterSpacing:2,
                textTransform:"uppercase",
              }}>↺ Reset</button>
            )}
          </div>
        </header>

        {/* ════ CONTENT ════ */}
        <main style={{ maxWidth:1120, margin:"0 auto", padding:"52px 32px" }}>

          {/* ── UPLOAD SCREEN ── */}
          {step === "upload" && (
            <div className="fade-up" style={{ maxWidth:640, margin:"24px auto 0" }}>

              {/* Hero */}
              <div style={{ display:"flex", gap:0, marginBottom:52 }}>
                <div style={{ width:3, background:C.white, marginRight:28, flexShrink:0 }}/>
                <div>
                  <div className="mono" style={{ fontSize:9, letterSpacing:4, color:C.ash, textTransform:"uppercase", marginBottom:12 }}>
                    Est. 2025 · Republic of India
                  </div>
                  <h1 className="serif" style={{
                    fontSize:"clamp(38px,6vw,66px)", fontWeight:900,
                    lineHeight:1.05, color:C.white, marginBottom:16,
                  }}>
                    Justice,<br/>
                    <em style={{ color:C.silver }}>Simplified.</em>
                  </h1>
                  <p style={{ fontSize:17, color:C.pearl, lineHeight:1.85, fontStyle:"italic" }}>
                    Upload any Indian bill, act, or policy.<br/>
                    We compress it intelligently — then break it down<br/>for every citizen.
                  </p>
                </div>
              </div>

              {/* Drop zone */}
              <div
                className="bracket ruled"
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f) handleFile(f); }}
                onClick={() => fileRef.current.click()}
                style={{
                  border:`2px dashed ${dragging ? C.white : C.steel}`,
                  background: dragging ? "rgba(255,255,255,0.03)" : C.gunmetal,
                  padding:"58px 32px", textAlign:"center",
                  cursor:"pointer", transition:"all 0.2s",
                  position:"relative",
                }}
              >
                <div style={{ fontSize:40, marginBottom:14 }}>⚖</div>
                <div className="serif" style={{ fontSize:22, fontWeight:700, color:C.white, marginBottom:8 }}>
                  Place your document here
                </div>
                <div className="mono" style={{ fontSize:10, color:C.ash, letterSpacing:2.5 }}>
                  PDF · TXT · ANY SIZE
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.txt" style={{ display:"none" }}
                  onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
              </div>

              {error && (
                <div className="mono" style={{
                  marginTop:16, color:"#FF4444",
                  border:`1px solid rgba(255,68,68,0.35)`,
                  background:"rgba(255,68,68,0.05)",
                  padding:"12px 18px", fontSize:12, letterSpacing:1,
                }}>⚠ {error}</div>
              )}

              {/* Capabilities bar */}
              <div style={{ display:"flex", border:`1px solid ${C.steel}`, marginTop:36 }}>
                {[
                  ["§", "Token Compression", "ScaleDown API"],
                  ["⚖", "LLM Analysis",      "Groq · Llama-3.3"],
                  ["♻", "Carbon Savings",     "Energy Metrics"],
                ].map(([icon, title, sub], i) => (
                  <div key={i} style={{
                    flex:1, padding:"18px 16px", textAlign:"center",
                    borderRight: i<2 ? `1px solid ${C.steel}` : "none",
                  }}>
                    <div style={{ fontSize:20, marginBottom:6, color:C.white }}>{icon}</div>
                    <div className="serif" style={{ fontSize:14, color:C.white, fontWeight:700, marginBottom:3 }}>{title}</div>
                    <div className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:1.5 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LOADING ── */}
          {loading && (
            <div style={{ textAlign:"center", marginTop:120 }}>
              <Spinner size={32}/>
              <div className="serif" style={{ marginTop:28, fontSize:26, color:C.white, fontStyle:"italic" }}>
                {step==="compressing" ? "Compressing document…" : "Consulting the statutes…"}
              </div>
              <div className="mono" style={{ color:C.ash, fontSize:9, letterSpacing:3, marginTop:10, textTransform:"uppercase" }}>
                {step==="compressing"
                  ? "Extracting · Compressing · Calculating savings"
                  : "Reading clauses · Building summary · Assessing impact"}
              </div>
            </div>
          )}

          {/* ── RESULTS ── */}
          {(step==="compressed"||step==="analyzing"||step==="done") && stats && (
            <div>

              {/* Stats */}
              <div className="fade-up" style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                <StatCard label="Original Tokens"   value={stats.original_tokens.toLocaleString()}   sub="before compression"   delay={0}   />
                <StatCard label="Compressed Tokens" value={stats.compressed_tokens.toLocaleString()} sub="sent to LLM"          delay={80}  />
                <StatCard label="Token Savings"     value={`${stats.savings_pct}%`}                  sub="compression ratio"    delay={160} highlight={stats.savings_pct > 0} />
                <StatCard label="CO₂ Saved"         value={`${stats.co2_saved_g}g`}                  sub={`${stats.energy_saved_kwh} kWh`} delay={240} />
              </div>

              {/* Progress bar */}
              <div className="fade-up" style={{
                background:C.gunmetal, border:`1px solid ${C.steel}`,
                padding:"16px 22px", marginBottom:28, animationDelay:"300ms",
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span className="mono" style={{ fontSize:9, color:C.ash, letterSpacing:2.5, textTransform:"uppercase" }}>Token Density</span>
                  <span className="mono" style={{ fontSize:9, color:C.silver, letterSpacing:1 }}>{stats.savings_pct}% reduced</span>
                </div>
                <div style={{ background:C.iron, height:3 }}>
                  <div style={{
                    width:`${Math.max(2, 100-stats.savings_pct)}%`,
                    height:"100%", background:C.white,
                    transition:"width 1.2s cubic-bezier(.22,1,.36,1)",
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:7 }}>
                  <span className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:2 }}>COMPRESSED</span>
                  <span className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:2 }}>ORIGINAL</span>
                </div>
              </div>

              {/* Analyse CTA */}
              {step==="compressed" && (
                <div className="fade-up" style={{ textAlign:"center", animationDelay:"360ms" }}>
                  <button onClick={handleAnalyze} className="hover-lift" style={{
                    background:C.white, border:"none", color:C.black,
                    fontFamily:"'Playfair Display',serif",
                    fontSize:18, fontWeight:900, letterSpacing:4,
                    textTransform:"uppercase", padding:"18px 60px",
                  }}>
                    ⚖ Analyse Document
                  </button>
                  <div className="mono" style={{ color:C.ash, fontSize:9, letterSpacing:2, marginTop:12, textTransform:"uppercase" }}>
                    Uses compressed tokens only · Maximum efficiency
                  </div>
                </div>
              )}

              {/* ── ANALYSIS ── */}
              {step==="done" && analysis && (
                <div className="fade-up">

                  {/* Summary */}
                  <div style={{
                    background:C.gunmetal, border:`1px solid ${C.steel}`,
                    padding:"30px 28px 26px", marginBottom:16, position:"relative",
                  }}>
                    <SectionLabel>Plain English Summary</SectionLabel>
                    <p style={{ fontSize:18, lineHeight:1.9, color:C.white, marginTop:8, fontStyle:"italic" }}>
                      {analysis.summary}
                    </p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:18 }}>
                      {(analysis.sectors_affected||[]).map(s => <Tag key={s}>{s}</Tag>)}
                      {analysis.implementation_timeline && <Tag white>⏱ {analysis.implementation_timeline}</Tag>}
                    </div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

                    {/* Key Clauses */}
                    <div style={{ background:C.gunmetal, border:`1px solid ${C.steel}`, padding:"28px 22px 22px", position:"relative" }}>
                      <SectionLabel>Key Clauses</SectionLabel>
                      <div style={{ display:"flex", flexDirection:"column", gap:18, marginTop:10 }}>
                        {(analysis.key_clauses||[]).map((c,i) => (
                          <div key={i} style={{ borderLeft:`2px solid ${C.white}`, paddingLeft:16 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                              <span className="serif" style={{ fontWeight:700, fontSize:15, color:C.white }}>{c.title}</span>
                              <ImpactBadge level={c.impact}/>
                            </div>
                            <p style={{ color:C.pearl, fontSize:14, lineHeight:1.75 }}>{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Citizen Impact */}
                    <div style={{ background:C.gunmetal, border:`1px solid ${C.steel}`, padding:"28px 22px 22px", position:"relative" }}>
                      <SectionLabel>Citizen Impact</SectionLabel>
                      <div style={{ display:"flex", flexDirection:"column", gap:16, marginTop:10 }}>
                        {[
                          { key:"positive", icon:"▲", color:C.white },
                          { key:"negative", icon:"▼", color:C.silver },
                          { key:"neutral",  icon:"■", color:C.ash },
                        ].map(({key,icon,color}) =>
                          (analysis.citizen_impact?.[key]?.length > 0) && (
                            <div key={key}>
                              <div className="mono" style={{ fontSize:8, letterSpacing:3, color, textTransform:"uppercase", marginBottom:7 }}>
                                {icon} {key}
                              </div>
                              {analysis.citizen_impact[key].map((item,i) => (
                                <div key={i} style={{
                                  fontSize:13, color:C.pearl, lineHeight:1.75,
                                  paddingBottom:5, borderBottom:`1px solid ${C.iron}`, marginBottom:5,
                                }}>— {item}</div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Q&A */}
                  <div style={{ background:C.gunmetal, border:`1px solid ${C.steel}`, padding:"28px 24px 22px", position:"relative" }}>
                    <SectionLabel>Counsel the Document</SectionLabel>

                    {messages.length > 0 && (
                      <div ref={chatRef} style={{
                        maxHeight:300, overflowY:"auto",
                        display:"flex", flexDirection:"column", gap:10,
                        marginTop:14, marginBottom:16, paddingRight:4,
                      }}>
                        {messages.map((m,i) => (
                          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                            <div style={{
                              maxWidth:"78%",
                              background: m.role==="user" ? C.white : C.iron,
                              border:`1px solid ${m.role==="user"?C.white:C.steel}`,
                              color: m.role==="user" ? C.black : C.white,
                              padding:"10px 18px", fontSize:14, lineHeight:1.75,
                              fontStyle: m.role==="ai" ? "italic" : "normal",
                            }}>{m.text}</div>
                          </div>
                        ))}
                        {asking && (
                          <div style={{ display:"flex", alignItems:"center", gap:10, paddingLeft:2 }}>
                            <Spinner size={13}/>
                            <span className="mono" style={{ color:C.ash, fontSize:9, letterSpacing:3 }}>CONSULTING…</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display:"flex", border:`1px solid ${C.steel}`, marginTop:messages.length?0:14 }}>
                      <input
                        value={question}
                        onChange={e => setQ(e.target.value)}
                        onKeyDown={e => e.key==="Enter" && !asking && handleAsk()}
                        placeholder="e.g. How does this affect farmers?  What are my rights under Article 21?"
                        style={{
                          flex:1, background:C.iron, border:"none",
                          color:C.white, padding:"13px 18px",
                          fontSize:15, fontFamily:"'EB Garamond',serif", fontStyle:"italic",
                        }}
                      />
                      <button onClick={handleAsk} disabled={asking||!question.trim()} style={{
                        background: (asking||!question.trim()) ? C.steel : C.white,
                        border:"none",
                        color: (asking||!question.trim()) ? C.ash : C.black,
                        padding:"0 26px",
                        fontFamily:"'Courier Prime',monospace", fontSize:10, letterSpacing:2,
                        textTransform:"uppercase", transition:"background 0.2s",
                      }}>
                        {asking ? <Spinner size={12}/> : "Ask →"}
                      </button>
                    </div>

                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:12 }}>
                      {["Who does this affect?","What are the penalties?","When does this take effect?","What are my rights?"].map(q => (
                        <button key={q} onClick={() => setQ(q)} style={{
                          background:"transparent", border:`1px solid ${C.steel}`,
                          color:C.silver, padding:"4px 14px",
                          fontFamily:"'Courier Prime',monospace", fontSize:9, letterSpacing:1.5,
                          transition:"border-color 0.2s, color 0.2s",
                        }}
                        onMouseEnter={e=>{e.target.style.borderColor=C.white;e.target.style.color=C.white;}}
                        onMouseLeave={e=>{e.target.style.borderColor=C.steel;e.target.style.color=C.silver;}}
                        >{q}</button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </main>

        {/* ════ FOOTER ════ */}
        <footer style={{
          borderTop:`1px solid ${C.steel}`, marginTop:80,
          padding:"20px 40px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:3, textTransform:"uppercase" }}>
            Vakeel AI · Powered by ScaleDown + Groq
          </div>
          <div className="serif" style={{ fontSize:13, color:C.ash, fontStyle:"italic" }}>
            Satyameva Jayate
          </div>
          <div className="mono" style={{ fontSize:8, color:C.ash, letterSpacing:2, textTransform:"uppercase" }}>
            Making Indian law accessible to every citizen
          </div>
        </footer>

      </div>
    </>
  );
}
