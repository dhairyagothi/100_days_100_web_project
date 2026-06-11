import { useState } from "react";
import type { AnalysisResult } from "@/lib/resume-analyzer";

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

const SECTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Programming Languages": {
    bg: "rgba(99,102,241,0.15)",
    text: "#a5b4fc",
    border: "rgba(99,102,241,0.3)",
  },
  "Web Technologies": {
    bg: "rgba(14,165,233,0.15)",
    text: "#7dd3fc",
    border: "rgba(14,165,233,0.3)",
  },
  Databases: { bg: "rgba(236,72,153,0.15)", text: "#f9a8d4", border: "rgba(236,72,153,0.3)" },
  "Tools & Platforms": {
    bg: "rgba(20,184,166,0.15)",
    text: "#5eead4",
    border: "rgba(20,184,166,0.3)",
  },
  "Other Skills": { bg: "rgba(168,85,247,0.15)", text: "#d8b4fe", border: "rgba(168,85,247,0.3)" },
};
const DEFAULT_COLOR = {
  bg: "rgba(99,102,241,0.15)",
  text: "#a5b4fc",
  border: "rgba(99,102,241,0.3)",
};

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? "#34d399" : score >= 45 ? "#fbbf24" : "#f87171";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

export function AnalysisResultDisplay({ result, isLoading = false }: AnalysisResultDisplayProps) {
  const [expandedJob, setExpandedJob] = useState<number | null>(0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[140, 200, 380].map((h, i) => (
          <div
            key={i}
            style={{ height: h, borderRadius: 20, background: "rgba(255,255,255,0.04)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Candidate Profile ── */}
      <section
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: "2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(99,102,241,0.5)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#fff" }}>
              person
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            Candidate Profile
          </h2>
          <span
            style={{
              marginLeft: "auto",
              padding: "4px 14px",
              borderRadius: 999,
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.35)",
              fontSize: 11,
              fontWeight: 700,
              color: "#a5b4fc",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {result.candidateProfile.seniority}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: "1.25rem",
          }}
        >
          {[
            { label: "Full Name", value: result.candidateProfile.name, icon: "badge" },
            { label: "Email", value: result.candidateProfile.email, icon: "mail" },
            { label: "Phone", value: result.candidateProfile.phone || "N/A", icon: "phone" },
            {
              label: "Experience",
              value: result.candidateProfile.totalExperience,
              icon: "work_history",
            },
            {
              label: "Primary Domain",
              value: result.candidateProfile.primaryDomain,
              icon: "category",
            },
            {
              label: "Education",
              value: result.candidateProfile.education || "N/A",
              icon: "school",
            },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "1rem 1.2rem",
                transition: "border-color .2s, background .2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.4)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 14, color: "#6366f1" }}
                >
                  {icon}
                </span>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </div>
              <p style={{ fontSize: "0.92rem", color: "#e2e8f0", margin: 0, fontWeight: 500 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Extracted Skills ── */}
      <section
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: "2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(139,92,246,0.5)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#fff" }}>
              hub
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            Extracted Skills
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Technical Sections */}
          {result.candidateProfile.extractedSkills.sections.map((section, i) => {
            const col = SECTION_COLORS[section.name] || DEFAULT_COLOR;
            return (
              <div key={i}>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: col.text,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    marginBottom: 10,
                  }}
                >
                  {section.name}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {section.skills.map((skill, j) => (
                    <span
                      key={j}
                      style={{
                        padding: "5px 14px",
                        borderRadius: 999,
                        background: col.bg,
                        border: `1px solid ${col.border}`,
                        color: col.text,
                        fontSize: 12,
                        fontWeight: 600,
                        transition: "transform .15s, box-shadow .15s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLSpanElement).style.boxShadow =
                          `0 4px 15px ${col.bg}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLSpanElement).style.transform = "";
                        (e.currentTarget as HTMLSpanElement).style.boxShadow = "";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Soft Skills */}
          {result.candidateProfile.extractedSkills.softSkills.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fb923c",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}
              >
                Soft Skills
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.candidateProfile.extractedSkills.softSkills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      background: "rgba(251,146,60,0.12)",
                      border: "1px solid rgba(251,146,60,0.3)",
                      color: "#fdba74",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {(result.candidateProfile.extractedSkills.languages?.length ?? 0) > 0 && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#34d399",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}
              >
                Languages
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.candidateProfile.extractedSkills.languages.map((lang, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      background: "rgba(52,211,153,0.12)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      color: "#6ee7b7",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {result.candidateProfile.extractedSkills.certifications.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fbbf24",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}
              >
                Certifications
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.candidateProfile.extractedSkills.certifications.map((cert, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "5px 14px",
                      borderRadius: 999,
                      background: "rgba(251,191,36,0.12)",
                      border: "1px solid rgba(251,191,36,0.3)",
                      color: "#fde68a",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Top Job Matches ── */}
      <section
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: "2rem",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.75rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(6,182,212,0.5)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#fff" }}>
              emoji_events
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            Top 5 Job Matches
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {result.topMatches.map((match, index) => {
            const isOpen = expandedJob === index;
            const score = match.compatibilityScore;
            const scoreColor = score >= 70 ? "#34d399" : score >= 45 ? "#fbbf24" : "#f87171";
            return (
              <div
                key={index}
                style={{
                  background: isOpen ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isOpen ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 18,
                  overflow: "hidden",
                  transition: "border-color .25s, background .25s",
                  boxShadow: isOpen ? "0 0 30px rgba(99,102,241,0.1)" : "none",
                }}
              >
                {/* Header button */}
                <button
                  onClick={() => setExpandedJob(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    padding: "1.25rem 1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    textAlign: "left",
                  }}
                >
                  {/* Rank badge */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        index === 0
                          ? "linear-gradient(135deg,#f59e0b,#ef4444)"
                          : index === 1
                            ? "linear-gradient(135deg,#94a3b8,#cbd5e1)"
                            : "linear-gradient(135deg,#78350f,#d97706)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#fff",
                      boxShadow: index === 0 ? "0 0 14px rgba(245,158,11,0.5)" : "none",
                    }}
                  >
                    #{index + 1}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#e2e8f0" }}>
                      {match.job.jobTitle}
                    </h3>
                    {match.job.company && (
                      <p style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b" }}>
                        {match.job.company}
                      </p>
                    )}
                  </div>

                  {/* Score ring */}
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <ScoreRing score={score} size={64} />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        fontSize: 13,
                        fontWeight: 800,
                        color: scoreColor,
                      }}
                    >
                      {score}
                    </div>
                  </div>

                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: "#64748b",
                      transition: "transform .25s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  >
                    expand_more
                  </span>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.5rem",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Score bars */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
                        gap: 10,
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      {[
                        {
                          label: "Skills Match",
                          val: match.scoreBreakdown.skillsMatch,
                          max: 40,
                          color: "#6366f1",
                        },
                        {
                          label: "Experience",
                          val: match.scoreBreakdown.experienceMatch,
                          max: 30,
                          color: "#06b6d4",
                        },
                        {
                          label: "Education",
                          val: match.scoreBreakdown.educationMatch,
                          max: 15,
                          color: "#8b5cf6",
                        },
                        {
                          label: "Industry",
                          val: match.scoreBreakdown.industryMatch,
                          max: 15,
                          color: "#ec4899",
                        },
                      ].map(({ label, val, max, color }) => (
                        <div
                          key={label}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 12,
                            padding: "12px 14px",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 8px",
                              fontSize: 11,
                              color: "#64748b",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: 0.8,
                            }}
                          >
                            {label}
                          </p>
                          <div
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              borderRadius: 999,
                              height: 5,
                              marginBottom: 6,
                            }}
                          >
                            <div
                              style={{
                                width: `${(val / max) * 100}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: color,
                                boxShadow: `0 0 8px ${color}`,
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                            {val}
                            <span style={{ color: "#475569", fontWeight: 400 }}>/{max}</span>
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Matching skills */}
                    {match.matchingSkills.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#34d399",
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                            marginBottom: 8,
                          }}
                        >
                          ✅ Matching Skills
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {match.matchingSkills.map((s, i) => (
                            <span
                              key={i}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 999,
                                background: "rgba(52,211,153,0.12)",
                                border: "1px solid rgba(52,211,153,0.3)",
                                color: "#6ee7b7",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill gaps */}
                    {match.skillGaps.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <p
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#f87171",
                            textTransform: "uppercase",
                            letterSpacing: 1.2,
                            marginBottom: 8,
                          }}
                        >
                          ❌ Skill Gaps
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {match.skillGaps.map((s, i) => (
                            <span
                              key={i}
                              style={{
                                padding: "4px 12px",
                                borderRadius: 999,
                                background: "rgba(248,113,113,0.12)",
                                border: "1px solid rgba(248,113,113,0.3)",
                                color: "#fca5a5",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Why fits */}
                    <div
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        marginBottom: 14,
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 6px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#a5b4fc",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Why This Job Fits
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>
                        {match.whyThisJobFits}
                      </p>
                    </div>

                    {/* Prep steps */}
                    <div>
                      <p
                        style={{
                          margin: "0 0 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#a5b4fc",
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Preparation Steps
                      </p>
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {match.preparationSteps.map((step, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "flex-start",
                              fontSize: 13,
                              color: "#94a3b8",
                            }}
                          >
                            <span style={{ color: "#6366f1", fontWeight: 800, flexShrink: 0 }}>
                              →
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Overall Assessment ── */}
      <section
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.10))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 24,
          padding: "2rem",
          boxShadow: "0 8px 40px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1rem" }}>
          <span className="material-symbols-outlined" style={{ color: "#a5b4fc", fontSize: 28 }}>
            auto_awesome
          </span>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>
            Overall Assessment
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: "1rem", color: "#cbd5e1", lineHeight: 1.75 }}>
          {result.overallAssessment}
        </p>
      </section>

      {/* ── Raw PDF Extraction ── */}
      {result.candidateProfile.extractedText && (
        <section
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: "2rem",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
          }}
        >
          <details className="group">
            <summary
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                listStyle: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#64748b", fontSize: 22 }}
                >
                  description
                </span>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#94a3b8", margin: 0 }}>
                  Raw PDF Extraction
                </h2>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ color: "#64748b", transition: "transform .25s" }}
              >
                expand_more
              </span>
            </summary>
            <div
              style={{
                marginTop: 16,
                padding: 16,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                maxHeight: 380,
                overflowY: "auto",
              }}
            >
              <pre
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  margin: 0,
                }}
              >
                {result.candidateProfile.extractedText}
              </pre>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}
