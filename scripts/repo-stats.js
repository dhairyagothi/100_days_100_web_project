const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INPUT_FILE = path.join(ROOT_DIR, 'public', 'projects.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'generated', 'repository-stats.json');

const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function readProjects(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error('projects.json must contain an array of projects');
  }

  return data;
}

function isValidProjectRow(row) {
  return Array.isArray(row)
    && typeof row[0] === 'string'
    && row[0].trim()
    && typeof row[1] === 'string'
    && row[1].trim()
    && typeof row[2] === 'string'
    && row[2].trim();
}

function toTagList(tags) {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return [...new Set(tags.map(normalizeText).filter(Boolean))];
  }

  return [...new Set(String(tags)
    .split(',')
    .map(normalizeText)
    .filter(Boolean))];
}

function createEmptyDifficultyCounts() {
  return DIFFICULTY_ORDER.reduce((counts, difficulty) => {
    counts[difficulty] = 0;
    return counts;
  }, {});
}

function buildStats(projectRows) {
  const difficultyCounts = createEmptyDifficultyCounts();
  const tagCounts = new Map();

  for (const row of projectRows) {
    if (!isValidProjectRow(row)) continue;

    const difficulty = normalizeText(row[4]) || 'unknown';
    difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;

    for (const tag of toTagList(row[3])) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const countsByTag = Object.fromEntries([...tagCounts.entries()].sort(([a], [b]) => a.localeCompare(b)));

  return {
    totalProjects: projectRows.filter(isValidProjectRow).length,
    countsByDifficulty: [...DIFFICULTY_ORDER, ...Object.keys(difficultyCounts).filter((difficulty) => !DIFFICULTY_ORDER.includes(difficulty)).sort()].reduce((counts, difficulty) => {
      counts[difficulty] = difficultyCounts[difficulty] || 0;
      return counts;
    }, {}),
    countsByTag,
  };
}

function main() {
  const projects = readProjects(INPUT_FILE);
  const stats = buildStats(projects);

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${OUTPUT_FILE}`);
}

main();