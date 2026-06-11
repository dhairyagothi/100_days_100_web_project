import os
import json
import re
from pathlib import Path
from typing import Dict, Any, List
from dotenv import load_dotenv
from google import genai     

# Load .env from the backend directory (works regardless of where uvicorn is launched from)
load_dotenv(Path(__file__).parent / ".env")
from google.genai import types

# ---------------------------------------------------------------------------
# Module-level Gemini client — initialised once on first use (lazy)
# ---------------------------------------------------------------------------
_client = None

def _get_client():
    """Return a cached google.genai.Client, configuring on first call."""
    global _client
    if _client is not None:
        return _client

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY environment variable is not set. "
            "Please set it before starting the server.\n"
            "  Windows PowerShell : $env:GEMINI_API_KEY='your_key'\n"
            "  Windows CMD         : set GEMINI_API_KEY=your_key"
        )
    _client = genai.Client(api_key=api_key)
    return _client


# ---------------------------------------------------------------------------
# Model to use (gemini-2.0-flash is fast, cheap, and very capable)
# ---------------------------------------------------------------------------
_MODEL = "gemini-2.0-flash"

# ---------------------------------------------------------------------------
# Prompt
# ---------------------------------------------------------------------------
_PARSE_PROMPT = """
You are an expert resume parser. Extract the following information from the provided resume text and return ONLY a valid JSON object — no markdown fences, no extra text, nothing else.

JSON Schema:
{
  "name": "string (full candidate name, or 'Not Provided')",
  "email": "string (or 'Not Provided')",
  "phone": "string (or 'Not Provided')",
  "location": "string (city, state/country, or 'Not Provided')",
  "skills": [
    {
      "name": "section name (e.g. 'Programming Languages', 'Frameworks', 'Databases')",
      "skills": ["list", "of", "skills"]
    }
  ],
  "soft_skills": ["list of soft skill strings"],
  "languages": ["list of spoken/human language strings"],
  "tools_technologies": ["list of tool/platform strings"],
  "certifications": ["list of certification strings"],
  "total_years_experience": 0.0,
  "primary_domain": "string (e.g. 'Software Engineering', 'Data Science', 'Marketing')",
  "seniority": "string — one of: Entry, Mid, Senior, Executive",
  "highest_degree": "string (e.g. Bachelor's, Master's, PhD)"
}

Rules:
- total_years_experience: compute from work history dates if available; otherwise estimate from context. Return a float (e.g. 3.5).
- skills: group technical skills into logical sections. Never put spoken languages here.
- soft_skills: only interpersonal/behavioural traits (e.g. "Communication", "Teamwork").
- languages: only spoken/human languages (e.g. "English", "Hindi"). Do NOT include programming languages here.
- certifications: only formal certificates or courses (e.g. "AWS Certified Developer").
- If a field cannot be determined, use "Not Provided" for strings, [] for lists, and 0.0 for numbers.

Resume Text:
"""


# ---------------------------------------------------------------------------
# Public API — drop-in replacement for local_parser.parse_resume_local
# ---------------------------------------------------------------------------
def parse_resume_gemini(text: str, dataset_skills: List[str] = None) -> Dict[str, Any]:
    """
    Parse a resume using the Gemini API and return a structured dict
    compatible with the format expected by api.py.

    Parameters
    ----------
    text : str
        Raw text extracted from the resume PDF/TXT.
    dataset_skills : List[str]
        (Unused — kept for API compatibility with local_parser)

    Returns
    -------
    dict with keys: name, email, phone, location, skills, soft_skills,
                    languages, tools_technologies, certifications,
                    total_years_experience, primary_domain, seniority, highest_degree
    """
    print("Parsing resume with Gemini API...")
    client = _get_client()

    prompt = _PARSE_PROMPT + text

    try:
        response = client.models.generate_content(
            model=_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,   # low temperature for deterministic extraction
            ),
        )
        res_text = response.text.strip()
    except Exception as e:
        print(f"Gemini API error: {e}")
        return _fallback_profile()

    # Strip optional markdown code fences that the model might add
    res_text = re.sub(r"^```(?:json)?\s*", "", res_text)
    res_text = re.sub(r"\s*```$", "", res_text.strip())

    try:
        data = json.loads(res_text)
    except json.JSONDecodeError as exc:
        print(f"Failed to parse Gemini JSON response: {exc}")
        print("Raw response (first 500 chars):", res_text[:500])
        return _fallback_profile()

    return _normalise(data)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _normalise(data: dict) -> Dict[str, Any]:
    """Ensure every key the rest of the app expects is present and typed correctly."""

    # skills must be a list of {name, skills} dicts
    raw_skills = data.get("skills", [])
    if raw_skills and isinstance(raw_skills[0], str):
        # Gemini returned a flat list — wrap it into one section
        raw_skills = [{"name": "Technical Skills", "skills": raw_skills}]

    # Clamp experience to a reasonable range
    years_exp = float(data.get("total_years_experience") or 0.0)
    years_exp = max(0.0, min(years_exp, 50.0))

    # Derive seniority if missing or unexpected value
    seniority = str(data.get("seniority", "")).strip()
    if seniority not in ("Entry", "Mid", "Senior", "Executive"):
        if years_exp >= 10:
            seniority = "Executive"
        elif years_exp >= 5:
            seniority = "Senior"
        elif years_exp >= 2:
            seniority = "Mid"
        else:
            seniority = "Entry"

    return {
        "name":                   data.get("name") or "Candidate Name",
        "email":                  data.get("email") or "Not Provided",
        "phone":                  data.get("phone") or "Not Provided",
        "location":               data.get("location") or "Not Provided",
        "skills":                 raw_skills,
        "soft_skills":            data.get("soft_skills") or [],
        "languages":              data.get("languages") or [],
        "tools_technologies":     data.get("tools_technologies") or [],
        "certifications":         data.get("certifications") or [],
        "total_years_experience": years_exp,
        "primary_domain":         data.get("primary_domain") or "Technology",
        "seniority":              seniority,
        "highest_degree":         data.get("highest_degree") or "Bachelor's",
    }


def _fallback_profile() -> Dict[str, Any]:
    """Return a safe empty profile when Gemini fails (e.g. network error)."""
    return {
        "name": "Candidate Name",
        "email": "Not Provided",
        "phone": "Not Provided",
        "location": "Not Provided",
        "skills": [],
        "soft_skills": [],
        "languages": [],
        "tools_technologies": [],
        "certifications": [],
        "total_years_experience": 0.0,
        "primary_domain": "Technology",
        "seniority": "Entry",
        "highest_degree": "Bachelor's",
    }
