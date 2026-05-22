import re
from typing import Dict, Any, List

# Load the small english model for basic NER if spacy is available
# Note: Requires `python -m spacy download en_core_web_sm`
nlp = None
try:
    import spacy  # type: ignore
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Downloading spacy model...")
        import subprocess
        subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
        nlp = spacy.load("en_core_web_sm")
except ImportError:
    print("SpaCy is not installed. Using basic regex/first-line fallback for name extraction.")

def extract_email(text: str) -> str:
    email_pattern = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
    matches = email_pattern.findall(text)
    return matches[0] if matches else "Information not provided"

def extract_phone(text: str) -> str:
    phone_pattern = re.compile(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
    matches = phone_pattern.findall(text)
    return matches[0] if matches else "Information not provided"

def extract_name(text: str) -> str:
    # 1. Check the very first line of the text for the name
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        first_line = lines[0]
        # If the first line is 1-4 words and contains no numbers, it's highly likely the name
        if len(first_line.split()) <= 4 and not any(char.isdigit() for char in first_line):
            return first_line.title()

    # 2. Fallback to spacy NER if available
    if nlp is not None:
        try:
            doc = nlp(text)
            for ent in doc.ents:
                if ent.label_ == "PERSON":
                    return ent.text.strip()
        except Exception:
            pass

    # 3. Simple regex-based fallback for name extraction (e.g. Name: John Doe)
    name_match = re.search(r'(?:name|candidate)\s*:\s*([a-zA-Z\s]{2,30})', text, re.IGNORECASE)
    if name_match:
        return name_match.group(1).strip().title()

    return "Candidate Name"

def extract_years_experience(text: str) -> float:
    # Check for fresher keywords
    text_lower = text.lower()
    if "fresher" in text_lower or "no experience" in text_lower or "entry level" in text_lower:
        return 0.0

    # Look for patterns like "5 years", "3.5 years of experience"
    exp_pattern = re.compile(r'(\d+(?:\.\d+)?)\s*\+?\s*years?', re.IGNORECASE)
    matches = exp_pattern.findall(text)
    if matches:
        # Ignore wildly large numbers that might be years (e.g. 2019)
        valid_matches = [float(m) for m in matches if float(m) < 40]
        if valid_matches:
            return max(valid_matches)
            
    return 0.0  # Default fallback if not found

def extract_education(text: str) -> str:
    degrees = ["bachelor", "b.sc", "b.tech", "bba", "master", "m.sc", "mca", "mba", "phd"]
    text_lower = text.lower()
    found_degrees = [d for d in degrees if d in text_lower]
    if "phd" in found_degrees:
        return "PhD"
    if any(d in found_degrees for d in ["master", "m.sc", "mca", "mba"]):
        return "Master's"
    if any(d in found_degrees for d in ["bachelor", "b.sc", "b.tech", "bba"]):
        return "Bachelor's"
    return "Bachelor's" # Default

SOFT_SKILL_KEYWORDS = [
    "communication", "teamwork", "problem solving", "leadership", "critical thinking",
    "logical thinking", "time management", "adaptability", "creativity", "collaboration",
    "interpersonal", "presentation", "negotiation", "decision making", "work ethic"
]

LANGUAGE_KEYWORDS = [
    "english", "hindi", "kannada", "malayalam", "tamil", "telugu", "urdu",
    "french", "german", "arabic", "spanish", "native", "fluent", "conversational"
]

def extract_skills_by_section(text: str) -> dict:
    """Directly parse labeled skill sections from resume, returning a dict of {section: [skills]}."""
    section_map = {}
    section_headers = [
        "programming languages", "web technologies", "databases", "tools and platforms",
        "tools", "platforms", "frameworks", "technical skills", "soft skills",
        "technologies", "languages", "certifications"
    ]
    lines = text.split('\n')
    for line in lines:
        stripped = line.strip()
        stripped_lower = stripped.lower()
        for header in section_headers:
            if stripped_lower.startswith(header) and ':' in stripped:
                after_colon = stripped.split(':', 1)[1].strip()
                skills = [s.strip().strip('.') for s in re.split(r'[,;]', after_colon) if s.strip()]
                clean_skills = [s for s in skills if s and len(s) < 50]
                if clean_skills:
                    # Normalize header name for display
                    display = header.title()
                    section_map.setdefault(display, []).extend(clean_skills)
    return section_map


def extract_skills(text: str, dataset_skills: List[str]) -> dict:
    """Returns a dict with keys: sections (list of {name, skills}), softSkills, languages."""
    # Step 1: Extract directly from labeled sections
    by_section = extract_skills_by_section(text)

    # Programming/technical keywords to exclude from the Languages section
    TECH_KEYWORDS = {
        "python", "java", "javascript", "c", "c++", "c#", ".net", "sql", "html",
        "css", "react", "node", "typescript", "kotlin", "swift", "go", "rust",
        "php", "ruby", "perl", "scala", "r", "matlab"
    }

    technical_sections = []
    soft_from_sections = []
    lang_from_sections = []
    tools_combined = []  # merged tools & platforms
    for section_name, skills in by_section.items():
        sn_lower = section_name.lower()
        if "soft" in sn_lower:
            soft_from_sections.extend(skills)
        elif "language" in sn_lower:
            # Only keep human/spoken languages — filter out programming languages
            for skill in skills:
                if skill.lower().split()[0] not in TECH_KEYWORDS:
                    lang_from_sections.append(skill)
        elif "tool" in sn_lower or "platform" in sn_lower:
            # Merge all tool/platform sections into one
            tools_combined.extend(skills)
        else:
            technical_sections.append({"name": section_name, "skills": skills})

    # Add merged tools section once (deduplicated)
    if tools_combined:
        seen = []
        for s in tools_combined:
            if s not in seen:
                seen.append(s)
        technical_sections.append({"name": "Tools & Platforms", "skills": seen})

    # Step 3: Fallback keyword scan for any remaining technical skills not caught by sections
    text_lower = text.lower()
    all_technical_found = set(s for sec in technical_sections for s in sec["skills"])
    common_skills = [
        "python", "java", "javascript", "c++", "c", "c#", ".net", "sql", "mysql",
        "mongodb", "postgresql", "react", "node.js", "aws", "azure", "docker",
        "machine learning", "html", "css", "git", "tensorflow", "keras",
        "pandas", "numpy", "flask", "django", "typescript", "redis", "firebase"
    ]
    extra_technical = []
    for skill in common_skills:
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        if re.search(pattern, text_lower):
            # Only add if not already in a section
            matched = [s for s in all_technical_found if s.lower() == skill.lower()]
            if not matched:
                label = {"c++": "C++", "c#": "C#", "html": "HTML", "css": "CSS", "sql": "SQL", "aws": "AWS"}.get(skill, skill.title())
                extra_technical.append(label)
    if extra_technical:
        technical_sections.append({"name": "Other Skills", "skills": extra_technical})

    # Step 4: Fallback soft skills if none from sections
    if not soft_from_sections:
        soft_from_sections = []
        for kw in SOFT_SKILL_KEYWORDS:
            if kw in text_lower:
                soft_from_sections.append(kw.title())

    return {
        "sections": technical_sections,
        "softSkills": list(dict.fromkeys(soft_from_sections)),  # deduplicate preserving order
        "languages": list(dict.fromkeys(lang_from_sections)),
    }

def parse_resume_local(text: str, dataset_skills: List[str]) -> Dict[str, Any]:
    print("Parsing resume with local heuristics...")
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    years_exp = extract_years_experience(text)
    education = extract_education(text)
    skills = extract_skills(text, dataset_skills)
    
    seniority = "Entry"
    if years_exp >= 10:
        seniority = "Executive"
    elif years_exp >= 5:
        seniority = "Senior"
    elif years_exp >= 2:
        seniority = "Mid"
        
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "location": "Information not provided",
        "skills": skills.get("sections", []),
        "soft_skills": skills.get("softSkills", []),
        "languages": skills.get("languages", []),
        "tools_technologies": [],
        "certifications": [],
        "total_years_experience": years_exp,
        "primary_domain": "Technology & Business",
        "seniority": seniority,
        "highest_degree": education
    }
