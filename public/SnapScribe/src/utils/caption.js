import { STORAGE_KEY } from "./constants";

export const saveCaptionToLogs = (captionId, caption, tone, platform) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const newEntry = {
    captionId: captionId,
    caption: caption,
    tone: tone,
    platform: platform,
    timestamp: Date.now(),
  };

  const updated = [newEntry, ...existing];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getCaptionLogs = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const removeCaption = (captionId) => { 
  const captions = getCaptionLogs();
  const updatedCaptions = captions.filter(
    (caption) => caption.captionId !== captionId,
  ); 

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCaptions));
  return updatedCaptions;
};

export const clearCaptionLogs = () => {
  localStorage.removeItem(STORAGE_KEY);
};
