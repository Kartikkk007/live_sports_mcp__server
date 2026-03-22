export function normalizeMatches(sport, rawMatches) {
  return rawMatches.map((match) => ({
    sport,
    matchId: match.id || match.gameId || match.gamePk || null,
    teams: {
      home: match.home || null,
      away: match.away || null,
    },
    score: match.score || null,
    status: match.status || 'unknown',
    currentAction: match.currentAction || null,
    venue: match.venue || null,
    startTime: match.startTime || null,
  }));
}