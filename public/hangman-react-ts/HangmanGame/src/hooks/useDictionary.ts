// src/hooks/useDictionary.ts
import { useCallback } from "react";

export type DictResult = {
  word: string;
  definition?: string;
  partOfSpeech?: string;
  synonyms?: string[];
  example?: string;
  // raw holds the original API response; use unknown instead of any for safer typing
  raw?: unknown;
};

const CACHE_KEY_PREFIX = "dict_cache_";
const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";

/** small helper: safe JSON parse */
function safeParse(s: string | null) {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
}

/** timeout wrapper for fetch */
function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeout = 8000) {
  return new Promise<Response>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    fetch(input, init)
      .then(res => { clearTimeout(timer); resolve(res); })
      .catch(err => { clearTimeout(timer); reject(err); });
  });
}

/** normalize and extract best definition/synonyms/example from API response */
// types for the dictionaryapi.dev response(partial)
type ApiDefinition = {
  definition?: string;
  example?: string;
  synonyms?: string[];
};

type ApiMeaning = {
  partOfSpeech?: string;
  definitions?: ApiDefinition[];
  synonyms?: string[];
};

type ApiEntry = {
  word?: string;
  meanings?: ApiMeaning[];
};

function isApiEntryArray(v: unknown): v is ApiEntry[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && v[0] !== null;
}

function parseDictionaryApiResponse(data: unknown): DictResult | null {
  if (!isApiEntryArray(data)) return null;
  const entry = data[0] as ApiEntry;
  const word = entry.word || "";
  const meanings = Array.isArray(entry.meanings) ? entry.meanings : [];

  // collect candidate definitions, synonyms, examples across meanings/definitions
  const defs: string[] = [];
  const synonymsSet = new Set<string>();
  let example: string | undefined;
  let partOfSpeech: string | undefined;

  for (const m of meanings) {
    if (!partOfSpeech && m.partOfSpeech) partOfSpeech = m.partOfSpeech;
    if (Array.isArray(m.synonyms)) {
      m.synonyms.forEach((s: string) => synonymsSet.add(s));
    }
    const defsArr = m.definitions || [];
    for (const d of defsArr) {
      if (d.definition) defs.push(d.definition);
      if (!example && d.example) example = d.example;
      if (Array.isArray(d.synonyms)) d.synonyms.forEach((s: string) => synonymsSet.add(s));
    }
  }

  const definition = defs.length ? defs[0] : undefined;
  const synonyms = Array.from(synonymsSet);

  return {
    word,
    definition,
    partOfSpeech,
    synonyms: synonyms.length ? synonyms : undefined,
    example,
    raw: data
  };
}

export default function useDictionary() {
  const fetchDefinition = useCallback(async (word: string): Promise<DictResult | null> => {
    if (!word) return null;
    const key = CACHE_KEY_PREFIX + word.toLowerCase();
    const cached = safeParse(sessionStorage.getItem(key));
    if (cached) return cached as DictResult;

    const encoded = encodeURIComponent(word.trim().toLowerCase());
    const url = API_BASE + encoded;

    try {
      const res = await fetchWithTimeout(url, {}, 8000);
      // dictionaryapi.dev returns 404 with JSON body when not found
      if (!res.ok) {
        // try to parse body for debugging, but treat as not found
        try {
          const body = await res.json();
          // store a small negative cache to avoid repeated calls for same missing word
          const negative = { word, definition: undefined, synonyms: undefined, raw: body };
          sessionStorage.setItem(key, JSON.stringify(negative));
          return null;
        } catch {
          sessionStorage.setItem(key, JSON.stringify({ word }));
          return null;
        }
      }

      const data = await res.json();
      const parsed = parseDictionaryApiResponse(data);
      if (parsed) {
        sessionStorage.setItem(key, JSON.stringify(parsed));
        return parsed;
      } else {
        sessionStorage.setItem(key, JSON.stringify({ word }));
        return null;
      }
    } catch (err) {
      // network error or timeout — do not spam the API, cache a short negative result
      console.warn("dictionary fetch error:", err);
      try { sessionStorage.setItem(key, JSON.stringify({ word })); } catch {
        // ignore storage errors
      }
      return null;
    }
  }, []);

  return { fetchDefinition };
}
