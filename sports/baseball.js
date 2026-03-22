import fetch from 'node-fetch';
import { APIs } from '../config/api.js';
import { getCache, setCache } from '../utils/cache.js';

export async function getBaseballScores() {
  const cached = getCache('baseball');
  if (cached) return cached;

  const today = new Date().toISOString().split('T')[0];

  const res = await fetch(
    `${APIs.baseball.baseUrl}/schedule?sportId=1&date=${today}&hydrate=linescore`
  );
  const json = await res.json();

  const games = json.dates?.[0]?.games || [];

  const matches = games.map((g) => ({
    id: g.gamePk,
    home: g.teams.home.team.name,
    away: g.teams.away.team.name,
    score: `${g.teams.away.score ?? 0} - ${g.teams.home.score ?? 0}`,
    status: g.status.detailedState,   
    currentAction: formatBaseballAction(g.linescore),
    venue: g.venue?.name || null,
    startTime: g.gameDate || null,
  }));

  setCache('baseball', matches, 60);
  return matches;
}

function formatBaseballAction(linescore) {
  if (!linescore) return null;
  const inning = linescore.currentInning;
  const half = linescore.inningHalf;   
  const outs = linescore.outs;
  if (!inning) return null;
  return `${half} of inning ${inning} — ${outs} out(s)`;
}