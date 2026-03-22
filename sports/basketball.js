import fetch from 'node-fetch';
import { APIs } from '../config/api.js';
import { getCache, setCache } from '../utils/cache.js';

export async function getBasketballScores() {
  const cached = getCache('basketball');
  if (cached) return cached;

  const today = new Date().toISOString().split('T')[0];

  const res = await fetch(
    `${APIs.basketball.baseUrl}/games?dates[]=${today}`,
    { headers: { Authorization: APIs.basketball.key } }
  );
  const json = await res.json();

  if (!json.data) throw new Error('Basketball API error: ' + JSON.stringify(json));

  const matches = json.data.map((g) => ({
    id: g.id,
    home: g.home_team.full_name,
    away: g.visitor_team.full_name,
    score: `${g.home_team_score} - ${g.visitor_team_score}`,
    status: g.status,           // "Final", "1st Qtr", "Halftime" etc.
    currentAction: g.period > 0 ? `Period ${g.period} — ${g.time || ''}` : null,
    venue: null,
    startTime: g.date || null,
  }));

  setCache('basketball', matches, 60);
  return matches;
}