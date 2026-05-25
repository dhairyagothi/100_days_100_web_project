import { endpoints} from '../utils/api';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HPnav({ status }) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);

    await fetch(endpoints.LOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });

    //  HARD REFRESH 
    window.location.href = "/";
  }


  return (
    <>
      {/* 🔥 Center Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm">Logging out...</p>
          </div>
        </div>
      )}

      <header className="bg-zinc-950 border-b border-zinc-800 w-full">
        <div className="w-full px-4 md:px-10 h-auto md:h-[60px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 py-3 md:py-0">

          <h1 className="font-mono text-lg font-bold text-white tracking-tight">
             Dhairya <span className="text-emerald-400">Gothi</span>
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-8 text-center">


            <a href="https://www.chandankoranga.in" target="_blank"  rel="noreferrer" className="text-zinc-400 text-sm hover:text-white transition-colors">
              About Developer
            </a>

            <a href="/contact" target="_blank"  rel="noreferrer" className="text-zinc-400 text-sm hover:text-white transition-colors">
              contact us 
            </a>


            {!status ? (
              <button 
                onClick={() => { navigate("/login") }} 
                className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-sm font-semibold px-4 py-1.5 rounded transition-colors"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={logoutHandler} 
                disabled={loading}
                className={`bg-red-500 hover:bg-red-400 text-zinc-950 font-mono text-sm font-semibold px-4 py-1.5 rounded transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Logout
              </button>
            )}

          </div>
        </div>
      </header>
    </>
  )
}