import fetch from 'node-fetch';
import {APIs} from '../config/api.js';
import {getCache,setCache} from '../utils/cache.js';
import dotenv from 'dotenv';
dotenv.config();

export async function getCricketScores(){

    const cached = getCache('crickert');
    
    if(cached) return cached;

    const res = await fetch(`${APIs.cricket.baseUrl}/currentMatches?apikey=${APIs.cricket.key}&offset=0`);  

    const json= await res.json();
    if (!json.data) throw new Error('Cricket API error: ' + JSON.stringify(json));

    const matches = json.data.map((m) =>({
        id: m.id,
        home: m.teams?.[0] || 'Team A',
        away: m.teams?.[1] || 'Team B',
        score: formatCricketScore(m),
        status: m.status || 'unknown',
        currentAction: m.status,           
        venue: m.venue || null,              
        startTime: m.dateTimeGMT || null,

    }));
    setCache('cricket', matches, 300); // 5 min TTL — protects 100/day limit
    return matches;

}

function formatCricketScore(match) {
  if (!match.score || match.score.length === 0) return 'Yet to start';
  return match.score
    .map((s) => `${s.inning}: ${s.r}/${s.w} (${s.o} ov)`)
    .join(' | ');
}

// TEMP TEST — remove this before hooking into MCP
getCricketScores()
  .then((matches) => {
    console.log('Total matches found:', matches.length);
    console.log(JSON.stringify(matches, null, 2));
  })
  .catch((err) => {
    console.error('Error:', err.message);
  });