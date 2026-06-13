import { memo } from "react";

const Input = memo(({ prompt, setPrompt }) => {
  return (
    <input
      type="text"
      name="prompt"
      id="prompt"
      placeholder="Describe the vibe, scene, or your story..."
      className="prompt-input"
      onChange={(e) => setPrompt(e.target.value)}
      autoComplete="off"
      value={prompt}
    />
  );
});

export default Input;
