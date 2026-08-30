const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Groq = require("groq-sdk");

// Initialize Groq client securely from environment
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const megaPrompt = `You are an elite Applicant Tracking System (ATS), highly advanced resume parser, and professional career strategist.

RESUME TEXT:
\`\`\`
{{RESUME_TEXT}}
\`\`\`

TARGET JOB DESCRIPTION:
\`\`\`
{{JOB_DESCRIPTION}}
\`\`\`

Analyze the resume and return EXACTLY and ONLY the following strict JSON structure evaluating all components:

{
  "parsed": {
    "personalInfo": { "name": "<Full Name>", "email": "<Email>" },
    "summary": "<Professional summary>",
    "experience": [ { "position": "<Title>", "description": "<Bullets>" } ],
    "education": [],
    "skills": []
  },
  "ats": {
    "atsScore": {
      "overall": <Number 0-100>,
      "breakdown": {
        "formatting": { "score": <Number 0-25>, "feedback": "<Feedback>" },
        "keywords": { "score": <Number 0-25>, "feedback": "<Feedback>" },
        "sectionHeaders": { "score": <Number 0-20>, "feedback": "<Feedback>" },
        "clarity": { "score": <Number 0-20>, "feedback": "<Feedback>" },
        "contactInfo": { "score": <Number 0-5>, "feedback": "<Feedback>" },
        "fileFormat": { "score": <Number 0-5>, "feedback": "Valid PDF/DOCX" }
      }
    }
  },
  "keywords": {
    "keywordAnalysis": {
      "keywordIntegration": {
        "natural": ["<Keyword>"],
        "stuffed": []
      },
      "keywordMatching": {
        "missingCriticalKeywords": ["<Keyword>"]
      },
      "industryBenchmarks": {
        "industryStandards": ["<Standard>"]
      }
    }
  },
  "content": {
    "contentQuality": {
      "overallScore": <Number 0-100>,
      "sections": {
        "experience": {
          "jobCount": <Number>,
          "suggestions": [
            { "role": "<Role>", "weak": "<Weak bullet text>", "strong": "<Improved metric bullet>", "impact": "<Why it's better>" }
          ]
        }
      },
      "actionVerbAnalysis": {
        "score": <Number 0-100>,
        "weakVerbs": ["<Weak verb>"],
        "strongVerbs": ["<Strong verb>"],
        "improvementOpportunities": [ { "weak": "<Weak phrase>", "strong": "<Strong phrase>" } ]
      },
      "metricAndImpactAnalysis": {
        "sentencesWithoutMetrics": <Number>
      }
    }
  },
  "recommendations": {
    "recommendations": {
      "overallScore": <Number 0-100>,
      "currentStatus": "<Needs work/Good/Very Good/Excellent>",
      "improvementPotential": "+XX points",
      "prioritized": [
        {
          "priority": "CRITICAL",
          "title": "<Short title>",
          "action": "<What to do>",
          "estimatedTimeToFix": "<5 min>",
          "example": { "before": "<Current>", "after": "<Improved>" }
        }
      ]
    }
  }
}

Return ONLY valid JSON. Keep all arrays concise (top 3-5 items maximum) to optimize evaluation speeds.`;

router.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const { jobDescription } = req.body;
        let resumeText = "";
        const getExt = req.file.originalname.split('.').pop().toLowerCase();

        if (getExt === "pdf") {
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);
            resumeText = pdfData.text;
        } else if (getExt === "docx" || req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const docxData = await mammoth.extractRawText({ path: req.file.path });
            resumeText = docxData.value;
        } else {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: "Unsupported format. Only PDF and DOCX are allowed." });
        }

        // Clean up file immediately
        fs.unlinkSync(req.file.path);

        const prompt = megaPrompt
            .split('{{RESUME_TEXT}}').join(resumeText || "")
            .split('{{JOB_DESCRIPTION}}').join(jobDescription || "No job description supplied.");

        // Query Groq SDK directly
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.2
        });

        let analysisJson = {};

        try {
            analysisJson = JSON.parse(response.choices[0]?.message?.content);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ success: false, message: "AI returned malformed data. Please try again." });
        }

        res.json({ success: true, analysis: analysisJson });

    } catch (error) {
        console.log("Upload Error:", error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        // Exact 429 interception specific to Groq API limits
        if (error.status === 429 || (error.message && error.message.includes('429'))) {
            return res.status(429).json({
                success: false,
                message: "Groq API rate limit exceeded. You analyzed too many resumes too quickly! Please wait 60 seconds and try again.",
            });
        }

        if (error.status === 401 || (error.message && error.message.includes('Invalid API Key'))) {
            return res.status(401).json({
                success: false,
                message: "Authentication Error: Your Groq API Key is invalid or expired. Please check your .env file and generate a new key from console.groq.com.",
            });
        }

        res.status(500).json({ success: false, message: "Error analyzing resume: " + error.message });
    }
});

module.exports = router;