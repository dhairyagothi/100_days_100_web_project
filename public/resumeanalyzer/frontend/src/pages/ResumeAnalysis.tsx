import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ResumeAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const performAnalysis = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const isLocalhost =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const apiUrl = isLocalhost
        ? "http://localhost:8000/analyze"
        : "https://resume-analyzer-6ihs.onrender.com/analyze";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error("Failed to analyze resume. Make sure the Python API is running!");

      const result = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      navigate("/job-matches");
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      const msg = errMsg.includes("fetch")
        ? "❌ Could not connect to the Python API.\n\nPlease make sure your Python server is running:\n  python api.py"
        : `❌ Analysis failed: ${errMsg}`;
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    performAnalysis(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const trustItems = [
    {
      icon: "lock",
      title: "Privacy First",
      desc: "Your data is encrypted and never sold to third parties.",
      color: "#38bdf8",
    },
    {
      icon: "psychology",
      title: "AI Matching",
      desc: "Advanced extraction for precision career mapping.",
      color: "#a78bfa",
    },
    {
      icon: "bolt",
      title: "Instant Results",
      desc: "Analysis complete in under 12 milliseconds.",
      color: "#34d399",
    },
  ];

  return (
    <div
      className="glass-bg"
      style={{ minHeight: "100vh", color: "#e2e8ff", overflowX: "hidden", paddingBottom: 80 }}
    >
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 840,
          margin: "0 auto",
          padding: "56px 24px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="badge-glass" style={{ marginBottom: 24, display: "inline-flex" }}>
            <span className="glow-dot" />
            AI-Powered Resume Scanner
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem,5vw,3.4rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Upload Your <span className="gradient-text">Resume</span>
          </h1>
          <p
            style={{
              color: "#475569",
              fontSize: 16,
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Our AI will extract your expertise and match you with executive roles tailored to your
            DNA.
          </p>
        </div>

        {/* Main Upload Card */}
        <div
          className="glass-strong glass-border-glow"
          style={{
            borderRadius: 28,
            padding: "48px 40px",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background accent */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Drop Zone */}
          <div
            className="drop-zone"
            style={{
              padding: "56px 32px",
              textAlign: "center",
              position: "relative",
              borderColor: isDragging ? "rgba(129,140,248,0.8)" : undefined,
              background: isDragging ? "rgba(99,102,241,0.08)" : undefined,
              boxShadow: isDragging
                ? "0 0 40px rgba(99,102,241,0.15), inset 0 0 40px rgba(99,102,241,0.05)"
                : undefined,
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.docx,.rtf,.txt"
              disabled={isLoading}
            />

            {isLoading ? (
              /* Loading state */
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
              >
                <div style={{ position: "relative", width: 72, height: 72 }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "3px solid rgba(99,102,241,0.15)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "3px solid transparent",
                      borderTopColor: "#6366f1",
                      animation: "spin-slow 1s linear infinite",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 8,
                      borderRadius: "50%",
                      border: "2px solid transparent",
                      borderTopColor: "#38bdf8",
                      animation: "spin-slow 0.7s linear infinite reverse",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                    Analyzing Resume…
                  </div>
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    {fileName && `Processing: ${fileName}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  {["Extracting skills", "Mapping experience", "Finding matches"].map((step, i) => (
                    <div
                      key={step}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        color: "#818cf8",
                        opacity: 0.6 + i * 0.2,
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Default state */
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(99,102,241,0.2)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 40, color: "#818cf8" }}
                  >
                    cloud_upload
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                    {isDragging ? "Drop it here!" : "Drag & Drop Resume"}
                  </p>
                  <p style={{ fontSize: 13, color: "#475569" }}>PDF, DOCX, TXT or RTF · Max 10MB</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    color: "#334155",
                    width: "100%",
                    maxWidth: 300,
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    or
                  </span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <button
                  className="btn-primary"
                  style={{ fontSize: 14, padding: "13px 32px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    folder_open
                  </span>
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Trust Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px,1fr))",
              gap: 16,
              marginTop: 32,
            }}
          >
            {trustItems.map(({ icon, title, desc, color }) => (
              <div key={title} className="glass-subtle" style={{ padding: "20px 18px" }}>
                <div style={{ marginBottom: 10 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 22, color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Formats */}
        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {[".PDF", ".DOCX", ".TXT", ".RTF"].map((fmt) => (
            <div
              key={fmt}
              style={{
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                fontSize: 12,
                fontWeight: 700,
                color: "#334155",
                letterSpacing: "0.04em",
              }}
            >
              {fmt}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ResumeAnalysis;
