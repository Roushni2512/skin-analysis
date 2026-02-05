import React, { useState, useRef } from "react";
import "./index.css";

const API_URL = 
  // If you open the site in your browser and backend is mapped to host 5001 use localhost:
  // "http://localhost:5001/predict";
  // If frontend runs INSIDE docker and uses docker-compose network, use the service name and port:
  // "http://backend:5000/predict";
  "http://localhost:5001/predict";

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
      fd.append("file", file);

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Backend expected to return { prediction: "Eczema", confidence: 0.92 }
      setResult({
        label: data.prediction ?? data.label ?? "Unknown",
        confidence:
          typeof data.confidence === "number" ? data.confidence : data.confidence ? Number(data.confidence) : 0,
        extras: data.extras || [],
      });
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Check backend or network.");
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

  return (
    <div className="page">
      <header className="hero">
        <h1>AI Skin Detector</h1>
        <p className="sub">
          Upload a skin image and our AI will analyze it and show diagnosis with a confidence score.
        </p>
      </header>

      <main className="container">
        <section className="panel upload-panel">
          <h2>Upload Image for Detection</h2>

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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="upload-ico">
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="11" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                </svg>
                <div>
                  <strong>Click or drag an image here</strong>
                  <div className="hint">PNG/JPG — clear skin closeup works best</div>
                </div>
              </div>
            )}
            <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
          </div>

          <div className="upload-actions">
            <button className="btn primary" onClick={uploadAndPredict} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
            <button className="btn ghost" onClick={clearAll} disabled={loading}>
              Clear
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </section>

        <section className="panel result-panel">
          <h2>Detection Results</h2>

          <div className="result-content">
            <div className="result-left">
              {preview ? (
                <div className="result-image-wrap">
                  <img src={preview} alt="uploaded" className="result-image" />
                </div>
              ) : (
                <div className="placeholder">No image uploaded</div>
              )}
            </div>

            <div className="result-right">
              <div className="card">
                <div className="card-row">
                  <div>
                    <div className="label">Primary Detection</div>
                    <div className="value">{result ? result.label : "—"}</div>
                  </div>

                  <div className="confidence-wrap">
                    <CircularProgress percent={result ? Math.round(result.confidence * 100) : 0} />
                    <div className="confidence-text">{result ? `${Math.round(result.confidence * 100)}%` : "N/A"}</div>
                  </div>
                </div>

                <div className="card-row small">
                  <div>
                    <div className="label">Additional Objects</div>
                    <div className="value">{result && result.extras?.length ? result.extras.join(", ") : "None"}</div>
                  </div>

                  <div>
                    <div className="label">Timestamp</div>
                    <div className="value">{result ? new Date().toLocaleString() : "—"}</div>
                  </div>
                </div>

                <div className="explain">
                  <strong>Tip:</strong> If results look wrong, try a closer crop of the lesion with good lighting.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">Built with ❤️ — AI Skin Detector</footer>
    </div>
  );
}

/* ---------- small helper: circular progress ---------- */
function CircularProgress({ percent = 0, size = 86, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="progress-ring" viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} cx="0" cy="0" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
        <circle
          r={radius}
          cx="0"
          cy="0"
          stroke="url(#g)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}
