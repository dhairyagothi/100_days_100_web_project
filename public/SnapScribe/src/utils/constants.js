export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
export const TIMEOUT_MS = 30000;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const STORAGE_KEY = "caption_logs";
