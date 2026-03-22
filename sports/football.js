import fetch from 'node-fetch';
import { APIs } from '../config/api.js';
import { getCache, setCache } from '../utils/cache.js';

// Fetches live/today's matches across top competitions
export async function getFootballScores() {
  const cached = getCache('football');
  if (cached) return cached;

  const today = new Date().toISOString().split('T')[0];

  const res = await fetch(
    `${APIs.football.baseUrl}/matches?dateFrom=${today}&dateTo=${today}`,
    { headers: { 'X-Auth-Token': APIs.football.key } }
  );
  const json = await res.json();

  if (!json.matches) throw new Error('Football API error: ' + JSON.stringify(json));

  const matches = json.matches.map((m) => ({
    id: m.id,
    home: m.homeTeam.name,
    away: m.awayTeam.name,
    score: `${m.score.fullTime.home ?? '-'} - ${m.score.fullTime.away ?? '-'}`,
    status: m.status,           // SCHEDULED, LIVE, IN_PLAY, FINISHED
    currentAction: m.status === 'IN_PLAY' ? `${m.minute ?? '?'}'` : null,
    venue: m.venue || null,
    startTime: m.utcDate || null,
    competition: m.competition.name,
  }));

  setCache('football', matches, 60); // 1 min TTL
  return matches;
}