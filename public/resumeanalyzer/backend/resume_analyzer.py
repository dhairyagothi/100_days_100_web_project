import os
import sys
import json
import re
import pandas as pd
import PyPDF2
import google.generativeai as genai

def setup_genai():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY environment variable not set.")
        print("Please set it using: set GEMINI_API_KEY=your_key")
        sys.exit(1)
    genai.configure(api_key=api_key)
    # Using Gemini 1.5 Pro as it's highly capable for structured extraction
    return genai.GenerativeModel('gemini-1.5-pro')

def extract_text_from_file(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File {file_path} not found.")
    
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.pdf':
        text = ""
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text
    elif ext in ['.txt', '.md', '.csv']:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        raise ValueError("Unsupported file format. Please use PDF or TXT.")

def parse_resume_with_llm(model, resume_text):
    print("Extracting structured information from resume using LLM...")
    prompt = """
    You are an expert resume parser. Extract the following information from the provided resume text.
    Return ONLY a valid JSON object with the following schema:
    {
        "name": "string (or 'Not Provided')",
        "email": "string (or 'Not Provided')",
        "phone": "string (or 'Not Provided')",
        "location": "string (or 'Not Provided')",
        "skills": ["list of strings", ...],
        "soft_skills": ["list of strings", ...],
        "tools_technologies": ["list of strings", ...],
        "certifications": ["list of strings", ...],
        "total_years_experience": float (calculate based on work history dates, e.g. 4.5),
        "primary_domain": "string",
        "seniority": "string (e.g. Entry, Mid, Senior)",
        "highest_degree": "string (e.g. Bachelor's, Master's, PhD)"
    }
    
    Resume Text:
    """ + resume_text
    
    response = model.generate_content(prompt)
    
    # Clean the response to ensure it's valid JSON
    res_text = response.text.strip()
    if res_text.startswith("```json"):
        res_text = res_text[7:-3]
    elif res_text.startswith("```"):
        res_text = res_text[3:-3]
        
    try:
        return json.loads(res_text.strip())
    except json.JSONDecodeError:
        print("Failed to decode JSON from LLM response. Raw response:")
        print(res_text)
        sys.exit(1)

def load_and_clean_jobs(csv_path):
    print(f"Loading job dataset from {csv_path}...")
    df = pd.read_csv(csv_path)
    
    # The dataset contains candidate & job info per row. We only want unique jobs.
    job_cols = [
        '﻿job_position_name', 'educationaL_requirements', 
        'experiencere_requirement', 'age_requirement', 
        'responsibilities.1', 'skills_required'
    ]
    
    # Rename for easier access
    df = df.rename(columns={'﻿job_position_name': 'job_position_name'})
    job_cols[0] = 'job_position_name'
    
    # Drop rows without a job title
    jobs_df = df.dropna(subset=['job_position_name']).copy()
    
    # Drop duplicates to get unique jobs
    jobs_df = jobs_df.drop_duplicates(subset=['job_position_name', 'skills_required'])
    
    print(f"Found {len(jobs_df)} unique jobs in the dataset.")
    return jobs_df

def extract_required_years(exp_str):
    if pd.isna(exp_str):
        return 0
    # Try to find numbers in the string e.g. "At least 1 year", "2 to 5 years"
    matches = re.findall(r'\d+', str(exp_str))
    if matches:
        return float(matches[0])
    return 0

def calculate_compatibility(candidate, job):
    # FILTER: Skip jobs with domain-specific keywords if candidate doesn't have them
    cand_primary = str(candidate.get('primary_domain', '')).lower()
    cand_skills = [s.lower() for s in candidate.get('skills', []) + candidate.get('tools_technologies', [])]
    job_title = str(job['job_position_name']).lower()
    
    # If job requires specialized domain (mechanical, engineering, medical, etc.) 
    # but candidate doesn't have it, drastically reduce score or skip
    domain_keywords = ['mechanical', 'engineering', 'medical', 'healthcare', 'automotive', 'manufacturing']
    has_domain_keyword = any(kw in job_title for kw in domain_keywords)
    
    if has_domain_keyword:
        has_matching_domain = any(kw in cand_primary or any(kw in s for s in cand_skills) for kw in domain_keywords)
        if not has_matching_domain:
            # Return very low score for domain-mismatched jobs
            return {
                'total_score': 5,  # Heavily penalize domain mismatch
                'skills_score': 0,
                'skills_matched_pct': 0,
                'exp_score': 0,
                'edu_score': 5,
                'industry_score': 0,
                'matched_skills': [],
                'job': job
            }
    
    # 1. Skills Match (40%)
    job_skills_raw = str(job['skills_required'])
    
    if job_skills_raw.lower() in ['nan', 'none', '']:
        skills_score = 40  # default if no skills required
        matched_skills_list = []
        skills_matched_pct = 100
    else:
        # Split by comma or newline
        job_skills = [s.strip().lower() for s in re.split(r'[,\n]', job_skills_raw) if s.strip()]
        if not job_skills:
            skills_score = 40
            matched_skills_list = []
            skills_matched_pct = 100
        else:
            matches = [s for s in job_skills if any(cs in s or s in cs for cs in cand_skills)]
            skills_matched_pct = (len(matches) / len(job_skills)) * 100
            skills_score = (skills_matched_pct / 100) * 40
            matched_skills_list = matches
            
    # 2. Experience Match (30%)
    req_years = extract_required_years(job['experiencere_requirement'])
    cand_years = candidate.get('total_years_experience', 0)
    
    if req_years == 0 or cand_years >= req_years:
        exp_score = 30
    else:
        exp_score = (cand_years / req_years) * 30
        
    # 3. Education Match (15%)
    # Basic heuristic
    req_edu = str(job['educationaL_requirements']).lower()
    cand_edu = str(candidate.get('highest_degree', '')).lower()
    
    edu_score = 0
    if req_edu in ['nan', 'none', '']:
        edu_score = 15
    else:
        if 'bachelor' in cand_edu or 'b.sc' in cand_edu or 'b.tech' in cand_edu or 'bba' in cand_edu:
            if 'master' not in req_edu and 'm.sc' not in req_edu:
                edu_score = 15
            else:
                edu_score = 10
        elif 'master' in cand_edu or 'm.sc' in cand_edu or 'mca' in cand_edu:
            edu_score = 15
        elif 'phd' in cand_edu:
            edu_score = 15
        else:
            edu_score = 10 # Default partial match
            
    # 4. Industry Match (15%) - Only award points if there's actual domain overlap
    industry_score = 0
    job_title = str(job['job_position_name']).lower()
    cand_primary = str(candidate.get('primary_domain', '')).lower()
    
    # Check if job title or domain aligns with candidate's primary domain
    if cand_primary and any(keyword in job_title for keyword in cand_primary.split()):
        industry_score = 15
    elif any(keyword in job_title for keyword in ['management', 'lead', 'director', 'executive'] if keyword in cand_primary):
        industry_score = 15
    # Otherwise, industry_score stays 0 - don't artificially boost unrelated roles
    
    total_score = skills_score + exp_score + edu_score + industry_score
    
    return {
        'total_score': total_score,
        'skills_score': skills_score,
        'skills_matched_pct': skills_matched_pct,
        'exp_score': exp_score,
        'edu_score': edu_score,
        'industry_score': industry_score,
        'matched_skills': matched_skills_list,
        'job': job
    }

def generate_final_report(model, candidate, top_jobs):
    print("Generating final career insights and report using LLM...")
    
    jobs_context = ""
    for i, match in enumerate(top_jobs, 1):
        job = match['job']
        jobs_context += f'''
Job {i}: {job['job_position_name']}
Compatibility Score: {match['total_score']:.1f}/100
Score Breakdown:
- Skills: {match['skills_score']:.1f}/40 ({match['skills_matched_pct']:.0f}% matched)
- Experience: {match['exp_score']:.1f}/30
- Education: {match['edu_score']:.1f}/15
- Industry: {match['industry_score']}/15 (Not heavily weighted)

Required Skills for Job: {job['skills_required']}
Candidate's Matching Skills: {', '.join(match['matched_skills']) if match['matched_skills'] else 'None'}
'''

    prompt = f"""
    You are an expert career counselor and resume analyst. Based on the candidate's profile and the top 5 job matches below, generate a comprehensive analysis in the EXACT requested output format.
    
    IMPORTANT RULES:
    - Format the output exactly as requested using Markdown.
    - Be honest about skill gaps - don't overstate matches.
    - If compatibility score is below 60, mention it's a stretch role.
    - Since Industry and Salary columns are largely absent/ignored, state "N/A" for Industry/Company and provide a realistic estimated Salary expectation based on the market for the role.
    
    CANDIDATE JSON PROFILE:
    {json.dumps(candidate, indent=2)}
    
    TOP 5 MATCHED JOBS CONTEXT:
    {jobs_context}
    
    OUTPUT FORMAT:

    **CANDIDATE PROFILE**
    Name: [extracted name]
    Email: [email]
    Phone: [phone]
    Total Experience: [X years Y months]
    Primary Domain: [domain]
    Seniority: [level]

    **EXTRACTED SKILLS**
    Technical: [list]
    Soft Skills: [list]
    Tools/Technologies: [list]
    Certifications: [list]

    **TOP 5 JOB MATCHES**

    1. [Job Title] - [Company/Industry]
       Compatibility Score: [X/100]
       
       Score Breakdown:
       - Skills Match: [X/40] ([Y]% of required skills matched)
       - Experience Match: [X/30]
       - Education Match: [X/15]
       - Industry Match: [X/15]
       
       ✅ Matching Skills: [list skills they have]
       ❌ Skill Gaps: [skills they need]
       
       Why This Job Fits:
       [2-3 sentences explaining the match]
       
       Preparation Steps:
       - [actionable step 1]
       - [actionable step 2]
       - [actionable step 3]

    [Repeat for top 5 jobs]

    **CAREER INSIGHTS**
    Strongest Career Path: [path based on analysis]
    Recommended Skills to Learn: [3 skills]
    Unique Strengths: [what makes candidate stand out]
    Expected Salary Range: [range based on experience and skills]

    **OVERALL ASSESSMENT**
    [2-3 paragraph summary of candidate's marketability and career positioning]
    """
    
    response = model.generate_content(prompt)
    return response.text

def main():
    if len(sys.argv) < 2:
        print("Usage: python resume_analyzer.py <path_to_resume_pdf_or_txt>")
        sys.exit(1)
        
    resume_path = sys.argv[1]
    csv_path = "resume_data.csv"
    
    if not os.path.exists(csv_path):
        print(f"Error: Dataset {csv_path} not found in the current directory.")
        sys.exit(1)
        
    model = setup_genai()
    
    resume_text = extract_text_from_file(resume_path)
    candidate_profile = parse_resume_with_llm(model, resume_text)
    
    jobs_df = load_and_clean_jobs(csv_path)
    
    print("Scoring jobs against candidate profile...")
    scored_jobs = []
    for _, job in jobs_df.iterrows():
        score_data = calculate_compatibility(candidate_profile, job)
        scored_jobs.append(score_data)
        
    # Sort by total score descending
    scored_jobs.sort(key=lambda x: x['total_score'], reverse=True)
    top_5_jobs = scored_jobs[:5]
    
    final_report = generate_final_report(model, candidate_profile, top_5_jobs)
    
    output_file = "analysis_result.md"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_report)
        
    print(f"\nAnalysis complete! Results saved to {output_file}")
    
if __name__ == "__main__":
    main()
