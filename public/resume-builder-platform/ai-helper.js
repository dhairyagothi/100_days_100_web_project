/**
 * AI Helper and ATS Analyzer for Resume Builder Platform
 */

const AIHelper = {
  // Stop words to filter out during job description keyword extraction
  stopWords: new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
    'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from',
    'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here',
    'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in',
    'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor',
    'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
    'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
    'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
    'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
    'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
    'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves', 'will', 'shall', 'should', 'can', 'may', 'might',
    'must', 'using', 'using', 'experience', 'years', 'working', 'ability', 'skills', 'work', 'job', 'role', 'team',
    'teams', 'company', 'candidate', 'requirements', 'responsibilities', 'knowledge', 'understanding'
  ]),

  // Common high-value ATS industry keywords to prioritize matching
  industryKeywords: [
    // Tech & Engineering
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'next.js', 'svelte', 'nuxt', 'node.js', 'express', 'django', 'flask', 'spring boot', 'laravel',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'graphql', 'rest api', 'microservices', 'serverless',
    'machine learning', 'artificial intelligence', 'nlp', 'data science', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
    // Methodologies & Processes
    'agile', 'scrum', 'kanban', 'devops', 'tdd', 'ci/cd', 'oop', 'system design', 'microservices', 'clean code',
    'project management', 'product management', 'sdlc', 'qa', 'testing', 'cypress', 'jest', 'selenium',
    // Business & Marketing
    'seo', 'sem', 'analytics', 'google analytics', 'crm', 'salesforce', 'marketing automation', 'b2b', 'saas',
    'financial modeling', 'budgeting', 'forecasting', 'risk assessment', 'compliance', 'operations',
    // Soft Skills / General Professional
    'leadership', 'mentoring', 'communication', 'collaboration', 'problem solving', 'critical thinking', 'time management'
  ],

  // Common resume action verbs for AI reviewer
  actionVerbs: [
    'led', 'managed', 'designed', 'developed', 'built', 'implemented', 'created', 'architected', 'spearheaded',
    'improved', 'increased', 'optimized', 'reduced', 'saved', 'engineered', 'launched', 'overhauled', 'formulated',
    'initiated', 'coordinated', 'mentored', 'directed', 'facilitated', 'executed', 'resolved', 'analyzed'
  ],

  /**
   * Tokenize text and clean punctuation, outputting lowercase unique word array
   */
  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'\n\r]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 1);
  },

  /**
   * Match user resume data against job description to generate ATS report
   */
  analyzeATS(resumeData, jobDescriptionText) {
    if (!jobDescriptionText || jobDescriptionText.trim() === '') {
      return {
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        suggestion: "Paste a job description to calculate your ATS match score."
      };
    }

    // 1. Gather all resume text
    let resumeText = '';
    if (resumeData.personal) {
      resumeText += ` ${resumeData.personal.fullName} ${resumeData.personal.jobTitle} ${resumeData.personal.summary}`;
    }
    if (resumeData.experience) {
      resumeData.experience.forEach(exp => {
        resumeText += ` ${exp.company} ${exp.position} ${exp.description}`;
      });
    }
    if (resumeData.education) {
      resumeData.education.forEach(edu => {
        resumeText += ` ${edu.school} ${edu.degree} ${edu.fieldOfStudy} ${edu.description}`;
      });
    }
    if (resumeData.projects) {
      resumeData.projects.forEach(proj => {
        resumeText += ` ${proj.title} ${proj.role} ${proj.technologies} ${proj.description}`;
      });
    }
    if (resumeData.skills) {
      resumeData.skills.forEach(skill => {
        resumeText += ` ${skill.name} ${skill.category}`;
      });
    }
    if (resumeData.certifications) {
      resumeData.certifications.forEach(cert => {
        resumeText += ` ${cert.name} ${cert.issuer}`;
      });
    }
    if (resumeData.achievements) {
      resumeData.achievements.forEach(ach => {
        resumeText += ` ${ach.title} ${ach.issuer} ${ach.description}`;
      });
    }

    const resumeTokens = new Set(this.tokenize(resumeText));
    const jdTokens = this.tokenize(jobDescriptionText);

    // Extract potential technical/business keywords from the Job Description
    const jdKeywords = new Set();
    jdTokens.forEach(word => {
      // If it's a known industry keyword OR (longer than 3 letters, not a stop word, and not pure digits)
      if (this.industryKeywords.includes(word) || 
          (word.length > 3 && !this.stopWords.has(word) && isNaN(word))) {
        jdKeywords.add(word);
      }
    });

    const totalKeywords = Array.from(jdKeywords);
    if (totalKeywords.length === 0) {
      return {
        score: 50,
        matchedKeywords: [],
        missingKeywords: [],
        suggestion: "No clear industry keywords found in the job description. Try adding more specific tech skills or qualifications."
      };
    }

    // Match keywords
    const matchedKeywords = [];
    const missingKeywords = [];

    totalKeywords.forEach(keyword => {
      // Direct substring search or word token match for flexibility
      if (resumeTokens.has(keyword) || resumeText.toLowerCase().includes(" " + keyword + " ")) {
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    // Score calculation (weighted slightly to be encouraging but realistic)
    const rawScore = (matchedKeywords.length / totalKeywords.length) * 100;
    const score = Math.min(100, Math.round(rawScore));

    let suggestion = '';
    if (score < 40) {
      suggestion = "Low match score. Tailor your resume by incorporating some of the crucial missing keywords listed below.";
    } else if (score < 70) {
      suggestion = "Good progress! Integrate a few more technical/process keywords from the job description to improve matching potential.";
    } else {
      suggestion = "Excellent ATS Match! Your resume contains a strong density of terms aligned with this job description.";
    }

    return {
      score,
      matchedKeywords: matchedKeywords.sort(),
      missingKeywords: missingKeywords.sort(),
      suggestion
    };
  },

  /**
   * Run structural audits on the resume data and give dynamic styling/writing suggestions
   */
  getSuggestions(resumeData) {
    const alerts = [];
    let summaryScore = 100;
    let expScore = 100;
    let skillsScore = 100;

    // 1. Personal Info check
    if (!resumeData.personal || !resumeData.personal.fullName) {
      alerts.push({
        type: 'critical',
        section: 'Personal Details',
        message: 'Full Name is missing. A resume must start with your name.'
      });
    }
    if (!resumeData.personal || !resumeData.personal.email || !resumeData.personal.phone) {
      alerts.push({
        type: 'warning',
        section: 'Personal Details',
        message: 'Contact details (email or phone) are incomplete. Recruiters cannot reach you.'
      });
    }

    // 2. Professional Summary check
    const summary = resumeData.personal?.summary || '';
    if (summary.trim().length === 0) {
      summaryScore = 0;
      alerts.push({
        type: 'warning',
        section: 'Summary',
        message: 'Professional Summary is empty. Adding a brief summary highlights your career objectives.'
      });
    } else {
      if (summary.length < 80) {
        summaryScore -= 30;
        alerts.push({
          type: 'info',
          section: 'Summary',
          message: 'Your summary is quite short. Aim for 2-3 impact-driven sentences.'
        });
      }
      
      // Check for action verbs in summary
      const summaryWords = this.tokenize(summary);
      const hasActionVerb = summaryWords.some(w => this.actionVerbs.includes(w));
      if (!hasActionVerb) {
        summaryScore -= 20;
        alerts.push({
          type: 'info',
          section: 'Summary',
          message: 'Try starting your summary with powerful descriptors like "Led", "Architected", "Experienced", or "Results-driven".'
        });
      }
    }

    // 3. Work Experience check
    const experiences = resumeData.experience || [];
    if (experiences.length === 0) {
      expScore = 0;
      alerts.push({
        type: 'critical',
        section: 'Work Experience',
        message: 'No work experience added. Prioritize listing recent jobs, internships, or freelance engagements.'
      });
    } else {
      let missingMetrics = false;
      let missingActionVerbs = false;

      experiences.forEach((exp, idx) => {
        const desc = exp.description || '';
        if (desc.trim().length < 20) {
          expScore -= 15;
          alerts.push({
            type: 'warning',
            section: `Work Experience (${exp.company || 'Job #' + (idx+1)})`,
            message: 'Description is too brief. Provide 3-4 bullet points detailing your key deliverables.'
          });
        } else {
          // Check for metrics (numbers, currency symbols, percentages)
          const hasMetrics = /[\d%]+|\$[\d,]+|million|billion/.test(desc);
          if (!hasMetrics) {
            missingMetrics = true;
          }

          // Check for action verbs
          const descWords = this.tokenize(desc);
          const hasVerb = descWords.some(w => this.actionVerbs.includes(w));
          if (!hasVerb) {
            missingActionVerbs = true;
          }
        }
      });

      if (missingMetrics) {
        expScore -= 20;
        alerts.push({
          type: 'info',
          section: 'Work Experience',
          message: 'Quantify your impact! Add figures, percentages, or savings (e.g. "improved page speeds by 42%" or "saved $12k annually").'
        });
      }

      if (missingActionVerbs) {
        expScore -= 15;
        alerts.push({
          type: 'info',
          section: 'Work Experience',
          message: 'Use active verbs to start bullet points (e.g., "Coordinated team", "Launched service" instead of "Responsible for...").'
        });
      }
    }

    // 4. Skills check
    const skills = resumeData.skills || [];
    if (skills.length === 0) {
      skillsScore = 0;
      alerts.push({
        type: 'warning',
        section: 'Skills',
        message: 'No skills listed. Group and list technical, language, and conceptual tools.'
      });
    } else if (skills.length < 5) {
      skillsScore = 50;
      alerts.push({
        type: 'info',
        section: 'Skills',
        message: 'You have very few skills listed. Aim to list at least 8 key competencies matching your target roles.'
      });
    }

    // 5. Projects check
    const projects = resumeData.projects || [];
    if (projects.length === 0) {
      alerts.push({
        type: 'info',
        section: 'Projects',
        message: 'Adding personal or professional projects is a great way to showcase hands-on technology applications.'
      });
    }

    // Calculate aggregate profile completion strength
    const completionScore = Math.max(0, Math.round(
      (summaryScore * 0.15) + (expScore * 0.40) + (skillsScore * 0.20) + 
      ((projects.length > 0 ? 100 : 0) * 0.15) + 
      (((resumeData.certifications?.length > 0 || resumeData.achievements?.length > 0) ? 100 : 0) * 0.10)
    ));

    return {
      completionScore,
      alerts
    };
  },

  /**
   * Generate cover letter using resume info and job description
   */
  generateCoverLetter(resumeData, jobDescriptionText, tone = 'professional') {
    const personal = resumeData.personal || {};
    const name = personal.fullName || '[Your Name]';
    const title = personal.jobTitle || 'Software Engineer';
    const email = personal.email || 'your.email@example.com';
    const phone = personal.phone || '555-0100';
    const location = personal.location || 'City, State';

    // Try to extract company name from JD (regex match common patterns)
    let company = 'Hiring Team';
    const companyMatch = jobDescriptionText.match(/(?:at|join|with)\s+([A-Z][a-zA-Z0-9\s]{2,20})(?:\s+is|team|,|\n)/);
    if (companyMatch && companyMatch[1]) {
      company = companyMatch[1].trim();
    }

    // Try to extract job title from JD
    let targetTitle = title;
    const titleMatch = jobDescriptionText.match(/(?:seeking|hiring|for\s+a)\s+([A-Z][a-zA-Z0-9\s]{2,30}\b(?:Engineer|Developer|Manager|Designer|Analyst|Specialist|Lead|Architect|Consultant))/i);
    if (titleMatch && titleMatch[1]) {
      targetTitle = titleMatch[1].trim();
    }

    // Pick top experience to reference
    let majorExperience = '';
    if (resumeData.experience && resumeData.experience.length > 0) {
      const mainExp = resumeData.experience[0];
      majorExperience = `During my time as a ${mainExp.position} at ${mainExp.company}, I refined my skills and delivered core achievements, such as: ${mainExp.description.split('\n')[0]}`;
    } else {
      majorExperience = `In my professional journey, I have focused on solving complex challenges, optimizing user workflows, and developing scalable technical solutions.`;
    }

    // Pick top skills
    let skillListText = '';
    if (resumeData.skills && resumeData.skills.length > 0) {
      const topSkills = resumeData.skills.slice(0, 4).map(s => s.name).join(', ');
      skillListText = `My core technical strengths include ${topSkills}, which align perfectly with the requirements of this role.`;
    }

    const todayStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    let salutation = `Dear ${company} Hiring Team,`;
    let intro = '';
    let body = '';
    let alignment = '';
    let closing = '';

    if (tone === 'enthusiastic') {
      intro = `I was absolutely thrilled to come across the opening for the ${targetTitle} position. With my background as a ${title} and a deep passion for building high-impact products, I am excited about the possibility of bringing my energy and expertise to the outstanding team at ${company}.`;
      body = `I thrive in fast-paced, collaborative environments. ${majorExperience} ${skillListText} I am constantly seeking to learn and build tools that improve developer productivity and customer happiness.`;
      alignment = `What excites me most about ${company} is your commitment to innovation. I am eager to apply my technical skillset to help solve your complex operational challenges and push the boundaries of what your products can achieve.`;
      closing = `Thank you so much for your time and consideration. I would be absolutely delighted to schedule an interview to discuss how my enthusiasm and engineering background can support your upcoming projects!`;
    } else if (tone === 'creative') {
      intro = `Every product tells a story, and as a ${title}, I specialize in writing chapters focused on efficiency, premium design, and scalable architecture. I am applying to join ${company} as a ${targetTitle} because I want to help you design the next generation of user-focused solutions.`;
      body = `${majorExperience} This experience showed me that great code isn't just about functional logic—it is about creating memorable experiences and solid infrastructure. ${skillListText} These tools allow me to convert creative concepts into high-performing web services.`;
      alignment = `Your team's focus on user experience and robust design fits my personal philosophy perfectly. I look forward to bringing a fresh, innovative perspective to ${company} and collaborating to ship top-tier applications.`;
      closing = `I would appreciate the opportunity to showcase my portfolio and share how my creative engineering style can add value to your business. Let's arrange a time to speak!`;
    } else {
      // Default: Professional
      intro = `I am writing to express my strong interest in the ${targetTitle} position at ${company}. As an experienced ${title} with a proven track record of developing reliable web systems and leading frontend optimizations, I am confident in my ability to make a prompt contribution to your engineering department.`;
      body = `${majorExperience} I specialize in maintaining code quality, optimizing application efficiency, and ensuring accessible designs. ${skillListText} I am accustomed to working in Agile frameworks and collaborating with cross-functional product stakeholders.`;
      alignment = `I admire ${company}’s reputation for technical excellence and market leadership. The prospect of integrating my cloud development experience and full-stack capabilities with your current product line represents an exciting opportunity for mutual growth.`;
      closing = `Thank you for your time and review of my application. I look forward to the possibility of discussing how my technical qualifications and career achievements align with the strategic goals of the ${company} team.`;
    }

    return `${name}
${location} | ${phone} | ${email}

${todayStr}

To: The Hiring Committee
${company}

${salutation}

${intro}

${body}

${alignment}

${closing}

Sincerely,

${name}`;
  }
};

// Export to window object for frontend access
window.AIHelper = AIHelper;
