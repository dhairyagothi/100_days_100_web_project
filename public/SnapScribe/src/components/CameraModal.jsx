import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const CameraModal = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);

  const [facingMode, setFacingMode] = useState("environment");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(
    async (mode) => {
      stopStream(); // fully stop the previous stream before requesting a new one

      if (!isMountedRef.current) return;
      setIsLoading(true);
      setCapturedImage(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            // "ideal" won't hard-fail on desktop where facingMode is unsupported
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        // Component may have unmounted while we awaited — release immediately
        if (!isMountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // play() returns a promise — catch autoplay policy errors silently
          await videoRef.current.play().catch(() => {});
        }

        // Labels are only populated after permission is granted, so enumerate here
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        if (isMountedRef.current) {
          setHasMultipleCameras(videoDevices.length > 1);
        }
      } catch (err) {
        if (isMountedRef.current) {
          toast.error("Camera access denied or unavailable.");
          onClose();
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [stopStream, onClose],
  );

  // Mount: start with back camera. Unmount: stop stream + mark as unmounted.
  useEffect(() => {
    isMountedRef.current = true;
    startCamera("environment");
    return () => {
      isMountedRef.current = false;
      stopStream();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-start camera whenever facingMode changes.
  // Skips the initial render (handled by the mount effect above).
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    startCamera(facingMode);
  }, [facingMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // switchCamera only updates state — the effect above does the actual work.
  // This avoids calling startCamera with a stale facingMode closure.
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    // Pause the stream while the user reviews the photo
    streamRef.current?.getTracks().forEach((t) => (t.enabled = false));
  };

  const retake = () => {
    setCapturedImage(null);
    streamRef.current?.getTracks().forEach((t) => (t.enabled = true));
  };

  const accept = () => {
    if (!capturedImage) return;
    const arr = capturedImage.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const file = new File([u8arr], `snap_${Date.now()}.jpg`, { type: mime });
    onCapture(file);
  };

  return (
    <div
      className="camera-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="camera-modal">
        <div className="camera-header">
          <span className="camera-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="13"
                r="4"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {capturedImage
              ? "Review Photo"
              : facingMode === "user"
                ? "Front Camera"
                : "Back Camera"}
          </span>
          <button className="camera-close" onClick={onClose} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="camera-viewport">
          {isLoading && (
            <div className="camera-loading">
              <div className="cam-spinner" />
              <p>Starting camera...</p>
            </div>
          )}

          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-video ${facingMode === "user" ? "mirrored" : ""} ${isLoading ? "hidden" : ""}`}
            />
          ) : (
            <img
              src={capturedImage}
              alt="captured"
              className="camera-preview-img"
            />
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          {!capturedImage && !isLoading && (
            <div className="viewfinder">
              <span className="vf-tl" />
              <span className="vf-tr" />
              <span className="vf-bl" />
              <span className="vf-br" />
            </div>
          )}
        </div>

        <div className="camera-controls">
          {!capturedImage ? (
            <>
              <div className="cam-side-btn">
                {hasMultipleCameras && (
                  <button
                    className="cam-icon-btn"
                    onClick={switchCamera}
                    type="button"
                    title="Flip camera"
                    disabled={isLoading}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M1 4v6h6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 20v-6h-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                className="cam-shutter"
                onClick={capture}
                type="button"
                disabled={isLoading}
                title="Capture"
              >
                <span className="cam-shutter-inner" />
              </button>

              <div className="cam-side-btn">
                <span className="cam-mode-label">
                  {facingMode === "user" ? "Selfie" : "Back"}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                className="cam-action-btn retake"
                onClick={retake}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 4v6h6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.51 15a9 9 0 1 0 .49-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Retake
              </button>
              <button
                className="cam-action-btn accept"
                onClick={accept}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;