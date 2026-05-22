import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnalysisResultDisplay } from "../components/AnalysisResultDisplay";
import type { AnalysisResult } from "../lib/resume-analyzer";

function JobMatches() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("analysisResult");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Normalize old format (technical[]) to new format (sections[])
        const skills = parsed?.candidateProfile?.extractedSkills;
        if (skills && !Array.isArray(skills.sections)) {
          // Convert old flat technical array to sections format
          skills.sections = [
            { name: "Technical Skills", skills: skills.technical || skills.tools || [] },
          ];
          skills.languages = skills.languages || [];
        }
        setAnalysisResult(parsed);
      } catch (e) {
        console.error("Failed to parse analysis result");
        sessionStorage.removeItem("analysisResult");
      }
    }
  }, []);

  if (!analysisResult) {
    return (
      <div className="bg-gradient-to-br from-[#0b1326] to-[#060e20] min-h-screen flex flex-col text-[#dae2fd] items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">No Resume Found</h2>
        <p className="text-[#c3c6d7] mb-6">Please upload a resume first to see your matches.</p>
        <Link
          to="/resume-analysis"
          className="px-6 py-3 bg-[#b4c5ff] text-[#002a78] font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #060b18 0%, #0d1528 50%, #07111f 100%)",
        color: "#e2e8f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        style={{
          position: "fixed",
          top: "-20%",
          left: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-20%",
          right: "-10%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "40%",
          right: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <main style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg,#a5b4fc,#67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Your Career Matches
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#475569" }}>
                AI-powered analysis from your resume
              </p>
            </div>
            <Link
              to="/resume-analysis"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 12,
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#a5b4fc",
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
                transition: "background .2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                upload_file
              </span>
              Upload New Resume
            </Link>
          </div>
          <AnalysisResultDisplay result={analysisResult} />
        </div>
      </main>
    </div>
  );
}

export default JobMatches;
