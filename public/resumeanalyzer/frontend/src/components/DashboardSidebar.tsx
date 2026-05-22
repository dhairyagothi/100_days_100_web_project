import { Link, useLocation } from "react-router-dom";

const items = [
  { icon: "dashboard", label: "Dashboard", to: "/" as const },
  { icon: "description", label: "Resume Analysis", to: "/resume-analysis" as const },
  { icon: "work", label: "Job Matches", to: "/job-matches" as const },
  { icon: "insights", label: "Insights", to: "/job-matches" as const },
];

export function DashboardSidebar() {
  const loc = useLocation();
  return (
    <aside className="fixed left-0 top-0 bottom-0 flex flex-col p-4 z-40 h-full w-72 rounded-r-xl bg-[#131b2e] border-r border-[#434655] shadow-lg">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2563eb] rounded-lg flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[#eeefff]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
        </div>
        <span className="text-xl font-bold text-[#b4c5ff]">CareerAI</span>
      </div>

      <div className="flex items-center gap-3 p-4 mb-6 bg-[#222a3d] rounded-xl">
        <img
          alt="Alex Rivers"
          className="w-12 h-12 rounded-full border-2 border-[#b4c5ff] object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9-7LbEwuLHk9t4GOvDo-qeBV7NMm8k6dOVRNfZqLgcqFXQA8fyk7irkPsSxi_Q1eUw5Ua45hAQuvhnF41Ks21HvesbBfJa_O3nFVeLxz4HXaHPf_om-4Q0eT0pR6VnfR7Jbz6p40l77Wqn7sdi6hVWpL7tSvME4gflCi0ojGM3SQuG99Ivyshdh5VwOHoM7Uy5sn4-7iClvYVLEiBJOLSdzpQDPIdzvaMKNUXPfG8g1kQncmyPayS03gb7djU9tt0ZlUC0LnG6Pw"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#dae2fd] truncate">Alex Rivers</p>
          <p className="text-xs text-[#c3c6d7] truncate">Senior Product Designer</p>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#2563eb]/20 text-[#b4c5ff] text-[10px] font-bold uppercase tracking-wider">
            Premium
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((it) => {
          const active = loc.pathname === it.to;
          return (
            <Link
              key={it.label}
              to={it.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:translate-x-1 ${
                active
                  ? "bg-[#b4c5ff] text-[#002a78] font-bold"
                  : "text-[#c3c6d7] hover:bg-[#222a3d]"
              }`}
            >
              <span className="material-symbols-outlined">{it.icon}</span>
              <span className="text-sm">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#434655]">
        <a
          className="flex items-center gap-3 px-4 py-3 text-[#c3c6d7] hover:bg-[#222a3d] rounded-lg"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Settings</span>
        </a>
      </div>
    </aside>
  );
}
