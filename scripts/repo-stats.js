const fs = require('fs');
const path = require('path');

const PROJECTS_JSON = path.join(__dirname, '..', 'projects.json');
const OUTPUT_JSON = path.join(__dirname, '..', 'repository-stats.json');

function loadProjects() {
  const raw = fs.readFileSync(PROJECTS_JSON, 'utf8');
  return JSON.parse(raw);
}

// Normalization map for common tag aliases
const TAG_MAP = {
  js: 'javascript',
  javascript: 'javascript',
  html: 'html',
  htm: 'html',
  css: 'css',
  ts: 'typescript',
  typescript: 'typescript',
  node: 'javascript',
  'api-javascript': 'api',
  'html5': 'html',
};

function normalizeTag(tag) {
  if (!tag || typeof tag !== 'string') return null;
  const t = tag.trim().toLowerCase();
  return TAG_MAP[t] || t;
}

function isExternalPath(p) {
  if (!p || typeof p !== 'string') return false;
  return p.trim().startsWith('http://') || p.trim().startsWith('https://');
}

function generateStats(projects) {
  const stats = {
    generated_at: new Date().toISOString(),
    total_projects: projects.length,
    by_type: {},
    by_difficulty: {},
    top_tech_tags: [],
    tech_tag_counts: {},
    external_demos: 0,
    local_demos: 0,
    source_only_count: 0,
  };

  const tagProjectSet = {}; // tag -> set of projectNos

  projects.forEach((p) => {
    // projectType
    const type = (p.projectType || 'unknown').toString().trim().toLowerCase();
    stats.by_type[type] = (stats.by_type[type] || 0) + 1;

    // difficulty
    const diff = (p.difficulty || 'unknown').toString().trim().toLowerCase();
    stats.by_difficulty[diff] = (stats.by_difficulty[diff] || 0) + 1;

    // path external/local
    if (isExternalPath(p.projectPath)) stats.external_demos++;
    else stats.local_demos++;

    // tech tags
    const tags = Array.isArray(p.techStack) ? p.techStack : [];
    const projectId = p.projectNo != null ? String(p.projectNo) : JSON.stringify(p.projectName);
    tags.forEach((rawTag) => {
      const t = normalizeTag(rawTag);
      if (!t) return;

      // count occurrences (may be multiple per project but we want per-project counts later)
      stats.tech_tag_counts[t] = (stats.tech_tag_counts[t] || 0) + 1;

      if (!tagProjectSet[t]) tagProjectSet[t] = new Set();
      tagProjectSet[t].add(projectId);

      if (t === 'source-only') stats.source_only_count++;
    });
  });

  // Build top_tech_tags sorted by number of projects containing the tag
  const tagsByProjects = Object.entries(tagProjectSet).map(([tag, set]) => ({ tag, projects: set.size }));
  tagsByProjects.sort((a, b) => b.projects - a.projects || a.tag.localeCompare(b.tag));

  // Keep only the top 10 tags for the summary; full counts remain in tech_tag_counts
  stats.top_tech_tags = tagsByProjects.slice(0, 10);

  // Remove internal helper if empty
  if (Object.keys(stats.tech_tag_counts).length === 0) delete stats.tech_tag_counts;

  return stats;
}

function writeOutput(stats) {
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(stats, null, 2) + '\n', 'utf8');
}

function main() {
  try {
    const projects = loadProjects();
    const stats = generateStats(projects);
    writeOutput(stats);
    console.log('repository-stats.json generated successfully.');
  } catch (err) {
    console.error('Failed to generate repository-stats.json:', err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
