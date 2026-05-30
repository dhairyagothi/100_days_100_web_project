import React from 'react'
import { useState } from 'react';
import { endpoints} from '../utils/api';

export default function HPhero({ User_name, status }) {

  const [urlState, setURLstate] = useState("");
  const [Password, setPassword] = useState("");
  const [shortURL, SetshortURL] = useState("");
  const [expiry, setExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [showQR, setShowQR] = useState(false)

  const handleProtectedAction = () => {
    if (!status) {
      window.location.href = "/login";
      return false;
    }
    return true;
  };

  const Shortener_handler = async () => {

    if (!urlState) {
      return setError("URL is required");
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(endpoints.SHORTEN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // TO use middlware , it is important to add 
        body: JSON.stringify({
          originalURL: urlState,
          Password: Password,
          expiryDate: expiry
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed");
      }

      SetshortURL(data.ShortURL);
      setQrCode(data.qrcode);
      setShowQR(false);

    } catch (err) {
      if (err.name === "TypeError") {
        setError("Server is down or network issue.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const Copy_handler = async () => {
    await navigator.clipboard.writeText(shortURL);
    alert("Copied to clipboard!");
  }

  let FirstName = User_name?.fullName?.trim().split(" ")[0] || "Guest";
  FirstName = FirstName.charAt(0).toUpperCase() + FirstName.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-stretch px-3 sm:px-4 pt-8 sm:pt-12 md:pt-16">

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm">Processing...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-10">

        {/* 🔥 FIXED SPACING HERE */}
        <div className="text-center mt-6 sm:mt-10 md:mt-12 mb-8 sm:mb-12">

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          {status && (
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-4">
              Hi, <span className="text-blue-500">{FirstName}</span>
            </h1>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold mb-3 sm:mb-4 text-yellow-500">
            Shorten Your Links
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base">
            Fast, secure and customizable URL shortening
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 md:p-10 shadow-2xl">

          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">

            <input
              type="text"
              placeholder="Enter your url here"
              value={urlState}
              onChange={(e) => setURLstate(e.target.value)}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:border-blue-500"
            />

            <button
              onClick={() => { if (!handleProtectedAction()) return; Shortener_handler(); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base"
            >
              Shorten
            </button>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Password</label>
              <input
                type="text"
                placeholder="Optional"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Expiry Date</label>
              <input
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="text-sm text-zinc-400 mb-2">QR Code</label>
              <button
                onClick={() => setShowQR(true)}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg py-3 text-sm"
              >
                Generate QR
              </button>
            </div>

          </div>

        </div>

        <div className="mt-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl">

          <p className="text-sm text-zinc-400 mb-3">Shortened URL</p>

          <div className="flex flex-col sm:flex-row gap-3">

            <input
              type="text"
              value={shortURL}
              readOnly
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm"
            />

            <button
              onClick={Copy_handler}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg text-sm"
            >
              Copy
            </button>

          </div>

        </div>

        {qrCode && showQR && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <img src={qrCode} alt="QR Code" className="w-40 h-40 sm:w-64 sm:h-64" />
            <a href={qrCode} download="qr-code.png" className="bg-green-600 px-4 py-2 rounded-lg text-sm">
              Download QR
            </a>
          </div>
        )}

      </div>
    </div>
  );
}