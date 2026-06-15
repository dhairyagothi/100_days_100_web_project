import Input from "./ui/Input";
import FileUploader from "./FileUploader";
import Selector from "./Selector";
import PlatformSelector from "./PlatformSelector";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useGenerateCaption from "@/hooks/useGenerateCaption";

const CaptionUploader = ({ setCaptionLogs }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("fun");
  const [platform, setPlatform] = useState("instagram");

  const { mutate, isPending } = useGenerateCaption(setCaptionLogs);

  const handleToneChange = useCallback((val) => setTone(val), []);
  const handlePlatformChange = useCallback((val) => setPlatform(val), []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (prompt.trim() === "" && !uploadedFile) {
        toast.info("Please provide either a prompt or upload an image. 🥺");
        return;
      }
      mutate({ prompt, tone, uploadedFile, platform });
    },
    [prompt, tone, uploadedFile, platform, mutate]
  );

  const canGenerate = prompt.trim() !== "" || !!uploadedFile;

  return (
    <form onSubmit={handleSubmit} className="uploader-form">
      <div className="uploader-top-row">
        <div className="uploader-image-col">
          <label className="field-label">Image</label>
          <FileUploader uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
        </div>
        <div className="uploader-right-col">
          <label className="field-label">Tone</label>
          <Selector handleToneChange={handleToneChange} />
        </div>
      </div>

      <div className="platform-section">
        <label className="field-label">Platform</label>
        <PlatformSelector selected={platform} onChange={handlePlatformChange} />
      </div>

      <div className="prompt-section">
        <label className="field-label" htmlFor="prompt">Caption Prompt</label>
        <Input prompt={prompt} setPrompt={setPrompt} />
      </div>

      <button
        type="submit"
        disabled={!canGenerate || isPending}
        className={`generate-btn ${isPending ? "loading" : ""}`}
        title="Generate caption"
      >
        {isPending ? (
          <>
            <span className="btn-dots">
              <span /><span /><span />
            </span>
            Generating...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Generate Caption
          </>
        )}
      </button>
    </form>
  );
};

export default CaptionUploader;