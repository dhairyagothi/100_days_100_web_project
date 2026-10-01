import { memo, useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import CameraModal from "./CameraModal";
import { MAX_FILE_SIZE } from "@/utils/constants";

const FileUploader = memo(({ uploadedFile, setUploadedFile }) => {
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const err = rejectedFiles[0].errors[0];
        if (err.code === "file-too-large") {
          toast.error("Image must be under 5MB 🥹");
        } else {
          toast.error("Please choose images only! 🥹");
        }
        return;
      }
      const file = acceptedFiles?.[0];
      if (!file) return;
      setUploadedFile(file);
    },
    [setUploadedFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    noClick: true, // ← disable dropzone's document-level click listener entirely
    noKeyboard: true, // ← same for keyboard, we handle it ourselves
  });

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraCapture = (file) => {
    setUploadedFile(file);
    setShowCamera(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  return (
    <>
      <div className="uploader-root">
        {uploadedFile ? (
          <div className="preview-wrap">
            <img
              src={URL.createObjectURL(uploadedFile)}
              alt="preview"
              className="preview-img"
            />
            <div className="preview-overlay">
              <button
                className="preview-remove"
                onClick={handleRemove}
                type="button"
                title="Remove image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
                Remove
              </button>
            </div>
            <div className="preview-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Ready
            </div>
          </div>
        ) : (
          <>
            <div
              className={`dropzone ${isDragActive ? "drag-active" : ""}`}
              {...getRootProps({ onClick: handleDropzoneClick })}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > MAX_FILE_SIZE) {
                    toast.error("Image must be under 5MB 🥹");
                    return;
                  }
                  setUploadedFile(file);
                  // reset so same file can be re-selected if removed
                  e.target.value = "";
                }}
              />
              <input {...getInputProps()} />

              <div className="dropzone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="17 8 12 3 7 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {isDragActive ? (
                <p className="dropzone-text active">Drop it here...</p>
              ) : (
                <>
                  <p className="dropzone-text">
                    Drag & drop or <span className="dropzone-link">browse</span>
                  </p>
                  <p className="dropzone-sub">JPG, PNG, WEBP · max 5MB</p>
                </>
              )}
            </div>

            <button
              className="camera-trigger"
              onClick={() => setShowCamera(true)}
              type="button"
              title="Take a photo"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Take Photo
            </button>
          </>
        )}
      </div>

      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
});

export default FileUploader;
