// src/services/codeforcesService.js
const CF_BASE = 'https://codeforces.com/api';

export async function getCFUserInfo(handle) {
  const res = await fetch(`${CF_BASE}/user.info?handles=${handle}`);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error(data.comment || 'Invalid handle');
  return data.result[0];
}

export async function getCFSubmissions(handle) {
  const res = await fetch(`${CF_BASE}/user.status?handle=${handle}&from=1&count=10000`);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error(data.comment || 'Failed to fetch');
  return data.result;
}

export function extractSolvedProblems(submissions) {
  const seen = new Set();
  const solved = [];

  for (const sub of submissions) {
    if (sub.verdict !== 'OK') continue;
    const { problem } = sub;
    const contestId = problem.contestId;
    const index = problem.index;
    if (!contestId || !index) continue;

    const id = `${contestId}-${index}`;
    if (!seen.has(id)) {
      seen.add(id);
      solved.push({
        id,
        contestId,
        index,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags || [],
      });
    }
  }
  return solved;
}

export function extractCFActivity(submissions) {
  const cfDates = {};
  for (const sub of submissions) {
    if (sub.verdict !== 'OK' || !sub.creationTimeSeconds) continue;
    
    // Convert creationTimeSeconds to YYYY-MM-DD in local time
    const d = new Date(sub.creationTimeSeconds * 1000);
    // Pad to ensure consistent two digit months and days
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    cfDates[dateStr] = (cfDates[dateStr] || 0) + 1;
  }
  return cfDates;
}
