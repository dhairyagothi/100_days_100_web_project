// src/utils/progressionEngine.js
import { getQForTopicLevel, TOPICS, LEVELS } from './questionData';

/**
 * canUnlock — all levels are now freely accessible.
 * Lock system removed; kept for API compatibility.
 */
export function canUnlock(_userProgress, _topic, _targetLevel) {
  return true;
}

/**
 * Get the current operating level for a topic (highest level where they solved > 0)
 */
export function getHighestUnlockedLevel(userProgress, topic) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const status = getLevelStatus(userProgress, topic, LEVELS[i]);
    if (status.solved > 0) return LEVELS[i];
  }
  return 800; // default starting level
}

/**
 * Calculate overall progress percentage for a topic
 */
export function getTopicProgress(userProgress, topic) {
  let totalSolved = 0;
  let totalQuestions = 0;

  for (const level of LEVELS) {
    const status = getLevelStatus(userProgress, topic, level);
    totalSolved += status.solved;
    totalQuestions += status.total;
  }

  if (totalQuestions === 0) return 0;
  return Math.round((totalSolved / totalQuestions) * 100);
}

/**
 * Get level completion status: { solved, total, complete }
 */
export function getLevelStatus(userProgress, topic, level) {
  const solvedIds = userProgress?.[topic]?.[level]?.solved ?? [];
  const questions = getQForTopicLevel(topic, level);
  
  // Filter solved IDs to only count problems that currently exist in this level
  const validSolvedCount = solvedIds.filter(id => questions.some(q => q.id === id)).length;
  
  return {
    solved: validSolvedCount,
    total: questions.length,
    complete: questions.length > 0 && validSolvedCount >= questions.length,
  };
}

/**
 * Count topics where user has mastered the basics (fully completed 800, 900, 1000)
 */
export function getTopicsMastered(userProgress) {
  return TOPICS.filter(t => {
    const s800 = getLevelStatus(userProgress, t, 800).complete;
    const s900 = getLevelStatus(userProgress, t, 900).complete;
    const s1000 = getLevelStatus(userProgress, t, 1000).complete;
    
    // Some topics might not have questions for a level yet; let's say they must complete all existing
    // basic levels, and have at least *some* questions in those levels to be considered "mastered".
    return s800 && s900 && s1000;
  }).length;
}
