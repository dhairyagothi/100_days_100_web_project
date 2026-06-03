export const commonSections = {
  overview: `## Overview

Describe the project and what it does.
`,
  features: `## Features

- Feature 1
- Feature 2
- Feature 3
`,
  usage: `## Usage

Explain how to run and use the project.
`,
  contributing: `## Contributing

Describe how contributors can submit pull requests and contribute.
`,
  license: `## License

Add your license information here.
`,
};

const README_TEMPLATES = {
  react: `# Project Title

${commonSections.overview}
${commonSections.features}
## Tech Stack

- React
- Vite
- JavaScript
- CSS

## Installation

\`\`\`bash
git clone https://github.com/yourusername/your-react-project.git
cd your-react-project
npm install
npm run dev
\`\`\`

${commonSections.usage}
${commonSections.contributing}
${commonSections.license}`,
  node: `# Project Title

${commonSections.overview}
${commonSections.features}
## Tech Stack

- Node.js
- Express
- JavaScript
- npm

## Installation

\`\`\`bash
git clone https://github.com/yourusername/your-node-project.git
cd your-node-project
npm install
npm start
\`\`\`

${commonSections.usage}
${commonSections.contributing}
${commonSections.license}`,
  portfolio: `# Portfolio Website

${commonSections.overview}
${commonSections.features}
## Tech Stack

- HTML
- CSS
- JavaScript

## Installation

\`\`\`bash
git clone https://github.com/yourusername/your-portfolio.git
cd your-portfolio
npm install
npm run dev
\`\`\`

${commonSections.usage}
${commonSections.contributing}
${commonSections.license}`,
  python: `# Project Title

${commonSections.overview}
${commonSections.features}
## Tech Stack

- Python
- Virtualenv
- pip
- Flask or Django

## Installation

\`\`\`bash
git clone https://github.com/yourusername/your-python-project.git
cd your-python-project
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
\`\`\`

${commonSections.usage}
${commonSections.contributing}
${commonSections.license}`,
  fullStack: `# Project Title

${commonSections.overview}
${commonSections.features}

## Tech Stack

-Frontend
    -React
    -CSS

-Backend
    -Node
    -Express
    -Javascript

## Installation

\`\`\`bash
git clone https://github.com/yourusername/your-python-project.git
cd your-project

# ==========================================
# 1. BACKEND SETUP
# ==========================================
cd backend
npm install
npm start

# ==========================================
# 1. FRONTEND SETUP
# ==========================================
cd frontend
npm install
npm run dev

\`\`\`

${commonSections.usage}
${commonSections.contributing}
${commonSections.license}`,
};

export default README_TEMPLATES;
