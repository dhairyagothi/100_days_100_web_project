import { memo } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { MdOutlineContentCopy } from "react-icons/md";

const platformColors = {
  instagram: { bg: "#f0e6ff", color: "#7c3aed" },
  twitter: { bg: "#e6f4ff", color: "#0284c7" },
  facebook: { bg: "#e6eeff", color: "#1d4ed8" },
  linkedin: { bg: "#e6f0ff", color: "#0369a1" },
};

const CaptionLogs = memo(({ captionLogs, handleDelete, setConfirmDelete}) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (captionLogs.length === 0) {
    return (
      <div className="logs-empty">
        <div className="logs-empty-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="logs-empty-title">No captions yet</p>
        <p className="logs-empty-sub">
          Your generated captions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="logs-section">
      <div className="logs-header">
        <span className="logs-count">
          {captionLogs.length} caption{captionLogs.length > 1 ? "s" : ""}
        </span>
        <button
          className="log-btn bg-red-500 text-[whitesmoke]"
          onClick={() => setConfirmDelete(true)}
          title="Clear all caption"
        >
          <span className="text-[1rem]">
            <MdDelete />
          </span>
          Clear All
        </button>
      </div>
      <div className="logs-list">
        {captionLogs.map((item) => {
          const { captionId, caption, platform, tone } = item;
          const pColor = platform ? platformColors[platform] : null;

          return (
            <div key={captionId} className="log-card">
              <div className="log-card-meta">
                {platform && (
                  <span
                    className="log-platform-tag"
                    style={{ background: pColor?.bg, color: pColor?.color }}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                )}
                {tone && (
                  <span className="log-tone-tag">
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </span>
                )}
              </div>
              <p className="log-caption-text">{caption}</p>
              <div className="caption-actions flex gap-3">
                <button
                  className="log-btn "
                  onClick={() => handleCopy(caption)}
                  title="Copy caption"
                >
                  <span className="text-[1rem]">
                    <MdOutlineContentCopy />
                  </span>
                  Copy
                </button>
                <button
                  className="log-btn bg-red-500 text-[whitesmoke]"
                  onClick={() => handleDelete(captionId)}
                  title="Delete caption"
                >
                  <span className="text-[1rem]">
                    <MdDelete />
                  </span>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CaptionLogs;
