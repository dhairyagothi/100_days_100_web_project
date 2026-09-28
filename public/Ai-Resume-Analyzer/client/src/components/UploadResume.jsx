import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X, Briefcase, FileSignature, Loader2 } from "lucide-react";

function UploadResume() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFile = (selectedFile) => {
        if (selectedFile && (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".docx"))) {
            setFile(selectedFile);
        } else {
            alert("Please upload a PDF or DOCX file.");
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("resume", file);
            if (jobDescription) formData.append("jobDescription", jobDescription);

            const res = await axios.post("http://localhost:5000/api/resume/upload", formData);

            // Navigate strictly to the results page when success!
            navigate("/result", { state: { analysis: res.data.analysis } });

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error uploading resume");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 w-full animate-fade-in-up">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="text-center mb-12 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <FileSignature size={14} /> Powered by Llama 3.3
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                        Optimize Your Resume for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">ATS Success</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Upload your resume and get an instant AI-powered analysis to boost your interview chances.
                    </p>
                </div>


                <div className="relative grid md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <UploadCloud size={20} className="text-purple-400" /> Upload Your Resume (PDF/DOCX)
                        </h3>

                        {!file ? (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragOver
                                    ? "border-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]"
                                    : "border-slate-600 bg-slate-800/50 hover:bg-slate-800/80 hover:border-slate-500"
                                    }`}
                            >
                                <div className="p-5 bg-slate-700/50 rounded-full mb-4 shadow-inner ring-1 ring-slate-600">
                                    <UploadCloud size={44} className="text-blue-400 shrink-0" />
                                </div>
                                <p className="text-slate-200 font-semibold text-lg">Drag & drop your resume here</p>
                                <p className="text-slate-400 text-sm mt-2 font-medium">or click to browse from computer</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-slate-800/80 border border-slate-600 rounded-2xl relative overflow-hidden transition-all duration-300 group shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <FileText size={56} className="text-purple-400 mb-5 drop-shadow-lg" />
                                <p className="text-white font-bold text-lg max-w-[80%] truncate">{file.name}</p>
                                <p className="text-slate-400 text-sm mt-1 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                <button
                                    onClick={() => setFile(null)}
                                    className="absolute top-4 right-4 p-2 bg-slate-700/80 hover:bg-red-500 hover:scale-110 rounded-full transition-all text-white shadow-lg"
                                    title="Remove file"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                        <input
                            type="file"
                            accept=".pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-400" /> Job Description (Optional)
                        </h3>
                        <div className="relative group flex-1 h-64">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the target job description here to get an accurate ATS match score and customized keyword analysis..."
                                className="relative block w-full h-full resize-none bg-slate-800/80 border border-slate-600 rounded-2xl p-6 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium leading-relaxed"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="relative pt-10 mt-8 border-t border-slate-700/50 flex justify-center">
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className={`group relative flex items-center justify-center gap-3 px-12 py-4 font-bold text-lg text-white rounded-full transition-all duration-300 ${loading || !file
                            ? "bg-slate-700 cursor-not-allowed opacity-60"
                            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_35px_rgba(79,70,229,0.5)] hover:-translate-y-1 active:scale-95"
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Analyzing with AI...
                            </>
                        ) : (
                            <>
                                Analyze Resume Now
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UploadResume;