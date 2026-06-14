import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tones = [
  { value: "fun", label: "Fun" },
  { value: "romantic", label: "Romantic" },
  { value: "inspirational", label: "Inspirational" },
  { value: "sassy", label: "Sassy" },
  { value: "aesthetic", label: "Aesthetic" },
  { value: "professional", label: "Professional" },
  { value: "witty", label: "Witty" },
  { value: "chill", label: "Chill" },
  { value: "luxury", label: "Luxury" },
  { value: "dark humor", label: "Dark Humor" },
  { value: "nostalgic", label: "Nostalgic" },
];

const Selector = memo(({ handleToneChange }) => {
  return (
    <Select
      onValueChange={handleToneChange}
      defaultValue="fun" 
    >
      <SelectTrigger className="tone-select-trigger">
        <SelectValue placeholder="Select tone" />
      </SelectTrigger>
      <SelectContent className="tone-select-content">
        {tones.map((t) => (
          <SelectItem
            key={t.value}
            value={t.value}
            className="tone-select-item"
          >
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

export default Selector;
