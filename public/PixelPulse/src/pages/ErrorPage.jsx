import { useRouteError, useNavigate } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const is404 = error?.status === 404 || error?.statusText === "Not Found";

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 text-center">
      {/* Pixel grid decoration */}
      <div className="relative mb-10">
        <div className="grid grid-cols-6 gap-1.5 opacity-40">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-sm"
              style={{
                background: `hsl(${260 + i * 4}, 60%, ${15 + ((i * 7) % 30)}%)`,
                opacity: 0.3 + ((i * 13) % 70) / 100,
              }}
            />
          ))}
        </div>
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-violet-700/20 blur-2xl" />
        </div>
      </div>

      <p className="text-xs font-mono tracking-widest text-violet-400 uppercase mb-3">
        {error?.status ?? "Error"}
      </p>

      <h1
        className="text-5xl sm:text-6xl font-bold text-white mb-4"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {is404 ? "Page not found." : "Something broke."}
      </h1>

      <p className="text-[#475569] text-base max-w-sm mb-10 leading-relaxed">
        {is404
          ? "That page doesn't exist. You may have followed a broken link or typed the address wrong."
          : error?.message ||
            "An unexpected error occurred. Try going back or refreshing."}
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-lg border border-white/10 hover:border-white/20 text-[#64748B] hover:text-white text-sm font-medium transition-colors"
        >
          ← Go back
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          Home
        </button>
      </div>
    </div>
  );
}
