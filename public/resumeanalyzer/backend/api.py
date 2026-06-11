import os
import io
import re
from typing import AsyncGenerator
import pandas as pd
import PyPDF2
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from gemini_parser import parse_resume_gemini
from local_parser import parse_resume_local

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    load_and_clean_jobs()
    yield

app = FastAPI(lifespan=lifespan)

# Allow the React frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store dataset
JOBS_DF = None
UNIQUE_DATASET_SKILLS = []

# ---------------------------------------------------------------------------
# Resume Keyword Validator
# ---------------------------------------------------------------------------
# Keywords grouped by resume category. A real resume will hit multiple groups.
RESUME_KEYWORD_GROUPS = {
    "contact":    ["email", "phone", "mobile", "contact", "linkedin", "github", "address", "tel"],
    "experience": ["experience", "work history", "employment", "internship", "intern",
                   "company", "organisation", "organization", "employer", "worked at",
                   "responsibilities", "role", "position", "job"],
    "education":  ["education", "university", "college", "bachelor", "master", "b.tech",
                   "b.sc", "m.sc", "mba", "phd", "degree", "school", "academic",
                   "cgpa", "gpa", "grade"],
    "skills":     ["skills", "technical skills", "programming", "languages", "frameworks",
                   "tools", "technologies", "expertise", "proficiency", "certifications",
                   "projects", "achievements", "objective", "summary", "profile"],
}

def is_resume_document(text: str) -> bool:
    """
    Returns True if the text looks like a resume based on keyword coverage.

    Rules:
    - The 'contact' group is MANDATORY. A real resume always has at least one
      contact signal (email address pattern, phone number, LinkedIn, GitHub).
      Lab reports, medical records, and project reports NEVER have personal
      contact info, so they fail immediately here.
    - Additionally, at least 1 of the remaining 3 groups (experience, education,
      skills) must also match — so a plain contact card alone won't pass.
    """
    text_lower = text.lower()

    # Check for actual email address pattern (strongest signal)
    has_email = bool(re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text))

    # Check contact group keywords
    contact_keywords = RESUME_KEYWORD_GROUPS["contact"]
    has_contact_keyword = any(kw in text_lower for kw in contact_keywords)

    contact_matched = has_email or has_contact_keyword
    print(f"  [resume-check] 'contact' group: {'MATCHED' if contact_matched else 'NOT MATCHED'} "
          f"(email={has_email}, keyword={has_contact_keyword})")

    # Contact is MANDATORY — fail immediately if missing
    if not contact_matched:
        print("  [resume-check] FAIL: No contact information found. Not a resume.")
        return False

    # Check remaining groups
    other_groups = ["experience", "education", "skills"]
    other_matched = 0
    for group_name in other_groups:
        if any(kw in text_lower for kw in RESUME_KEYWORD_GROUPS[group_name]):
            other_matched += 1
            print(f"  [resume-check] '{group_name}' group MATCHED")
        else:
            print(f"  [resume-check] '{group_name}' group not matched")

    print(f"  [resume-check] Other groups matched: {other_matched}/3")
    # Need contact + at least 1 more group
    return other_matched >= 1

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    text = ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        # If it fails, maybe it's a text file
        return file_bytes.decode('utf-8', errors='ignore')

def load_and_clean_jobs():
    global JOBS_DF, UNIQUE_DATASET_SKILLS
    csv_path = "resume_data.csv"
    if not os.path.exists(csv_path):
        print(f"Dataset {csv_path} not found.")
        return
        
    df = pd.read_csv(csv_path)
    job_cols = [
        '﻿job_position_name', 'educationaL_requirements', 
        'experiencere_requirement', 'age_requirement', 
        'responsibilities.1', 'skills_required'
    ]
    df = df.rename(columns={'﻿job_position_name': 'job_position_name'})
    
    # FIX: Drop jobs that are missing a name OR critical skills required for compatibility mapping
    jobs_df = df.dropna(subset=['job_position_name', 'skills_required']).copy()
    jobs_df = jobs_df[jobs_df['skills_required'].astype(str).str.strip() != '']
    jobs_df = jobs_df.drop_duplicates(subset=['job_position_name', 'skills_required'])
    
    # Extract unique skills from dataset for the local parser
    skills_set = set()
    for skills_str in jobs_df['skills_required'].dropna():
        # Split by comma or newline
        skills = [s.strip() for s in re.split(r'[,\n]', str(skills_str)) if s.strip()]
        skills_set.update(skills)
        
    UNIQUE_DATASET_SKILLS = list(skills_set)
    JOBS_DF = jobs_df
    print(f"Loaded {len(JOBS_DF)} unique jobs and {len(UNIQUE_DATASET_SKILLS)} unique skills.")

def extract_required_years(exp_str):
    if pd.isna(exp_str):
        return 0
    matches = re.findall(r'\d+', str(exp_str))
    if matches:
        return float(matches[0])
    return 0

# ---------------------------------------------------------------------------
# Career Domains & Skills Matching Helpers
# ---------------------------------------------------------------------------
CAREER_DOMAINS = {
    "software": [
        "software", "ios", "ai", "developer", "devops", "data science", "data engineer", 
        "database", "dba", "system admin", "system administrator", "server", "network", 
        "support", "it", "computer", "programming", "python", "java", "react"
    ],
    "mechanical": [
        "mechanical", "designer", "solidworks", "cad"
    ],
    "civil": [
        "civil", "construction", "site engineer", "etabs", "autocad", "architect"
    ],
    "marketing": [
        "marketing", "brand", "campaign", "sales", "trade marketing", "seo", "advertising", 
        "business development", "bd"
    ],
    "hr_admin": [
        "hr", "human resource", "hrm", "administration", "administrative", "office", "management trainee"
    ],
    "finance_audit": [
        "audit", "internal audit", "vat", "tax", "compliance", "finance", "accounting", "cacc", "accounts"
    ]
}

def get_career_domains(text: str) -> set:
    text_lower = text.lower()
    matched_domains = set()
    for domain, keywords in CAREER_DOMAINS.items():
        for kw in keywords:
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, text_lower):
                matched_domains.add(domain)
    return matched_domains

def get_candidate_domains(candidate) -> set:
    cand_text = str(candidate.get('primary_domain', ''))
    tools = candidate.get('tools_technologies', []) or []
    cand_text += " " + " ".join(str(t) for t in tools if t)
    raw_skills = candidate.get('skills', []) or []
    if raw_skills and isinstance(raw_skills[0], dict):
        flat_skills = [s for section in raw_skills for s in section.get('skills', []) if s]
    else:
        flat_skills = raw_skills
    cand_text += " " + " ".join(str(s) for s in flat_skills if s)
    return get_career_domains(cand_text)

def is_boundary_char(ch: str) -> bool:
    return not (ch.isalnum() or ch in {'+', '#'})

def skill_matches_phrase(sub: str, main: str) -> bool:
    sub = sub.strip().lower()
    main = main.strip().lower()
    if not sub or not main:
        return False
    if sub == main:
        return True
        
    start = 0
    while True:
        pos = main.find(sub, start)
        if pos == -1:
            break
            
        if pos == 0:
            before_ok = True
        else:
            before_ok = is_boundary_char(main[pos - 1])
            
        after_pos = pos + len(sub)
        if after_pos == len(main):
            after_ok = True
        else:
            after_ok = is_boundary_char(main[after_pos])
            
        if before_ok and after_ok:
            return True
            
        start = pos + 1
        
    return False

def canonicalize_skill(skill: str) -> str:
    skill = skill.lower().strip()
    
    synonyms_map = {
        "hr": "human resources",
        "hrm": "human resources",
        "human resource": "human resources",
        "human resource management": "human resources",
        "human resources management": "human resources",
        "project manager": "project management",
        "project management": "project management",
        "project coordinator": "project management",
        "database": "db",
        "databases": "db",
        "dba": "db admin",
        "machine learning": "ml",
        "artificial intelligence": "ai",
        "deep learning": "dl",
        "natural language processing": "nlp",
        "amazon web services": "aws",
        "google cloud platform": "gcp",
        "javascript": "js",
        "typescript": "ts",
        "reactjs": "react",
        "react.js": "react",
        "nodejs": "node",
        "node.js": "node",
    }
    
    if skill in synonyms_map:
        return synonyms_map[skill]
        
    cleaned = re.sub(r'\b(management|specialist|officer|report|developer|engineer|system|administrator|admin|coordinator)\b', '', skill)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    if cleaned in synonyms_map:
        return synonyms_map[cleaned]
        
    return cleaned if cleaned else skill

def match_skills(cand_skill: str, job_skill: str) -> bool:
    c_norm = cand_skill.lower().strip()
    j_norm = job_skill.lower().strip()
    if not c_norm or not j_norm:
        return False
        
    if c_norm == j_norm:
        return True
        
    # Handle "sql" exceptions (e.g. MySQL, PostgreSQL, NoSQL, SQLite)
    if c_norm == "sql" or j_norm == "sql":
        if c_norm == "sql" and ("sql" in j_norm):
            return True
        if j_norm == "sql" and ("sql" in c_norm):
            return True

    c_canon = canonicalize_skill(cand_skill)
    j_canon = canonicalize_skill(job_skill)
    if c_canon == j_canon:
        return True
        
    if skill_matches_phrase(c_canon, j_canon) or skill_matches_phrase(j_canon, c_canon):
        return True
    if skill_matches_phrase(c_norm, j_norm) or skill_matches_phrase(j_norm, c_norm):
        return True
        
    return False

def calculate_compatibility(candidate, job):
    # candidate['skills'] is a list of {name, skills} dicts — flatten to a flat list
    raw_skills = candidate.get('skills', [])
    if raw_skills and isinstance(raw_skills[0], dict):
        flat_skills = [s for section in raw_skills for s in section.get('skills', [])]
    else:
        flat_skills = raw_skills
        
    # Merge tools and technologies to make technical skills matching much more robust
    tools = candidate.get('tools_technologies', []) or []
    all_cand_skills = flat_skills + tools
    cand_skills = [s.lower() for s in all_cand_skills]
    
    # 🚨 Non-Resume Document Detector:
    # A real resume always has at least one contact channel (email or phone).
    # Lab reports, medical documents, project reports, etc. never have email/phone.
    # Flag as non-resume if BOTH email AND phone are missing — even if Gemini
    # falsely extracted "skills" from medical/technical jargon in the document.
    email_missing = str(candidate.get('email', '')).lower() in ['not provided', 'information not provided', '', 'none']
    phone_missing = str(candidate.get('phone', '')).lower() in ['not provided', 'information not provided', '', 'none']
    is_non_resume = email_missing and phone_missing
    if is_non_resume:
        return {
            'jobTitle': str(job['job_position_name']),
            'company': 'Company N/A',
            'compatibilityScore': 0,
            'scoreBreakdown': {
                'skillsMatch': 0,
                'experienceMatch': 0,
                'educationMatch': 0,
                'industryMatch': 0
            },
            'matchingSkills': [],
            'skillGaps': [s.strip() for s in re.split(r'[,\n]', str(job['skills_required'])) if s.strip()] if not pd.isna(job['skills_required']) else [],
            'whyThisJobFits': "This document does not appear to be a resume (no contact information found).",
            'preparationSteps': ["Please upload a valid resume containing your name, email/phone, and professional skills."]
        }
    
    # If candidate has absolutely zero skills extracted (e.g. blank document or medical report), fail skills score immediately!
    if not cand_skills:
        skills_score = 0
        matched_skills_list = []
        skills_matched_pct = 0
        skill_gaps = [s.strip() for s in re.split(r'[,\n]', str(job['skills_required'])) if s.strip()] if not pd.isna(job['skills_required']) else []
    else:
        job_skills_raw = str(job['skills_required'])
        if job_skills_raw.lower() in ['nan', 'none', '']:
            skills_score = 0
            matched_skills_list = []
            skills_matched_pct = 0
            skill_gaps = []
        else:
            job_skills = [s.strip() for s in re.split(r'[,\n]', job_skills_raw) if s.strip()]
            if not job_skills:
                skills_score = 0
                matched_skills_list = []
                skills_matched_pct = 0
                skill_gaps = []
            else:
                matches = [s for s in job_skills if any(match_skills(cs, s) for cs in cand_skills)]
                skills_matched_pct = (len(matches) / len(job_skills)) * 100
                skills_score = (skills_matched_pct / 100) * 40
                matched_skills_list = matches
                skill_gaps = [s for s in job_skills if s not in matches]
                
    req_years = extract_required_years(job['experiencere_requirement'])
    cand_years = candidate.get('total_years_experience', 0)
    
    if cand_years == 0:
        exp_score = 0
    elif req_years == 0 or cand_years >= req_years:
        exp_score = 30
    else:
        exp_score = (cand_years / req_years) * 30
        
    req_edu = str(job['educationaL_requirements']).lower()
    cand_edu = str(candidate.get('highest_degree', '')).lower()
    
    edu_score = 0
    if req_edu in ['nan', 'none', '']:
        edu_score = 15
    else:
        if 'bachelor' in cand_edu:
            if 'master' not in req_edu: edu_score = 15
            else: edu_score = 10
        elif 'master' in cand_edu or 'phd' in cand_edu:
            edu_score = 15
        else:
            edu_score = 10
            
    # Dynamic Industry/Domain score based on candidate's primary domain (No longer hardcoded!)
    industry_score = 0
    job_title = str(job['job_position_name']).lower()
    cand_primary = str(candidate.get('primary_domain', '')).lower()
    
    if cand_primary and any(kw in job_title for kw in cand_primary.split()):
        industry_score = 15
    elif any(kw in job_title for kw in ['management', 'lead', 'director', 'executive'] if kw in cand_primary):
        industry_score = 15
        
    total_score = skills_score + exp_score + edu_score + industry_score
    
    # Specialized Domain filter mismatch penalty:
    # Prevent candidates with completely unrelated domains from matching specialized roles.
    job_domains = get_career_domains(job_title)
    cand_domains = get_candidate_domains(candidate)
    if job_domains:
        has_matching_domain = bool(job_domains & cand_domains)
        if not has_matching_domain:
            total_score = min(total_score, 10)  # Caps total compatibility score at 10%
            skills_score = 0
            exp_score = 0
            edu_score = min(edu_score, 5)
            industry_score = 0
            
    return {
        'jobTitle': str(job['job_position_name']),
        'company': 'Company N/A', # Missing from jobs side of CSV
        'compatibilityScore': round(total_score),
        'scoreBreakdown': {
            'skillsMatch': round(skills_score),
            'experienceMatch': round(exp_score),
            'educationMatch': round(edu_score),
            'industryMatch': round(industry_score)
        },
        'matchingSkills': matched_skills_list,
        'skillGaps': skill_gaps,
        'whyThisJobFits': f"Matched {round(skills_matched_pct)}% of required skills. " + ("Strong match based on experience." if exp_score == 30 else "Consider gaining more experience."),
        'preparationSteps': [f"Focus on learning: {g}" for g in skill_gaps[:3]] if skill_gaps else ["You are highly qualified for this role!"]
    }

# Clean job loading is now handled by the lifespan context manager.

@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if JOBS_DF is None:
        raise HTTPException(status_code=500, detail="Job dataset not loaded.")
        
    file_bytes = await file.read()
    text = extract_text_from_pdf_bytes(file_bytes)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # 1. Keyword-based resume check — BEFORE any parsing
    print(f"\n[resume-check] Running keyword validation on uploaded file...")
    if not is_resume_document(text):
        print("[resume-check] ❌ Document does NOT look like a resume. Returning 0% scores.")
        # Build a zero-score response directly without parsing
        zero_jobs = []
        for _, job in JOBS_DF.iterrows():
            job_skills = [s.strip() for s in re.split(r'[,\n]', str(job['skills_required'])) if s.strip()] \
                         if not pd.isna(job['skills_required']) else []
            zero_jobs.append({
                'jobTitle': str(job['job_position_name']),
                'company': 'Company N/A',
                'compatibilityScore': 0,
                'scoreBreakdown': {'skillsMatch': 0, 'experienceMatch': 0, 'educationMatch': 0, 'industryMatch': 0},
                'matchingSkills': [],
                'skillGaps': job_skills,
                'whyThisJobFits': "The uploaded file does not appear to be a resume.",
                'preparationSteps': ["Please upload a proper resume (CV) with your contact info, education, experience, and skills."]
            })
        zero_jobs.sort(key=lambda x: x['jobTitle'])
        top_5 = zero_jobs[:5]
        return {
            "candidateProfile": {
                "name": "Unknown",
                "email": "Not a resume",
                "phone": "Not a resume",
                "education": "N/A",
                "extractedText": text,
                "totalExperience": "0 years",
                "primaryDomain": "N/A",
                "seniority": "N/A",
                "extractedSkills": {"sections": [], "softSkills": [], "languages": [], "certifications": []}
            },
            "topMatches": [{"job": {"jobTitle": j['jobTitle'], "company": j['company']}, **j} for j in top_5],
            "careerInsights": {
                "strongestPath": "N/A",
                "recommendedSkills": [],
                "uniqueStrengths": [],
                "expectedSalaryRange": "N/A"
            },
            "overallAssessment": "⚠️ The uploaded file does not appear to be a resume. It is missing key resume sections (contact info, experience, education, skills). Please upload a proper CV/resume to get job match results."
        }
    print("[resume-check] ✅ Document looks like a resume. Proceeding with parsing.")

    # 2. Parse Resume (uses Gemini if key is set and valid, otherwise falls back to local parser)
    gemini_key = os.environ.get("GEMINI_API_KEY")
    used_gemini = False
    
    if gemini_key and gemini_key.strip() and not gemini_key.startswith("your_gemini_api_key"):
        try:
            candidate = parse_resume_gemini(text, UNIQUE_DATASET_SKILLS)
            # If Gemini parser failed internally and returned the empty fallback profile, try the local parser instead
            if candidate.get("name") != "Candidate Name" or len(candidate.get("skills", [])) > 0:
                used_gemini = True
            else:
                print("Gemini parser returned fallback profile, trying local parser...")
                candidate = parse_resume_local(text, UNIQUE_DATASET_SKILLS)
        except Exception as e:
            print(f"Gemini parsing failed, falling back to local: {e}")
            candidate = parse_resume_local(text, UNIQUE_DATASET_SKILLS)
    else:
        print("GEMINI_API_KEY not configured or placeholder. Using local parser.")
        candidate = parse_resume_local(text, UNIQUE_DATASET_SKILLS)
    
    # 2. Score jobs
    scored_jobs = []
    for _, job in JOBS_DF.iterrows():
        score_data = calculate_compatibility(candidate, job)
        scored_jobs.append(score_data)
        
    scored_jobs.sort(key=lambda x: x['compatibilityScore'], reverse=True)
    top_5_jobs = scored_jobs[:5]
    
    # 3. Format as AnalysisResult for the React frontend
    avg_score = sum(j['compatibilityScore'] for j in top_5_jobs) / 5 if top_5_jobs else 0
    
    response = {
        "candidateProfile": {
            "name": candidate['name'],
            "email": candidate['email'],
            "phone": candidate['phone'],
            "education": candidate.get('highest_degree', 'N/A'),
            "extractedText": text,
            "totalExperience": f"{candidate['total_years_experience']} years",
            "primaryDomain": candidate['primary_domain'],
            "seniority": candidate['seniority'],
            "extractedSkills": {
                "sections": candidate['skills'],
                "softSkills": candidate['soft_skills'],
                "languages": candidate.get('languages', []),
                "certifications": candidate['certifications']
            }
        },
        "topMatches": [{"job": {"jobTitle": j['jobTitle'], "company": j['company']}, **j} for j in top_5_jobs],
        "careerInsights": {
            "strongestPath": f"{candidate['primary_domain']} -> {candidate['seniority']} Level",
            "recommendedSkills": (lambda flat: ["Cloud Native", "Advanced Data Analysis", "Leadership"] if not flat else ["Advanced " + flat[0], "Leadership"])(
                [s for section in candidate['skills'] for s in section.get('skills', [])] if candidate['skills'] and isinstance(candidate['skills'][0], dict) else candidate['skills']
            ),
            "uniqueStrengths": [f"Demonstrated experience over {candidate['total_years_experience']} years", "Strong alignment with local market demands"],
            "expectedSalaryRange": "$60K - $120K based on experience"
        },
        "overallAssessment": f"Based on {'AI-powered analysis (Gemini)' if used_gemini else 'local heuristic-based analysis'}, the candidate has an average compatibility score of {round(avg_score)}% for the top matched roles in the dataset. Focus on the identified skill gaps to improve matching potential."
    }
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
