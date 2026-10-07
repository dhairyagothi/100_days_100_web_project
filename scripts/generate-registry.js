const fs = require('fs');
const path = require('path');

// Target paths based on repository layout
const ROOT_DIR = path.join(__dirname, '../');
const OUTPUT_FILE = path.join(__dirname, '../public/projects.json'); 

// The Learning Curriculum JSON schema you provided
const learningCurriculum = {
  "categories": [
    {
      "id": "html",
      "title": "HTML Basics",
      "icon": "fa-brands fa-html5",
      "topics": [
        { "id": "introduction", "title": "Introduction to HTML", "file": "topics/html/introduction.md" },
        { "id": "elements", "title": "HTML Elements & Attributes", "file": "topics/html/elements.md" },
        { "id": "headings", "title": "Headings & Paragraphs", "file": "topics/html/headings.md" },
        { "id": "links", "title": "Links & Images", "file": "topics/html/links.md" },
        { "id": "tables", "title": "HTML Tables", "file": "topics/html/tables.md" },
        { "id": "forms", "title": "HTML Forms & Input", "file": "topics/html/forms.md" },
        { "id": "semantic-html", "title": "Semantic HTML", "file": "topics/html/semantic-html.md" }
      ]
    },
    {
      "id": "css",
      "title": "CSS Styling",
      "icon": "fa-brands fa-css3-alt",
      "topics": [
        { "id": "selectors", "title": "CSS Selectors & Specificity", "file": "topics/css/selectors.md" },
        { "id": "colors", "title": "Colors & Backgrounds", "file": "topics/css/colors.md" },
        { "id": "box-model", "title": "CSS Box Model", "file": "topics/css/box-model.md" },
        { "id": "flexbox", "title": "CSS Flexbox Layout", "file": "topics/css/flexbox.md" },
        { "id": "grid", "title": "CSS Grid Layout", "file": "topics/css/grid.md" },
        { "id": "animations", "title": "Transitions & Animations", "file": "topics/css/animations.md" },
        { "id": "responsive-design", "title": "Responsive Design & Media Queries", "file": "topics/css/responsive-design.md" }
      ]
    },
    {
      "id": "javascript",
      "title": "JavaScript Programming",
      "icon": "fa-brands fa-js",
      "topics": [
        { "id": "variables", "title": "Variables & Scope", "file": "topics/js/variables.md" },
        { "id": "data-types", "title": "Data Types & Operators", "file": "topics/js/data-types.md" },
        { "id": "functions", "title": "Functions & Arrow Syntax", "file": "topics/js/functions.md" },
        { "id": "arrays", "title": "Arrays & Array Methods", "file": "topics/js/arrays.md" },
        { "id": "objects", "title": "Objects & JSON", "file": "topics/js/objects.md" },
        { "id": "loops", "title": "Loops & Iteration", "file": "topics/js/loops.md" },
        { "id": "dom", "title": "DOM Manipulation", "file": "topics/js/dom.md" },
        { "id": "events", "title": "Event Handling", "file": "topics/js/events.md" }
      ]
    }
  ]
};

function generateRegistry() {
  const projects = [];
  const files = fs.readdirSync(ROOT_DIR);

  // System/infrastructure directories to ignore when scanning for code projects
  const ignoredFolders = ['.github', '.vercel', 'contributors', 'node_modules', 'public', 'scripts'];

  console.log("🔍 Scanning project directories...");

  files.forEach((file) => {
    const fullPath = path.join(ROOT_DIR, file);
    
    if (fs.statSync(fullPath).isDirectory() && !file.startsWith('.') && !ignoredFolders.includes(file)) {
      const metadataPath = path.join(fullPath, 'metadata.json');

      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
          projects.push({
            id: file,
            type: 'project', // Tagging the type for frontend filtering
            ...metadata
          });
        } catch (error) {
          console.error(`❌ Error parsing JSON in folder: ${file}`, error);
        }
      } else {
        console.warn(`⚠️ Missing metadata.json in folder: ${file}`);
      }
    }
  });

  // Compile the final production payload combining projects & curriculum data
  const finalMasterRegistry = {
    totalProjects: projects.length,
    buildProjects: projects,
    learningCurriculum: learningCurriculum.categories
  };

  // Guard clause to guarantee the public/ folder exists before writing
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)){
      fs.mkdirSync(publicDir);
  }

  // Write out clean, pretty-printed JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMasterRegistry, null, 2), 'utf8');
  console.log(`\n==================================================`);
  console.log(`✅ Success! Data written to: public/projects.json`);
  console.log(`🛠️ Total Build Projects Indexed: ${projects.length}`);
  console.log(`📚 Core Learning tracks Integrated: ${learningCurriculum.categories.length}`);
  console.log(`==================================================\n`);
}

generateRegistry();