export function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt is required.");
  }

  if (prompt.trim().length === 0) {
    throw new Error("Prompt cannot be empty.");
  }

  if (prompt.length > 2000) {
    throw new Error(
      "Prompt exceeds maximum length of 2000 characters."
    );
  }

  return true;
}