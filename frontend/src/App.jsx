import React, { useState, useRef } from "react";
import "./index.css";

const API_URL = "http://localhost:5000/detect";

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  function handleFiles(f) {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }

  function onFileChange(e) {
    handleFiles(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files[0]);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function uploadAndPredict() {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file); // Backend expects 'image' field

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Backend returns { prediction: "...", confidence: 0.XX, top3: [...] }
      // Each top3 item has: { class: "...", confidence: 0.XX, details: { full_name, risk_level, symptoms, ... } }
      setResult({
        label: data.prediction,
        confidence: data.confidence,
        top3: data.top3 || [],
        mainDetails: data.top3?.[0]?.details || {}
      });
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const getRiskClass = (level) => {
    if (!level) return "";
    const l = level.toLowerCase();
    if (l.includes("high")) return "risk-high-bg";
    if (l.includes("moderate")) return "risk-med-bg";
    return "risk-low-bg";
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>SkinInsight AI</h1>
        <p className="sub">
          Advanced dermatological analysis using deep learning.
          Upload a clear photo of a skin lesion for instant identification and risk assessment.
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Upload Lesion Image
          </h2>

          <div
            className={`dropzone ${preview ? "with-preview" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="preview-img" />
            ) : (
              <div className="drop-inner">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-ico">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div>
                  <strong>Drag & drop or click to browse</strong>
                  <div className="hint">Supports PNG, JPG (Max 5MB)</div>
                </div>
              </div>
            )}
            <input ref={inputRef} type="file" name="image" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
          </div>

          <div className="upload-actions">
            <button className="btn primary" onClick={uploadAndPredict} disabled={loading || !file}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  Identify Condition
                </>
              )}
            </button>
            <button className="btn ghost" onClick={clearAll} disabled={loading}>
              Reset
            </button>
          </div>

          {error && (
            <div className="error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            Analysis Report
          </h2>

          <div className="result-card">
            <div className="main-result">
              <div>
                <div className="label-main">Primary Detection</div>
                <div className="value-main">{result ? result.mainDetails.full_name || result.label : "---"}</div>
                {result && (
                  <span className={`risk-badge ${getRiskClass(result.mainDetails.risk_level)}`}>
                    Risk: {result.mainDetails.risk_level || "Unknown"}
                  </span>
                )}
              </div>
              <div className="confidence-circle">
                <CircularProgress percent={result ? Math.round(result.confidence * 100) : 0} />
              </div>
            </div>

            {result ? (
              <>
                <div className="details-grid">
                  <div className="detail-item">
                    <div className="detail-label">Key Symptoms</div>
                    <ul className="symptoms-list">
                      {result.mainDetails.symptoms?.map((s, i) => (
                        <li key={i} className="symptom-tag">{s}</li>
                      )) || "N/A"}
                    </ul>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Confidence Score</div>
                    <div className="detail-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                </div>

                <div className="recommendation-box">
                  <div className="detail-label" style={{ color: 'white', opacity: 0.9, marginBottom: '0.5rem' }}>Medical Guidance</div>
                  {result.mainDetails.recommendation || "Maintain monitoring and consult a professional if changes occur."}
                  {result.mainDetails.warning && (
                    <div style={{ marginTop: '0.5rem', color: '#fca5a5', fontWeight: 600, fontSize: '0.8rem' }}>
                      ⚠️ {result.mainDetails.warning}
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                  Disclaimer: This is an AI-assisted analysis and not a final medical diagnosis.
                  Always seek professional medical advice.
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2, marginBottom: '1rem' }}>
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <p>Upload an image to generate a detailed report.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        Powered by SkinInsight Intelligence • 2024
      </footer>
    </div>
  );
}

function CircularProgress({ percent = 0, size = 100, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle r={radius} cx={size / 2} cy={size / 2} stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="none" />
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          stroke="url(#g)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem', fontWeight: 800, color: '#fff'
      }}>
        {percent}%
      </div>
    </div>
  );
}
