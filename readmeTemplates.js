export const commonSections = `## Overview

Describe the project and what it does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

Explain how to run and use the project.

## Contributing

Describe how contributors can submit pull requests and contribute.

## License

Add your license information here.
`;

const README_TEMPLATES = {
  react: `# Project Title

## Tech Stack

- React
- Vite
- JavaScript
- CSS

## Installation

``bash
git clone https://github.com/yourusername/your-react-project.git
cd your-react-project
npm install
npm start
``

${commonSections}`,
  node: `# Project Title

## Tech Stack

- Node.js
- Express
- JavaScript
- npm

## Installation

``bash
git clone https://github.com/yourusername/your-node-project.git
cd your-node-project
npm install
npm start
``

${commonSections}`,
  portfolio: `# Portfolio Website

## Tech Stack

- HTML
- CSS
- JavaScript
- Responsive Design

## Installation

``bash
git clone https://github.com/yourusername/your-portfolio.git
cd your-portfolio
npm install
npm run dev
``

${commonSections}`,
  python: `# Project Title

## Tech Stack

- Python
- Virtualenv
- pip
- Flask or Django

## Installation

``bash
git clone https://github.com/yourusername/your-python-project.git
cd your-python-project
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
``

${commonSections}`,
};

export default README_TEMPLATES;
