import React, { useEffect, useState } from "react";
import {
  getMistralApiKey,
  saveMistralApiKey,
  clearMistralApiKey,
} from "../api/mistralClient";

const Settings = ({ isOpen, onClose }) => {
  const [keyInput, setKeyInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const existing = getMistralApiKey();
        // Show masked version so the user knows a key exists
        setKeyInput(existing ? "••••••••••••••••" + existing.slice(-4) : "");
        setHasKey(!!existing);
      } catch {
        setKeyInput("");
        setHasKey(false);
      }
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmed = keyInput.trim();
    // Don't save if it's still the masked placeholder
    if (!trimmed || trimmed.startsWith("••")) return;
    saveMistralApiKey(trimmed);
    setHasKey(true);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearMistralApiKey();
    setKeyInput("");
    setHasKey(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };
  return (
    <>
      <label htmlFor="api-key-input" className="settings-label">
        Mistral API Key
      </label>
      <p className="settings-hint">
        Your key is stored only in this browser and never sent anywhere except
        directly to Mistral's API.{" "}
        <a
          href="https://console.mistral.ai/api-keys"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get a key 
        </a>
      </p>
      <input
        id="api-key-input"
        type="password"
        className="settings-input"
        placeholder="Enter your Mistral API key..."
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        onFocus={() => {
          // Clear the masked placeholder so user can type fresh
          if (keyInput.startsWith("••")) setKeyInput("");
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />

      <div className="settings-actions">
        <button
          className={`settings-save-btn ${saved ? "saved" : ""}`}
          onClick={handleSave}
          disabled={!keyInput.trim() || keyInput.startsWith("••")}
        >
          {saved ? "✓ Saved!" : "Save Key"}
        </button>
        {hasKey && (
          <button className="settings-clear-btn" onClick={handleClear}>
            Remove Key
          </button>
        )}
      </div>
    </>
  );
};

export default Settings;
