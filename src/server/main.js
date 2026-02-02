import dotenv from 'dotenv'
dotenv.config()         
import pkg from 'pg';
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000  // read from .env

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
// Enable CORS for all origins
app.use(cors())

app.use(express.json())
const apiKey = process.env.riotApiKey;
//Get list of matches from /lol/match/v5/matches/by-puuid/{puuid}/ids
//Pull last 10 matches from https://metatft-matches-2.ams3.digitaloceanspaces.com/NA1_5449502245.json

/** 
function detectDuoByRange(players) {

  try {
  const ratings = players.map(p => p.ranked.rating_numeric).sort((a, b) => a - b);
  
  const min = ratings[0];
  const max = ratings[ratings.length - 1];
  const range = max - min;
  
  // Remove min and max, check remaining players
  const coreRatings = ratings.slice(1, -1);
  const coreMean = coreRatings.reduce((sum, r) => sum + r, 0) / coreRatings.length;
  const coreRange = Math.max(...coreRatings) - Math.min(...coreRatings);
  
  // If min or max differs significantly from core group
  const minDiffFromCore = Math.abs(min - coreMean);
  const maxDiffFromCore = Math.abs(max - coreMean);
  
  const MMR_THRESHOLD = 200;
  
  const hasLowOutlier = minDiffFromCore > MMR_THRESHOLD;
  const hasHighOutlier = maxDiffFromCore > MMR_THRESHOLD;
  
  // Only flag if BOTH extremes are outliers (suggests duo)
  const isSuspiciousDuo = hasLowOutlier && hasHighOutlier;
  
  return {
    totalRange: range,
    ratings:ratings,
    coreRange: coreRange,
    coreMean: Math.round(coreMean),
    minDiffFromCore: Math.round(minDiffFromCore),
    maxDiffFromCore: Math.round(maxDiffFromCore),
    isSuspiciousDuo,
    lowOutlier: hasLowOutlier ? players.find(p => p.ranked.rating_numeric === min) : null,
    highOutlier: hasHighOutlier ? players.find(p => p.ranked.rating_numeric === max) : null,
    reason: isSuspiciousDuo 
      ? 'Both low and high outliers detected - likely duo queue'
      : hasLowOutlier || hasHighOutlier 
        ? 'Single outlier - just bad MMR matchmaking'
        : 'Lobby appears balanced'
  };
}

catch{
return false

}
}
*/
//API Endpoint /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine} to get PUIDD
async function getRiotPuuiD(region, name, tag) {
  try {
    const response = await fetch(
      `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Riot API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Riot fetch failed:', error.message);
    throw error; // propagate to Express
  }
}


async function getRoutingRegion(region,puuid) {
  try {
    // Make the Riot API request
  
    const response = await fetch(
      `https://${region}.api.riotgames.com/riot/account/v1/region/by-game/tft/by-puuid/${puuid}?api_key=${apiKey}`
    );

    // Check if response is OK (200-299)
    if (!response.ok) {
      const error = new Error(`Riot API error: ${response.status} ${response.statusText}`);
      error.status = response.status; // attach HTTP status for route-level handling
      throw error;
    }

    // Parse JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Log error for debugging
    console.error('Error fetching routing region:', error.message);

    // Propagate the error to caller so route can handle it
    throw error;
  }
}


function getRegionMatch(routingRegion) {
  
    const routingRelationship = {
      na: "AMERICAS",      // North America
      br: "AMERICAS",      // Brazil
      lan: "AMERICAS",     // Latin America North
      las: "AMERICAS",     // Latin America South
      kr: "ASIA",          // Korea
      jp: "ASIA",          // Japan
      eune: "EUROPE",       // EU Nordic & East
      euw: "EUROPE",        // EU West
      tr: "EUROPE",         // Turkey
      me1: "EUROPE",        // Middle East (served under Europe region)
      ru: "EUROPE",         // Russia
      oce: "SEA",          // Oceania
      sg2: "SEA",          // Singapore / SEA shard
      tw2: "SEA",          // Taiwan
      vn2: "SEA"           // Vietnam
    };

  const region = routingRelationship[routingRegion.toLowerCase()]


  return region
}



function getRegionAccount(routingRegion) {

  
    const routingRelationship = {
      na: "AMERICAS",      // North America
      br: "AMERICAS",      // Brazil
      lan: "AMERICAS",     // Latin America North
      las: "AMERICAS",     // Latin America South
      kr: "ASIA",          // Korea
      jp: "ASIA",          // Japan
      eune: "EUROPE",       // EU Nordic & East
      euw: "EUROPE",        // EU West
      tr: "EUROPE",         // Turkey
      me1: "EUROPE",        // Middle East (served under Europe region)
      ru: "EUROPE",         // Russia
      oce: "ASIA",          // Oceania
      sg2: "ASIA",          // Singapore / SEA shard
      tw2: "ASIA",          // Taiwan
      vn2: "ASIA"           // Vietnam
    };


  const region = routingRelationship[routingRegion.toLowerCase()]
  return region
}


async function getMatches(puuid, region, count = 50) {
  try {
    const url = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`Riot API error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching matches:', error.message);
    throw error; // propagate to caller
  }
}



async function getMatchData(gameId) {
  try {
    const url = `https://metatft-matches-2.ams3.digitaloceanspaces.com/${gameId}.json`;
  
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`Match data fetch error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    const json = await response.json();

    const players = {queueId: json.info.queueId, players: json._metatft.participant_info, dateTime: json.info.game_datetime}
    return players

  } catch (error) {
    return error;
  }
}



async function GetPlayerMetaData(routingRegion,puuid) {
  try {
    const url = `https://${routingRegion}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}?api_key=${apiKey}`;
    const summonerData = await getSummonerData(puuid,routingRegion)
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`Match data fetch error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }
    const metaData = []
    const data = await response.json();

    for(const item of data){
      if(item.queueType == 'RANKED_TFT'){
        metaData.push(item)
      }
    }

    return [{...metaData[0],iconId:`https://ddragon.leagueoflegends.com/cdn/15.24.1/img/profileicon/${summonerData.profileIconId}.png`}];
  } catch (error) {
    console.error(`Error fetching match data for game ${puuid}:`, error.message);
    throw error; // propagate to caller
  }
}
async function getSummonerData(puuid,routingRegion) {
  try {
    const url = `https://${routingRegion}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = new Error(`Match data fetch error: ${response.status} ${response.statusText}`);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching match data for game ${puuid}:`, error.message);
    throw error; // propagate to caller
  }
}






app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


app.get('/api/player/:username/:tag/:region', async (req, res) => {
  const { username, tag, region } = req.params;
  try {

    const riotRegion = getRegionAccount(region)
    const summoner = await getRiotPuuiD(riotRegion, username, tag)
    res.json({ summoner});


  } catch (error) {
    
    console.error(error);

    const statusCode = error.eror || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: 'error.message,'
    });
  }

});


app.get('/api/getmatches/forplayer/:puuid/inregion/:region', async (req, res) => {
  const { puuid,region } = req.params;
  try {
    var count = 0
    const matchData = []
    const riotRegion = getRegionMatch(region)
    const matches = await getMatches(puuid,riotRegion)
  
    while(matchData.length<10 && count<50) {
  
      const dataFromMetaTft = await getMatchData(matches[count])
      console.log(dataFromMetaTft)
      if(dataFromMetaTft.queueId ==1100){
        matchData.push(dataFromMetaTft)
      }

      count+=1
  }


    res.json({ matchData});

  
  } catch (error) {
    
    console.error(error);

    const statusCode = error.eror || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: 'error.message,'
    });
  }

});

app.get('/api/getMetaDataFor/:puuid/inregion/:region', async (req, res) => {
  const { puuid,region } = req.params;
  
  try {
    const riotRegion = getRegionAccount(region)
    const RoutingData = await getRoutingRegion(riotRegion,puuid)

    const routingRegion = RoutingData.region
    
    const playerMetaData = await GetPlayerMetaData(routingRegion,puuid)

    res.json({ playerMetaData});


  } catch (error) {
    
    console.error(error);

    const statusCode = error.error || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: 'error.message,'
    });
  }

});

app.get('/api/getusers/top/:quantity', async (req, res) => {
  const {quantity} = req.params
  try {
    // Sort by elo_difference ascending and limit to top 10
    const result = await pool.query(
      `SELECT * FROM users ORDER BY elo_difference DESC LIMIT ${quantity}`
    );

    return res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error(error);

    const statusCode = error.status || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: error.message
    });
  }
});


app.post('/api/updateUser', async (req, res) => {
  try {
    const { 
      puuid, 
      name, 
      tag, 
      region, 
      tier, 
      rank, 
      leaguepoints, 
      elo_difference, 
      wins, 
      losses 
    } = req.body;

    // Validate required fields
    if (!puuid || !name) {
      return res.status(400).json({
        error: true,
        message: 'puiid and name are required'
      });
    }

// Insert or update (upsert) - if puuid exists, update it
    const result = await pool.query(
      `INSERT INTO users (puuid, name, tag, region, tier, rank, leaguepoints, elo_difference, wins, losses)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (puuid) 
       DO UPDATE SET
         name = EXCLUDED.name,
         tag = EXCLUDED.tag,
         region = EXCLUDED.region,
         tier = EXCLUDED.tier,
         rank = EXCLUDED.rank,
         leaguepoints = EXCLUDED.leaguepoints,
         elo_difference = EXCLUDED.elo_difference,
         wins = EXCLUDED.wins,
         losses = EXCLUDED.losses,
         updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles'
       RETURNING *`,
      [puuid, name, tag, region, tier, rank, leaguepoints, elo_difference, wins, losses]
    );

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    const statusCode = error.status || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: error.message
    });
  }
});


app.get('/api/users/:puuid/rank', async (req, res) => {
  try {
    const { puuid } = req.params;

    const result = await pool.query(
      `WITH ranked_users AS (
        SELECT 
          puuid,
          name,
          tag,
          elo_difference,
          ROW_NUMBER() OVER (ORDER BY elo_difference DESC) as position,
          COUNT(*) OVER () as total_users
        FROM users
      )
      SELECT 
        position,
        total_users,
        elo_difference,
        name,
        tag,
        ROUND((position::numeric / total_users::numeric) * 100, 2) as percentile
      FROM ranked_users
      WHERE puuid = $1`,
      [puuid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = result.rows[0];
    
    res.json({
      puuid,
      name: userData.name,
      tag: userData.tag,
      position: parseInt(userData.position),
      totalUsers: parseInt(userData.total_users),
      eloDifference: userData.elo_difference,
      percentile: parseFloat(userData.percentile)
    });

  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
