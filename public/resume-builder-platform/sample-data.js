const sampleResumeData = {
  personal: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Software Engineer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 019-2834",
    website: "https://alexmorgan.dev",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    location: "San Francisco, CA",
    summary: "Detail-oriented Software Engineer with 6+ years of experience designing, building, and deploying highly scalable web applications. Expert in React, Node.js, and cloud architecture (AWS/GCP). Passionate about performance optimization, clean code, and mentoring junior developer teams."
  },
  education: [
    {
      id: "edu-1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      grade: "3.8 GPA",
      description: "Specialized in Software Engineering and Distributed Systems. Teaching Assistant for Data Structures course."
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      position: "Senior Software Engineer",
      location: "San Francisco, CA (Hybrid)",
      startDate: "2022-08",
      endDate: "Present",
      description: "Led a team of 4 frontend engineers to rebuild the core SaaS dashboard using React and CSS, improving page load speeds by 42%.\nDesigned and implemented a real-time analytics data ingestion service using Node.js and Apache Kafka, handling 10M+ events daily.\nMentored junior developers and introduced automated testing processes, increasing test coverage from 60% to 92%."
    },
    {
      id: "exp-2",
      company: "Innovate Digital",
      position: "Software Developer",
      location: "Austin, TX",
      startDate: "2020-06",
      endDate: "2022-07",
      description: "Developed and maintained high-traffic microservices using Express, PostgreSQL, and Redis.\nCollaborated with product designers to implement responsive, accessible UI modules following WCAG 2.1 compliance standards.\nReduced AWS hosting costs by 18% through serverless refactoring of media encoding services using AWS Lambda."
    }
  ],
  skills: [
    { id: "skill-1", name: "JavaScript / TypeScript", category: "Languages" },
    { id: "skill-2", name: "Python", category: "Languages" },
    { id: "skill-3", name: "React / Next.js", category: "Frontend" },
    { id: "skill-4", name: "Node.js / Express", category: "Backend" },
    { id: "skill-5", name: "PostgreSQL & Redis", category: "Databases" },
    { id: "skill-6", name: "Docker & Kubernetes", category: "DevOps" },
    { id: "skill-7", name: "AWS (S3, Lambda, EC2)", category: "Cloud" },
    { id: "skill-8", name: "REST APIs & GraphQL", category: "APIs" }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CloudFlow Architecture",
      role: "Lead Creator",
      technologies: "Next.js, CSS Grid, AWS SDK, serverless",
      link: "https://github.com/alexmorgan/cloudflow",
      description: "Built an open-source visual drag-and-drop cloud architecture diagram generator that auto-compiles to Terraform scripts. Gained over 1,200 stars on GitHub."
    },
    {
      id: "proj-2",
      title: "OmniSearch Indexer",
      role: "Sole Developer",
      technologies: "Node.js, Elasticsearch, Redis",
      link: "https://github.com/alexmorgan/omnisearch",
      description: "Created a high-throughput content indexer capable of syncing 500 documents per second across active Slack, Jira, and GitHub integrations."
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023-11",
      link: "https://aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Certified ScrumMaster (CSM)",
      issuer: "Scrum Alliance",
      date: "2021-05",
      link: ""
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Outstanding Innovation Award",
      issuer: "TechNova Solutions",
      date: "2024-01",
      description: "Awarded for designing and deploying an automated emergency rollback script during a major cloud outage, saving estimated $50k+ in downtime costs."
    },
    {
      id: "ach-2",
      title: "1st Place Winner",
      issuer: "Austin Hackathon 2021",
      date: "2021-03",
      description: "Led a team of 3 to build an emergency resource locator mapping system within 36 hours using geolocation APIs."
    }
  ],
  sectionOrder: ["personal", "summary", "experience", "education", "projects", "skills", "certifications", "achievements"]
};

// Export to window object for frontend access
window.sampleResumeData = sampleResumeData;
