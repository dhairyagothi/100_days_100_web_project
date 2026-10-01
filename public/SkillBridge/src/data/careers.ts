import { Career } from "@/types/career";

export const careersData: Career[] = [
  {
    id: "frontend",
    slug: "frontend-developer",
    title: "Frontend Developer",
    description: "Build the visual parts of websites and applications that users interact with directly. You will focus on user interface, experience, layout, and responsiveness.",
    difficulty: "Medium",
    skillsCount: 12,
    salaryEstimate: "$85,000 - $145,000",
    iconName: "Code",
    skills: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Git & GitHub", "Testing (Jest/Cypress)", "Web Performance", "Accessibility (a11y)", "REST/GraphQL APIs"],
    roadmap: [
      {
        stage: 1,
        title: "HTML & CSS Foundations",
        description: "Learn how web pages are structured and styled. Master semantic HTML, responsive layout models (Flexbox and Grid), and CSS animations.",
        skills: ["HTML5", "CSS3", "Responsive Design", "Flexbox & Grid"]
      },
      {
        stage: 2,
        title: "JavaScript & DOM Manipulation",
        description: "Add dynamic behaviors and interactive elements. Understand variables, functions, scopes, array methods, fetch/async-await, and the DOM API.",
        skills: ["JavaScript (ES6+)", "DOM API", "Fetch API & Promises", "Async/Await"]
      },
      {
        stage: 3,
        title: "Git, Command Line, & Package Managers",
        description: "Learn developer workflows. Version control with Git, team collaborations via GitHub, and project setup with npm, yarn, or pnpm.",
        skills: ["Git & GitHub", "Terminal Basics", "npm / pnpm / yarn"]
      },
      {
        stage: 4,
        title: "Modern React",
        description: "Build components using the most popular frontend library. Understand JSX, props, state, hooks (useState, useEffect, useContext), routing, and state management.",
        skills: ["React Components", "Hooks", "React Router", "State Management"]
      },
      {
        stage: 5,
        title: "TypeScript & Styling Frameworks",
        description: "Bring static typing to JavaScript to prevent runtime bugs. Master utility styling with Tailwind CSS and theme setup with CSS variables.",
        skills: ["TypeScript Basics", "Tailwind CSS", "Component Libraries (shadcn/ui)"]
      },
      {
        stage: 6,
        title: "Next.js & Server Rendering",
        description: "Learn Next.js App Router, SSR (Server Side Rendering), SSG (Static Site Generation), Server Components, and optimized image/font handling.",
        skills: ["Next.js App Router", "Server Components", "Routing & Layouts", "SEO & Optimization"]
      },
      {
        stage: 7,
        title: "Testing, CI/CD, & Deployments",
        description: "Write unit tests for UI logic, run end-to-end user tests, integrate with CI/CD tools, and deploy your build onto Vercel, Netlify, or AWS.",
        skills: ["Jest & React Testing Library", "Cypress / Playwright", "Vercel / Netlify", "CI/CD Actions"]
      }
    ],
    projects: [
      {
        title: "Portfolio Website",
        description: "Create a highly responsive, modern portfolio site showcasing your projects, bio, and contact information with custom CSS animations.",
        difficulty: "Beginner",
        keySkills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"]
      },
      {
        title: "Calculator App",
        description: "Build a functional calculator featuring basic arithmetic operations, decimal support, clear actions, and custom theme switches.",
        difficulty: "Beginner",
        keySkills: ["HTML5", "CSS3", "JavaScript", "DOM Manipulation"]
      },
      {
        title: "Landing Page",
        description: "Construct a clean, high-conversion landing page for a SaaS startup utilizing Tailwind CSS for beautiful styling and grid setups.",
        difficulty: "Beginner",
        keySkills: ["Tailwind CSS", "Semantic HTML", "Responsive Layouts"]
      },
      {
        title: "Weather Dashboard",
        description: "Connect to a public weather API to fetch and show real-time forecasts, search cities, display 5-day averages, and switch weather icons.",
        difficulty: "Intermediate",
        keySkills: ["React", "Fetch API", "Tailwind CSS", "Asynchronous JS"]
      },
      {
        title: "Personal Blog Platform",
        description: "Implement a markdown-based blogging site where posts can be filtered by tags, sorted by date, and support dark/light mode toggling.",
        difficulty: "Intermediate",
        keySkills: ["Next.js", "TypeScript", "Markdown Parsing", "CSS Variables"]
      },
      {
        title: "Expense Tracker",
        description: "Create a budgeting tool with visual charts, transaction filters, income vs expense breakdowns, and persistent local storage storage.",
        difficulty: "Intermediate",
        keySkills: ["React Hooks", "Local Storage", "Chart.js / Recharts", "Tailwind"]
      },
      {
        title: "E-Commerce Platform",
        description: "Build a full digital catalog featuring category filters, search input, a fully functional shopping cart, checkout screens, and stripe integration.",
        difficulty: "Advanced",
        keySkills: ["Next.js", "TypeScript", "State Management", "Stripe API", "Tailwind"]
      },
      {
        title: "Real-time Chat Application",
        description: "Develop a messaging application supporting instant message delivery, online user indicators, emoji menus, and multi-channel chatrooms.",
        difficulty: "Advanced",
        keySkills: ["React", "WebSockets / Socket.io", "Tailwind CSS", "Lucide Icons"]
      },
      {
        title: "Project Management Tool",
        description: "Build a Trello-like kanban board allowing users to drag-and-drop cards between stages, add labels, assign due dates, and track task progress.",
        difficulty: "Advanced",
        keySkills: ["Next.js", "dnd-kit / react-beautiful-dnd", "TypeScript", "Local Storage"]
      }
    ],
    resources: [
      {
        title: "MDN Web Docs - HTML, CSS, and JS guide",
        url: "https://developer.mozilla.org",
        type: "Documentation",
        isFree: true
      },
      {
        title: "freeCodeCamp - Responsive Web Design Course",
        url: "https://www.freecodecamp.org/learn",
        type: "Course",
        isFree: true
      },
      {
        title: "JavaScript.info - The Modern JavaScript Tutorial",
        url: "https://javascript.info",
        type: "Article",
        isFree: true
      },
      {
        title: "React Official Documentation - Learn React Hooks & Dev Rules",
        url: "https://react.dev",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Next.js Learn - Official App Router walkthrough course",
        url: "https://nextjs.org/learn",
        type: "Course",
        isFree: true
      }
    ]
  },
  {
    id: "backend",
    slug: "backend-developer",
    title: "Backend Developer",
    description: "Design and implement logic, databases, security protocols, API interfaces, and server architectures that support consumer-facing frontend applications.",
    difficulty: "Hard",
    skillsCount: 14,
    salaryEstimate: "$90,000 - $155,000",
    iconName: "Server",
    skills: ["Node.js", "Express", "Python / Go", "SQL (PostgreSQL)", "NoSQL (MongoDB)", "REST APIs", "GraphQL APIs", "Docker", "Redis", "Security (OAuth/JWT)", "System Design", "CI/CD Pipelines"],
    roadmap: [
      {
        stage: 1,
        title: "Programming Foundations",
        description: "Master server-side programming in Node.js, Python, or Go. Learn basic syntax, Object Oriented Programming (OOP), and data structures.",
        skills: ["Node.js / Python / Go", "OOP Concepts", "Data Structures", "Algorithms"]
      },
      {
        stage: 2,
        title: "Web Server Basics & REST APIs",
        description: "Learn how the HTTP protocol works. Master URL routing, query strings, body parsers, middlewares, request/response headers, and REST guidelines.",
        skills: ["HTTP Protocol", "REST API Design", "Express.js / FastAPI / Gin", "Middlewares"]
      },
      {
        stage: 3,
        title: "Databases & ORMs",
        description: "Understand where and how to store application state. Master SQL database structure, NoSQL storage structures, and object-relational mapping engines.",
        skills: ["PostgreSQL / MySQL", "MongoDB", "SQL Queries", "Prisma / Mongoose ORM"]
      },
      {
        stage: 4,
        title: "Authentication & Web Security",
        description: "Secure your endpoints. Learn hash algorithms, JWT (JSON Web Tokens) tokens, OAuth verification, cookie sessions, CORS, and SQL Injection prevention.",
        skills: ["Password Hashing", "JWT & Sessions", "OAuth2.0", "Security Headers & CORS"]
      },
      {
        stage: 5,
        title: "Caching & Message Brokers",
        description: "Boost server performance and manage background activities. Store hot data in memory and defer complex tasks with queues.",
        skills: ["Redis Caching", "RabbitMQ / Apache Kafka", "Background Job Runners", "Event-Driven Logic"]
      },
      {
        stage: 6,
        title: "Docker & Containerization",
        description: "Package your applications with all dependencies into self-contained files. Learn Dockerfile creation, multi-container networking, and docker-compose.",
        skills: ["Docker Basics", "Dockerfile Creation", "Docker Compose", "Multi-stage Builds"]
      },
      {
        stage: 7,
        title: "Cloud Services & Deployment",
        description: "Deploy APIs to the cloud. Learn container orchestration, serverless hosting, Linux console workflows, reverse proxies, and continuous delivery pipelines.",
        skills: ["AWS / Google Cloud", "Nginx Configuration", "Linux Server Administration", "CI/CD Pipelines"]
      }
    ],
    projects: [
      {
        title: "Task Manager CLI",
        description: "Construct a terminal utility that lets users create, list, check off, and delete tasks. Save tasks inside JSON files or SQLite.",
        difficulty: "Beginner",
        keySkills: ["Node.js CLI", "SQLite", "File System", "Commander.js"]
      },
      {
        title: "URL Shortener API",
        description: "Create a service that registers redirects, redirects short keys to full URLs, generates unique hash slugs, and counts click stats.",
        difficulty: "Beginner",
        keySkills: ["Express", "MongoDB", "UUID Generation", "Base62 Encoding"]
      },
      {
        title: "Static File Server",
        description: "Build a custom server script that parses paths, resolves local files, sets MIME headers, and handles file streams.",
        difficulty: "Beginner",
        keySkills: ["Node.js HTTP", "Streams API", "File System", "Path Resolution"]
      },
      {
        title: "E-Commerce Backend API",
        description: "Design a full REST API with endpoints to manage products, categories, dynamic order tracking, search filters, and checkout webhooks.",
        difficulty: "Intermediate",
        keySkills: ["Express", "PostgreSQL", "Knex.js / Prisma", "Payment APIs"]
      },
      {
        title: "Real-time Messaging Server",
        description: "Write a server layer using WebSockets to broadcast messages, coordinate rooms, track offline status, and stream file transfer events.",
        difficulty: "Intermediate",
        keySkills: ["Node.js", "Socket.io", "Redis Pub/Sub", "JSON Parsing"]
      },
      {
        title: "Blog API with Auth",
        description: "Set up content endpoints requiring JWT auth. Include author roles, pagination, image uploads, and comment tables.",
        difficulty: "Intermediate",
        keySkills: ["FastAPI / Express", "PostgreSQL", "JWT Tokens", "Multer / Cloudinary"]
      },
      {
        title: "Microservices e-Shop",
        description: "Architect a modular store utilizing separate backend instances for Auth, Catalog, and Ordering, connected via a message broker.",
        difficulty: "Advanced",
        keySkills: ["Microservices", "RabbitMQ / Kafka", "gRPC", "Docker Compose"]
      },
      {
        title: "Collaborative Whiteboard Server",
        description: "Create a high-frequency socket server that broadcasts mouse points, handles conflict resolution, and saves canvases.",
        difficulty: "Advanced",
        keySkills: ["WebSockets", "Node.js", "Memory Optimization", "Redis"]
      },
      {
        title: "Video Processing API",
        description: "Build a queue-driven processor that receives files, transcodes resolutions, creates clip thumbnails, and uploads results to AWS S3.",
        difficulty: "Advanced",
        keySkills: ["FFmpeg", "AWS S3", "BullMQ / Redis", "BullMQ Queues"]
      }
    ],
    resources: [
      {
        title: "roadmap.sh - Interactive Backend Developer Roadmap",
        url: "https://roadmap.sh/backend",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Node.js Official Documentation and Guides",
        url: "https://nodejs.org/en/docs",
        type: "Documentation",
        isFree: true
      },
      {
        title: "PostgreSQL Tutorial - Learn SQL Database Administration",
        url: "https://www.postgresqltutorial.com",
        type: "Course",
        isFree: true
      },
      {
        title: "Docker Handbook - Complete guide to containers",
        url: "https://docs.docker.com",
        type: "Documentation",
        isFree: true
      },
      {
        title: "System Design Primer - Github Guide on Scalable Architectures",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "Article",
        isFree: true
      }
    ]
  },
  {
    id: "fullstack",
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    description: "Master both client-side and server-side components, enabling you to build complete web applications single-handedly from databases to responsive layouts.",
    difficulty: "Hard",
    skillsCount: 16,
    salaryEstimate: "$95,000 - $160,000",
    iconName: "Layers",
    skills: ["HTML & CSS", "TypeScript", "React", "Next.js", "Node.js & Express", "PostgreSQL & Prisma", "MongoDB", "Tailwind CSS", "REST & GraphQL", "Git & GitHub", "Docker", "Authentication (JWT)", "Server Actions", "CI/CD Pipelines", "System Design"],
    roadmap: [
      {
        stage: 1,
        title: "Frontend Foundations",
        description: "Learn how the browser displays documents, structure interfaces, style elements, and write fundamental JavaScript logic with Git.",
        skills: ["HTML5", "CSS3", "JavaScript Basics", "Git Version Control"]
      },
      {
        stage: 2,
        title: "UI Frameworks & Styling",
        description: "Build highly interactive views using React and Tailwind CSS. Learn state management, routing libraries, hooks, and responsive design systems.",
        skills: ["React Components", "Tailwind CSS", "State Hooks", "React Router"]
      },
      {
        stage: 3,
        title: "Backend Setup & REST APIs",
        description: "Write backend code to handle frontend actions. Create API systems using Node.js and Express, build routes, and validate incoming data.",
        skills: ["Node.js API", "Express.js", "Request Routing", "Zod Validation"]
      },
      {
        stage: 4,
        title: "Databases & Data Modeling",
        description: "Set up persistent structures. Model SQL tables with PostgreSQL (using Prisma ORM) and store unstructured data with MongoDB.",
        skills: ["PostgreSQL & SQL", "MongoDB & NoSQL", "Prisma ORM", "Schema Design"]
      },
      {
        stage: 5,
        title: "Unified Web Frameworks (Next.js)",
        description: "Combine frontend and backend into one codebase. Master Next.js App Router, Server Actions, Server Components, and API Route routes.",
        skills: ["Next.js App Router", "Server Actions", "API Routes", "Data Revalidation"]
      },
      {
        stage: 6,
        title: "Security, Auth, & Advanced Concepts",
        description: "Secure the app with session controls and OAuth. Implement real-time pipelines using WebSockets and organize applications using Docker containers.",
        skills: ["JWT & NextAuth", "WebSockets / Socket.io", "Docker Containers", "System Design"]
      },
      {
        stage: 7,
        title: "Testing, CI/CD, & Cloud Deployments",
        description: "Maintain code quality. Set up lint checkers, run integration tests, script CI/CD pipelines, and launch apps to Vercel, Fly.io, or AWS.",
        skills: ["Jest & RTL", "Cypress E2E Testing", "CI/CD Pipelines", "Vercel & Render & Fly.io"]
      }
    ],
    projects: [
      {
        title: "Task Dashboard with DB",
        description: "Build a list application showing items fetched from a SQL database. Support category tags, due dates, and simple SQL filters.",
        difficulty: "Beginner",
        keySkills: ["React", "Express", "SQLite", "Prisma ORM"]
      },
      {
        title: "Landing Page with Form",
        description: "Design a high-fidelity marketing site with an interactive contact form, saving submissions to a backend spreadsheet API.",
        difficulty: "Beginner",
        keySkills: ["Next.js", "Tailwind CSS", "API Handlers", "Lucide Icons"]
      },
      {
        title: "Weather Search App",
        description: "Build a simple weather lookup page that queries coordinates from an API, displaying results with Tailwind animated cards.",
        difficulty: "Beginner",
        keySkills: ["React", "Fetch API", "Tailwind CSS", "CSS Animations"]
      },
      {
        title: "Multi-User Blog with Auth",
        description: "Create a blog platform where registered users can compose posts, upload cover photos, leave comments, and edit bios.",
        difficulty: "Intermediate",
        keySkills: ["Next.js", "PostgreSQL", "NextAuth.js", "Tailwind CSS"]
      },
      {
        title: "SaaS Launching Page",
        description: "Design a dashboard layout demonstrating analytics, team seats, mock credit card processing, and pricing structures.",
        difficulty: "Intermediate",
        keySkills: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"]
      },
      {
        title: "Real-Time Shared Checklist",
        description: "Build a multi-user shared checklist where updates and completions sync instantly across all open screens.",
        difficulty: "Intermediate",
        keySkills: ["React", "Express API", "Socket.io", "CSS Flexbox"]
      },
      {
        title: "Full SaaS Startup Template",
        description: "Develop a subscription dashboard with custom user tiers, Stripe subscription checkouts, workspace invites, and profile management.",
        difficulty: "Advanced",
        keySkills: ["Next.js App Router", "Prisma & Postgres", "Stripe API", "Tailwind CSS"]
      },
      {
        title: "Trello Clone (Kanban System)",
        description: "Implement a project planner app with columns, tasks, drag-and-drop actions, user assignments, task labels, and server state updates.",
        difficulty: "Advanced",
        keySkills: ["Next.js", "dnd-kit", "PostgreSQL", "Tailwind CSS", "Zustand"]
      },
      {
        title: "Headless Content Management",
        description: "Build a custom CMS allowing developers to specify content structures, write Markdown posts, and fetch files through dynamic REST keys.",
        difficulty: "Advanced",
        keySkills: ["Next.js", "MongoDB", "Dynamic API Routes", "TypeScript"]
      }
    ],
    resources: [
      {
        title: "The Odin Project - Full Stack Curriculum",
        url: "https://www.theodinproject.com",
        type: "Course",
        isFree: true
      },
      {
        title: "Full Stack Open - Deep Dive into Web App Development",
        url: "https://fullstackopen.com/en",
        type: "Course",
        isFree: true
      },
      {
        title: "freeCodeCamp - Learn MERN Stack & Next.js Tutorials",
        url: "https://www.freecodecamp.org",
        type: "Course",
        isFree: true
      },
      {
        title: "Next.js official docs - App Router, SSR, and Layouts",
        url: "https://nextjs.org/docs",
        type: "Documentation",
        isFree: true
      },
      {
        title: "MDN Web Docs - Comprehensive web standard reference",
        url: "https://developer.mozilla.org",
        type: "Documentation",
        isFree: true
      }
    ]
  },
  {
    id: "dataanalyst",
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Analyze large datasets, write query scripts, build interactive reporting dashboards, and extract insights to guide business decisions.",
    difficulty: "Easy",
    skillsCount: 10,
    salaryEstimate: "$70,000 - $115,000",
    iconName: "BarChart2",
    skills: ["Microsoft Excel", "SQL Queries", "Python Programming", "Pandas Library", "NumPy Library", "Tableau Creator", "Power BI", "Applied Statistics", "Data Visualization", "Data Wrangling & Cleaning"],
    roadmap: [
      {
        stage: 1,
        title: "Spreadsheet Analytics (Excel / Sheets)",
        description: "Master spreadsheet logic. Learn Pivot Tables, lookup functions (VLOOKUP, XLOOKUP), data sorting/filtering, and analytical chart building.",
        skills: ["Advanced Excel", "Pivot Tables", "Lookup Functions", "Data Charts"]
      },
      {
        stage: 2,
        title: "SQL Queries & Aggregations",
        description: "Learn how to query relational databases. Master SELECT filters, multi-table JOINS, GROUP BY, math aggregations, and subqueries.",
        skills: ["SELECT / WHERE Filters", "Table JOINS", "GROUP BY & SUM", "Subqueries"]
      },
      {
        stage: 3,
        title: "Python Programming & Jupyter Notebooks",
        description: "Move beyond spreadsheets. Learn Python programming fundamentals, notebook execution, and data structures.",
        skills: ["Python Syntax", "Jupyter Notebooks", "Lists & Dictionaries", "Writing Functions"]
      },
      {
        stage: 4,
        title: "Data Manipulation (Pandas & NumPy)",
        description: "Learn how to clean data programmatically. Master dataframes, loading CSV/JSON files, filtering null rows, and group transformations.",
        skills: ["Pandas DataFrames", "NumPy Math", "Data Cleaning", "Data Merging"]
      },
      {
        stage: 5,
        title: "Applied Probability & Statistics",
        description: "Learn the math behind the patterns. Understand probability distributions, hypothesis testing, A/B testing, and correlation vs regression.",
        skills: ["A/B Testing", "Probability Distributions", "Hypothesis Tests", "Linear Regression"]
      },
      {
        stage: 6,
        title: "Business Intelligence Tools (Tableau / Power BI)",
        description: "Communicate data findings. Learn how to load database sources, build interactive dashboards, and design stories for stakeholders.",
        skills: ["Tableau Basics", "Power BI Desktop", "Dashboard Designing", "Data Storytelling"]
      }
    ],
    projects: [
      {
        title: "Financial Budgeting Model",
        description: "Develop an Excel budgeting sheet with automated pivot tables, custom charts, forecasts, and expense category groupings.",
        difficulty: "Beginner",
        keySkills: ["Excel Formulas", "Pivot Tables", "Conditional Formatting", "Charts"]
      },
      {
        title: "Sales Report Dashboard",
        description: "Build an interactive Tableau dashboard showcasing product sales trends, state maps, revenue growth, and category slices.",
        difficulty: "Beginner",
        keySkills: ["Tableau Desktop", "Data Slices", "Mapping Widgets", "Data Joins"]
      },
      {
        title: "Web Scraped Dataset",
        description: "Write a python script that scrapes details from movie listing sites and outputs a clean CSV file with rows and fields.",
        difficulty: "Beginner",
        keySkills: ["Python", "BeautifulSoup", "CSV Library", "HTTP Requests"]
      },
      {
        title: "Movie Ratings Analysis",
        description: "Use Pandas to inspect a dataset of 10,000 films. Filter outliers, find average scores by genre, and plot rating distributions.",
        difficulty: "Intermediate",
        keySkills: ["Jupyter Notebook", "Pandas Dataframes", "Matplotlib / Seaborn", "Data Cleaning"]
      },
      {
        title: "HR Turnover Dashboard",
        description: "Create a Power BI dashboard tracking worker demographics, satisfaction scores, department stats, and employee attrition rate.",
        difficulty: "Intermediate",
        keySkills: ["Power BI", "DAX Formulas", "HR Analytics", "Data Modeling"]
      },
      {
        title: "Customer Segments Model",
        description: "Segment customer purchase history using RFM analysis. Classify users into loyalty levels and chart revenue per cluster.",
        difficulty: "Intermediate",
        keySkills: ["Python Programming", "Pandas", "RFM Metrics", "Seaborn Graphs"]
      },
      {
        title: "Global Emissions Interface",
        description: "Build a web dashboard analyzing historical carbon emissions since 1800, displaying dynamic maps and global indicators.",
        difficulty: "Advanced",
        keySkills: ["Python / Streamlit", "Plotly Express", "Pandas Dataframes", "Data Cleanups"]
      },
      {
        title: "Housing Market Price Predictor",
        description: "Clean real-estate values, check for correlations, perform regressions, and deploy a regression estimator script.",
        difficulty: "Advanced",
        keySkills: ["Scikit-Learn", "Linear Regression", "Pandas Dataframes", "Feature Engineering"]
      },
      {
        title: "Supply Chain Audit Model",
        description: "Analyze shipping dataset logs to find delivery delay bottlenecks, predict delays, and optimize warehousing operations.",
        difficulty: "Advanced",
        keySkills: ["Python Analytics", "NetworkX", "Pandas", "Process Optimization"]
      }
    ],
    resources: [
      {
        title: "Kaggle Learning Portal - Free Data Analytics Tutorials",
        url: "https://www.kaggle.com/learn",
        type: "Course",
        isFree: true
      },
      {
        title: "Python Data Science Handbook - Online Version",
        url: "https://jakevdp.github.io/PythonDataScienceHandbook",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Tableau Public Gallery - Dashboard examples and exercises",
        url: "https://public.tableau.com",
        type: "Documentation",
        isFree: true
      },
      {
        title: "SQLZoo - Interactive SQL Tutorial exercises",
        url: "https://sqlzoo.net",
        type: "Course",
        isFree: true
      },
      {
        title: "DataCamp - Free intro lessons on SQL, Python, R",
        url: "https://www.datacamp.org",
        type: "Course",
        isFree: true
      }
    ]
  },
  {
    id: "aiml",
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    description: "Build intelligent systems by training machine learning models, designing deep learning neural architectures, and deploying models to production environment.",
    difficulty: "Hard",
    skillsCount: 15,
    salaryEstimate: "$110,000 - $190,000",
    iconName: "Brain",
    skills: ["Python", "Linear Algebra", "Multivariable Calculus", "Probability & Statistics", "NumPy & Pandas", "Matplotlib & Seaborn", "Scikit-Learn", "PyTorch", "TensorFlow", "Deep Learning Architectures", "NLP (Natural Language Processing)", "Computer Vision", "Git & GitHub", "Docker Containers", "MLOps Pipelines"],
    roadmap: [
      {
        stage: 1,
        title: "Mathematical Foundations",
        description: "Master the mathematics that machine learning models are built on: Linear Algebra (matrices), Calculus (gradients), and Probability & Statistics.",
        skills: ["Linear Algebra", "Calculus & Derivatives", "Probability", "Descriptive Statistics"]
      },
      {
        stage: 2,
        title: "Data Preprocessing & Python",
        description: "Master Python programming and scientific libraries. Learn how to clean data, run calculations, and chart patterns.",
        skills: ["Python Programming", "NumPy Arrays", "Pandas DataFrames", "Data Visualization"]
      },
      {
        stage: 3,
        title: "Classical Machine Learning",
        description: "Understand basic models: linear regression, decision trees, random forests, clustering algorithms, and model assessment techniques.",
        skills: ["Scikit-Learn", "Regression & Classification", "Random Forests / SVMs", "K-Means Clustering"]
      },
      {
        stage: 4,
        title: "Deep Learning Foundations",
        description: "Build and train artificial neural networks. Learn feedforward layers, backpropagation, cost optimizers, and gradient steps using PyTorch or TensorFlow.",
        skills: ["Neural Networks", "PyTorch / TensorFlow", "Backpropagation", "Gradient Descent"]
      },
      {
        stage: 5,
        title: "Specialized Architectures (NLP & CV)",
        description: "Dive into specific AI systems: CNNs (Convolutional Neural Networks) for vision tasks, RNNs/LSTMs for text sequences, and Transformers for LLMs.",
        skills: ["Computer Vision (CNNs)", "NLP Basics", "Transformers & Attention", "Hugging Face APIs"]
      },
      {
        stage: 6,
        title: "MLOps & Model Deployments",
        description: "Deploy models as live web endpoints. Learn FastAPI servers, model export configurations, Docker packaging, and cloud hosting.",
        skills: ["FastAPI Servers", "Docker for ML", "Model Packaging (ONNX)", "AWS / GCP Deployments"]
      }
    ],
    projects: [
      {
        title: "House Price Estimator",
        description: "Build a regression model using Scikit-Learn that predicts housing prices based on features like bedrooms, location, and square footage.",
        difficulty: "Beginner",
        keySkills: ["Python", "Scikit-Learn", "Pandas", "Linear Regression"]
      },
      {
        title: "Iris Flower Classifier",
        description: "Write a classification script that sorts iris flower varieties using measurements like petal length and width.",
        difficulty: "Beginner",
        keySkills: ["Python", "Decision Trees", "NumPy", "Matplotlib"]
      },
      {
        title: "Handwritten Digit Recognizer",
        description: "Build a neural network classifier that processes images of handwritten numbers and recognizes digits with high accuracy.",
        difficulty: "Beginner",
        keySkills: ["TensorFlow / PyTorch", "Neural Networks", "MNIST Dataset", "NumPy"]
      },
      {
        title: "Twitter Sentiment Analyzer",
        description: "Build an NLP classification pipeline that tokenizes tweet text, filters stopwords, and identifies positive vs negative sentiment.",
        difficulty: "Intermediate",
        keySkills: ["PyTorch", "NLP Tokenization", "LSTM / GRU Layers", "Word Embeddings"]
      },
      {
        title: "Image Classification (CNN)",
        description: "Train a convolutional neural network (CNN) model to identify images of objects, animals, or vehicles into specific categories.",
        difficulty: "Intermediate",
        keySkills: ["PyTorch", "CNN Architectures", "Data Augmentation", "TensorBoard"]
      },
      {
        title: "Stock Price Forecaster",
        description: "Develop a time-series forecasting model using recurrent neural networks (LSTM) to predict stock prices based on history.",
        difficulty: "Intermediate",
        keySkills: ["TensorFlow", "LSTM Networks", "Time-series Parsing", "Pandas"]
      },
      {
        title: "Custom GPT Chatbot",
        description: "Build an end-to-end chat application leveraging a customized transformer model that generates conversational responses.",
        difficulty: "Advanced",
        keySkills: ["PyTorch", "Transformers", "Self-Attention", "Text Generation"]
      },
      {
        title: "Real-time Object Detector",
        description: "Build an app that consumes camera feeds and detects/outlines multiple objects in real-time with YOLO frameworks.",
        difficulty: "Advanced",
        keySkills: ["Computer Vision", "OpenCV", "YOLO Model", "FastAPI Serving"]
      },
      {
        title: "Game Reinforcement Agent",
        description: "Develop an autonomous agent that learns how to play games (like Pong or Flappy Bird) through deep Q-learning feedback loops.",
        difficulty: "Advanced",
        keySkills: ["PyTorch", "Q-Learning", "Gymnasium Environment", "State Matrices"]
      }
    ],
    resources: [
      {
        title: "fast.ai - Practical Deep Learning for Coders Course",
        url: "https://www.fast.ai",
        type: "Course",
        isFree: true
      },
      {
        title: "Coursera - Machine Learning Specialization by Andrew Ng",
        url: "https://www.coursera.org/specializations/machine-learning-introduction",
        type: "Course",
        isFree: true
      },
      {
        title: "PyTorch official learning tutorials and docs",
        url: "https://pytorch.org/tutorials",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Hugging Face Course - Transformers and NLP pipelines",
        url: "https://huggingface.co/learn",
        type: "Course",
        isFree: true
      },
      {
        title: "Kaggle - Machine Learning Datasets and Competition Notebooks",
        url: "https://www.kaggle.com",
        type: "Documentation",
        isFree: true
      }
    ]
  },
  {
    id: "mobile",
    slug: "mobile-developer",
    title: "Mobile Developer",
    description: "Create native and cross-platform mobile apps for iOS and Android devices, focusing on touch layout layouts, device hardware bindings, and offline persistence.",
    difficulty: "Medium",
    skillsCount: 11,
    salaryEstimate: "$80,000 - $140,000",
    iconName: "Smartphone",
    skills: ["Swift Programming", "Kotlin Programming", "React Native Framework", "Flutter Framework", "Dart Language", "Xcode IDE", "Android Studio IDE", "Mobile UI Layouts", "REST APIs", "Local DBs (SQLite, CoreData)", "App Store / Play Store Guidelines"],
    roadmap: [
      {
        stage: 1,
        title: "Mobile Programming Languages",
        description: "Learn Swift (iOS), Kotlin (Android), or JavaScript/Dart (Cross-Platform) programming language fundamentals.",
        skills: ["Swift / Kotlin / Dart", "Variable scopes & classes", "Object Oriented Logic", "Asynchronous Code"]
      },
      {
        stage: 2,
        title: "IDE & Tooling",
        description: "Master development environments: Xcode for Apple iOS setups and Android Studio for Google Android environments.",
        skills: ["Xcode Setup", "Android Studio", "Simulator & Emulator", "Gradle & CocoaPods"]
      },
      {
        stage: 3,
        title: "UI Design & Components",
        description: "Learn how mobile screens are laid out. Master declarative UI frameworks like SwiftUI, Jetpack Compose, or React Native components.",
        skills: ["SwiftUI / Jetpack Compose", "Flexbox / ScrollViews", "Navigation stacks", "Layout States"]
      },
      {
        stage: 4,
        title: "Data Fetching & APIs",
        description: "Connect your mobile app to the internet. Master HTTP headers, fetching data, parsing JSON, and loading remote images.",
        skills: ["URLSession / Axios / http", "JSON Parsing", "Async Tasks", "Image Cache Libraries"]
      },
      {
        stage: 5,
        title: "Local Database & Files",
        description: "Store user preferences and data offline. Learn SQLite, room databases, shared preferences, and offline-first state syncing.",
        skills: ["CoreData & Room DB", "SQLite", "Keychain Secure Storage", "Offline Sync Syncs"]
      },
      {
        stage: 6,
        title: "Hardware Features & Store Deployments",
        description: "Integrate device features like GPS sensors, cameras, and local notifications. Prepare builds and submit apps to App Store & Google Play.",
        skills: ["GPS & CoreLocation", "Push Notifications", "App Store Submission", "Play Store Console"]
      }
    ],
    projects: [
      {
        title: "Simple Counter App",
        description: "Build a counter application with increment/decrement buttons, custom style colors, and button click vibration effects.",
        difficulty: "Beginner",
        keySkills: ["SwiftUI / Compose", "State Variables", "Vibration API", "Colors styling"]
      },
      {
        title: "Tip Calculator",
        description: "Create a tip calculator allowing users to enter check totals, select tip percentages, split checks, and view totals.",
        difficulty: "Beginner",
        keySkills: ["Mobile Inputs", "Math Operations", "Format Slices", "Responsive Layouts"]
      },
      {
        title: "Unit Converter Mobile",
        description: "Construct a mobile utility page that converts measurements (weights, lengths, temperatures) with dynamic picker lists.",
        difficulty: "Beginner",
        keySkills: ["Pickers", "Unit Conversion Formulas", "Declarative UI", "Touch Feedback"]
      },
      {
        title: "Weather Mobile App",
        description: "Build a responsive weather application that retrieves forecasts, handles network drops gracefully, and updates weather graphics.",
        difficulty: "Intermediate",
        keySkills: ["REST API", "JSON Parsing", "Network Checking", "Local Storage"]
      },
      {
        title: "Habit Tracker App",
        description: "Create an app tracking habits, showing calendar grid progressions, sending local push reminders, and persisting progress.",
        difficulty: "Intermediate",
        keySkills: ["Local Database (Room/CoreData)", "Local Notifications", "Grid layouts", "Dates calculations"]
      },
      {
        title: "Notes App with local DB",
        description: "Develop a note-taking application supporting folder hierarchies, title searches, full markdown syntax, and offline database persistence.",
        difficulty: "Intermediate",
        keySkills: ["SQLite / CoreData", "Markdown Rendering", "Full-text Search", "Folders Stack"]
      },
      {
        title: "Real-time Messaging Mobile",
        description: "Develop a chat app utilizing real-time sockets, scroll locks, keyboard offsets, offline drafts, and image attachment previews.",
        difficulty: "Advanced",
        keySkills: ["React Native / Flutter", "WebSockets", "Keyboard Observers", "Photo Gallery API"]
      },
      {
        title: "Offline-first Map Navigator",
        description: "Build an interactive mapping application that caches geolocations, displays custom pins, tracks path lines, and operates offline.",
        difficulty: "Advanced",
        keySkills: ["Mapbox / Google Maps SDK", "GPS Tracking", "Local Offline Caches", "Background Location"]
      },
      {
        title: "Mobile E-Commerce App",
        description: "Develop an app showcasing products, categories, dynamic item carts, checkout pages, and local mock purchase processing.",
        difficulty: "Advanced",
        keySkills: ["Redux / Riverpod", "REST API", "Apple Pay / Google Pay simulation", "Custom UI animations"]
      }
    ],
    resources: [
      {
        title: "Swift Playgrounds - Interactive iOS Tutorial App",
        url: "https://www.apple.com/swift/playgrounds",
        type: "Course",
        isFree: true
      },
      {
        title: "Android Developers Guide - Kotlin and Compose Docs",
        url: "https://developer.android.com/courses",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Flutter documentation - Widgets, States, and SDK guides",
        url: "https://docs.flutter.dev",
        type: "Documentation",
        isFree: true
      },
      {
        title: "React Native guides - Component reference and bridge setup",
        url: "https://reactnative.dev/docs/getting-started",
        type: "Documentation",
        isFree: true
      },
      {
        title: "Ray Wenderlich / Kodeco - Mobile Dev tutorials",
        url: "https://www.kodeco.com",
        type: "Course",
        isFree: true
      }
    ]
  }
];
