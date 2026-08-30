import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle, XCircle, Lightbulb, TrendingUp, AlertTriangle, ArrowLeft, Target, Key, CheckSquare, ListChecks, FileDigit, Briefcase, Activity, FileText } from "lucide-react";

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const analysis = location.state?.analysis;

    if (!analysis) {
        return <Navigate to="/" replace />;
    }

    // Deconstruct fullAnalysis mega payload
    const parsedData = analysis.parsed || {};
    const atsData = analysis.ats?.atsScore || {};
    const keywordData = analysis.keywords?.keywordAnalysis || {};
    const contentData = analysis.content?.contentQuality || {};
    const recData = analysis.recommendations?.recommendations || {};

    const overallScore = recData.overallScore || atsData.overall || 0;
    const breakdown = atsData.breakdown || {};

    const getScoreColorInfo = (score) => {
        if (score >= 75) return { text: "text-green-400", bg: "bg-green-400", border: "border-green-400", bgLight: "bg-green-500/10" };
        if (score >= 50) return { text: "text-yellow-400", bg: "bg-yellow-400", border: "border-yellow-400", bgLight: "bg-yellow-500/10" };
        return { text: "text-red-500", bg: "bg-red-500", border: "border-red-500", bgLight: "bg-red-500/10" };
    };

    const coreColor = getScoreColorInfo(overallScore);

    const breakdownItems = [
        { label: "Formatting", max: 25, data: breakdown.formatting, icon: <ListChecks size={18} /> },
        { label: "Keywords", max: 25, data: breakdown.keywords, icon: <Key size={18} /> },
        { label: "Headers", max: 20, data: breakdown.sectionHeaders, icon: <CheckSquare size={18} /> },
        { label: "Clarity", max: 20, data: breakdown.clarity, icon: <Activity size={18} /> },
        { label: "Contact Info", max: 5, data: breakdown.contactInfo, icon: <Target size={18} /> },
        { label: "Encoding", max: 5, data: breakdown.fileFormat, icon: <FileDigit size={18} /> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 w-full animate-fade-in-up">
            <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 text-sm font-semibold">
                <ArrowLeft size={18} /> Re-Analyze New Resume
            </button>

            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="text-center mb-16 relative">
                    <h2 className="text-3xl font-extrabold text-white flex items-center justify-center gap-3">
                        <TrendingUp className="text-purple-400" size={36} /> Executive Resume Intelligence
                    </h2>
                    <p className="text-slate-400 mt-2">Analyzed for {parsedData.personalInfo?.name || "Candidate"} • Projected Fix Impact: <span className="text-green-400 font-bold">{recData.improvementPotential || "+?"}</span></p>
                </div>

                {/* OVERALL RESUME SCORE */}
                <div className="relative flex justify-center mb-16">
                    <div className="relative group">
                        <svg className="w-56 h-56 transform -rotate-90 relative z-10">
                            <circle cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="14" className="text-slate-800" />
                            <circle
                                cx="112" cy="112" r="90" fill="transparent" stroke="currentColor" strokeWidth="14" strokeLinecap="round"
                                strokeDasharray="565" strokeDashoffset={565 - (565 * overallScore) / 100}
                                className={`${coreColor.text} transition-all duration-1000`}
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10">
                            <span className={`text-6xl font-extrabold ${coreColor.text}`}>{overallScore}%</span>
                            <span className="text-slate-300 text-sm font-bold tracking-widest mt-2 uppercase">{recData.currentStatus || "Status"}</span>
                        </div>
                    </div>
                </div>

                {/* ATS DETAILED SCORECARD */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <Target className="text-blue-400" size={24} /> Strict ATS Breakdown Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {breakdownItems.map((item, idx) => {
                            const score = item.data?.score || 0;
                            const percent = (score / item.max) * 100;
                            return (
                                <div key={idx} className="bg-slate-800/40 p-5 border border-slate-700/50 rounded-2xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-slate-300 font-semibold flex items-center gap-2">
                                            <span className="text-slate-400">{item.icon}</span> {item.label}
                                        </span>
                                        <span className="text-slate-200 font-bold bg-slate-900 px-2.5 py-1 rounded-md text-sm border border-slate-700">{score} <span className="text-slate-500">/ {item.max}</span></span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3">
                                        <div className={`h-2 rounded-full ${percent >= 80 ? 'bg-green-400' : percent >= 50 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: percent + '%' }}></div>
                                    </div>
                                    <p className="text-slate-400 text-xs leading-relaxed">{item.data?.feedback || "No feedback."}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* KEYWORDS */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <Key className="text-purple-400" size={24} /> Keyword Optimization
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-slate-800/20 border border-slate-700/50 rounded-3xl p-6">
                            <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2"><CheckCircle size={18} /> Naturally Integrated</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywordData.keywordIntegration?.natural?.map((kw, i) => (
                                    <span key={i} className="text-sm px-3 py-1 bg-green-500/10 border border-green-500/20 text-slate-300 rounded-lg">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-800/20 border border-slate-700/50 rounded-3xl p-6">
                            <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2"><XCircle size={18} /> Critical Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {keywordData.keywordMatching?.missingCriticalKeywords?.map((kw, i) => (
                                    <span key={i} className="text-sm px-3 py-1 bg-red-500/10 border border-red-500/20 text-slate-300 rounded-lg">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROJECT & CONTENT QUALITY */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <Briefcase className="text-orange-400" size={24} /> Content & Impact Analysis
                    </h3>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex-1 relative overflow-hidden">
                                <div className="text-3xl font-black text-white mb-1">{contentData.overallScore}%</div>
                                <div className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Content Score</div>
                            </div>
                            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 flex-1 flex flex-col justify-center">
                                <div className="text-xl font-bold text-slate-200 mb-1">{contentData.segments?.experience?.jobCount || 0} Jobs Detected</div>
                                <div className="text-slate-400 text-sm">{contentData.metricAndImpactAnalysis?.sentencesWithoutMetrics || 0} sentences entirely lacking metrics</div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {contentData.sections?.experience?.suggestions?.map((sug, i) => (
                                <div key={i} className="bg-blue-500/5 p-5 border border-blue-500/20 rounded-2xl">
                                    <div className="text-xs font-bold text-blue-400 mb-2 uppercase">{sug.role} Reframing</div>
                                    <div className="text-sm text-slate-400 line-through mb-2">{sug.weak}</div>
                                    <div className="text-sm text-slate-200 font-semibold mb-2 flex items-start gap-2">
                                        <TrendingUp size={16} className="text-blue-500 shrink-0 mt-0.5" /> {sug.strong}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">Impact: {sug.impact}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ACTION VERBS */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
                        <Activity className="text-pink-400" size={24} /> Verb Power Profiler
                    </h3>
                    <div className="bg-slate-800/20 rounded-3xl border border-slate-700/50 overflow-hidden">
                        <div className="p-6 flex flex-wrap gap-3 mb-2">
                            {contentData.actionVerbAnalysis?.weakVerbs?.map((v, i) => (
                                <span key={'w' + i} className="text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><AlertTriangle size={12} /> {v}</span>
                            ))}
                            {contentData.actionVerbAnalysis?.strongVerbs?.map((v, i) => (
                                <span key={'s' + i} className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><CheckCircle size={12} /> {v}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PRIORITIZED RECOMMENDATIONS */}
                {recData.prioritized && recData.prioritized.length > 0 && (
                    <div className="bg-yellow-500/5 rounded-3xl border border-yellow-500/20 p-8 shadow-inner">
                        <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-3 border-b border-yellow-500/20 pb-4">
                            <Lightbulb size={24} /> Critical Action Plan
                        </h3>
                        <div className="space-y-6">
                            {recData.prioritized.map((rec, i) => (
                                <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-sm relative">
                                    <div className="absolute top-4 right-4 text-xs font-black uppercase text-slate-500 tracking-widest">{rec.estimatedTimeToFix}</div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">{rec.priority}</span>
                                        <h4 className="text-slate-100 font-bold">{rec.title}</h4>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-4">{rec.action}</p>

                                    {rec.example && (
                                        <div className="grid sm:grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                                            <div>
                                                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Current State</div>
                                                <div className="text-sm text-slate-400">{rec.example.before}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-green-500 uppercase font-black mb-1">Optimized Execution</div>
                                                <div className="text-sm text-slate-200">{rec.example.after}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ResultPage;
