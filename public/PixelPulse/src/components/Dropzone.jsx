import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 20;

export default function Dropzone({ onDrop }) {
  const [dragging, setDragging] = useState(false);

  const validate = (file) => {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP files are supported.");
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File is too large. Max size is ${MAX_MB} MB.`);
      return false;
    }
    return true;
  };

  const handleFiles = useCallback(
    (files) => {
      const file = files[0];
      if (!file) return;
      if (validate(file)) onDrop(file);
    },
    [onDrop],
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);
  const onDropEvent = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const onInputChange = (e) => handleFiles(e.target.files);

  return (
    <div className="w-full max-w-2xl">
      {/* Main drop area */}
      <label
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDropEvent}
        className={`group relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 py-20 px-8 ${
          dragging
            ? "border-violet-500 bg-violet-950/30"
            : "border-white/10 hover:border-violet-500/50 bg-[#0D0D16] hover:bg-violet-950/10"
        }`}
      >
        <input
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          onChange={onInputChange}
        />

        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
            dragging
              ? "bg-violet-600/30 scale-110"
              : "bg-white/5 group-hover:bg-violet-600/20 group-hover:scale-105"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={`w-10 h-10 transition-colors ${
              dragging
                ? "text-violet-400"
                : "text-[#475569] group-hover:text-violet-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <p
          className={`font-semibold text-xl mb-2 transition-colors ${
            dragging ? "text-violet-300" : "text-white"
          }`}
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {dragging ? "Release to load" : "Drop your image here"}
        </p>
        <p className="text-[#475569] text-sm mb-6">
          or click to browse your files
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-[#334155]">
          <span>JPEG</span>
          <span className="w-1 h-1 rounded-full bg-[#1E293B]" />
          <span>PNG</span>
          <span className="w-1 h-1 rounded-full bg-[#1E293B]" />
          <span>WEBP</span>
          <span className="w-1 h-1 rounded-full bg-[#1E293B]" />
          <span>up to {MAX_MB} MB</span>
        </div>

        {/* Corner accents */}
        {[
          "top-3 left-3",
          "top-3 right-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} w-4 h-4 border-violet-500/40 transition-opacity ${
              dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } ${
              i === 0
                ? "border-l-2 border-t-2 rounded-tl"
                : i === 1
                  ? "border-r-2 border-t-2 rounded-tr"
                  : i === 2
                    ? "border-l-2 border-b-2 rounded-bl"
                    : "border-r-2 border-b-2 rounded-br"
            }`}
          />
        ))}
      </label>

      {/* Privacy note */}
      <p className="text-center text-[#334155] text-xs mt-5 flex items-center justify-center gap-1.5">
        <svg
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-3 h-3 text-[#475569]"
        >
          <path
            fillRule="evenodd"
            d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5V4.5a2 2 0 1 0-4 0V6h4Z"
            clipRule="evenodd"
          />
        </svg>
        Your image never leaves your device — all processing runs locally.
      </p>
    </div>
  );
}
