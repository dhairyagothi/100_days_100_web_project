import { resizeImage } from "../utils/imageResolution";
import { generateCaptionDirect } from "./mistralClient";
import { saveCaptionToLogs } from "@/utils/caption";

export const generatePrompt = async (prompt, tone, uploadedFile, platform) => {
  let imageBase64 = null;

  if (uploadedFile) { 
    imageBase64 = await resizeImage(uploadedFile);
  }

  const caption = await generateCaptionDirect({
    prompt,
    tone,
    platform,
    imageBase64,
  });
  const captionId =  crypto.randomUUID();
  saveCaptionToLogs(captionId, caption, tone, platform);

  return {
    captionId,
    caption,
    platform,
    tone,
  };
};