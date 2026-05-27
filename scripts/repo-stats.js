const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INPUT_FILE = path.join(ROOT_DIR, 'projects.json');
const LEGACY_INPUT_FILE = path.join(ROOT_DIR, 'public', 'projects.json');
const LEGACY_PROJECTS_COPY_FILE = path.join(ROOT_DIR, 'public', 'projects.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'repository-stats.json');
const LEGACY_OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'generated', 'repository-stats.json');

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
  const topTags = [...tagCounts.entries()]
    .sort(([tagA, countA], [tagB, countB]) => {
      if (countB !== countA) return countB - countA;
      return tagA.localeCompare(tagB);
    })
    .slice(0, 6)
    .map(([tag, count]) => ({ tag, count }));

  return {
    totalProjects: projectRows.filter(isValidProjectRow).length,
    countsByDifficulty: [...DIFFICULTY_ORDER, ...Object.keys(difficultyCounts).filter((difficulty) => !DIFFICULTY_ORDER.includes(difficulty)).sort()].reduce((counts, difficulty) => {
      counts[difficulty] = difficultyCounts[difficulty] || 0;
      return counts;
    }, {}),
    countsByTag,
    topTags,
  };
}

function main() {
  const inputFile = fs.existsSync(INPUT_FILE) ? INPUT_FILE : LEGACY_INPUT_FILE;
  const projects = readProjects(inputFile);
  const stats = buildStats(projects);

  fs.writeFileSync(INPUT_FILE, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
  fs.writeFileSync(LEGACY_PROJECTS_COPY_FILE, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
  fs.mkdirSync(path.dirname(LEGACY_OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(LEGACY_OUTPUT_FILE, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${OUTPUT_FILE}`);
}

main();