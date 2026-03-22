import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { getCricketScores }    from './sports/cricket.js';
import { getFootballScores }   from './sports/football.js';
import { getBasketballScores } from './sports/basketball.js';
import { getBaseballScores }   from './sports/baseball.js';
import { normalizeMatches }    from './utils/normalize.js';

const server = new McpServer({
  name: 'sports-scores-mcp',
  version: '1.0.0',
});

// Helper — wraps fetch + normalize + error handling for any sport
async function sportTool(sport, fetchFn) {
  try {
    const raw = await fetchFn();
    const normalized = normalizeMatches(sport, raw);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(normalized, null, 2),
      }],
    };
  } catch (err) {
    return {
      content: [{
        type: 'text',
        text: `Error fetching ${sport} scores: ${err.message}`,
      }],
      isError: true,
    };
  }
}

server.registerTool('get_cricket_scores', {
  description: 'Get live cricket match scores',
  inputSchema: {},
}, () => sportTool('cricket', getCricketScores));

server.registerTool('get_football_scores', {
  description: 'Get live football match scores',
  inputSchema: {},
}, () => sportTool('football', getFootballScores));

server.registerTool('get_basketball_scores', {
  description: 'Get live NBA basketball scores',
  inputSchema: {},
}, () => sportTool('basketball', getBasketballScores));

server.registerTool('get_baseball_scores', {
  description: 'Get live MLB baseball scores',
  inputSchema: {},
}, () => sportTool('baseball', getBaseballScores));

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Sports Scores MCP server running...');