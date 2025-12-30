import dotenv from 'dotenv'
dotenv.config()         

import express from 'express'
import cors from 'cors'
const app = express()
const PORT = process.env.PORT || 3000  // read from .env

// Enable CORS for all origins
app.use(cors())

app.use(express.json())
const apiKey = process.env.riotApiKey;
//Get list of matches from /lol/match/v5/matches/by-puuid/{puuid}/ids
//Pull last 10 matches from https://metatft-matches-2.ams3.digitaloceanspaces.com/NA1_5449502245.json


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
    console.log(region,puuid)
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


function getRegion(routingRegion) {
  // Replace digits so “NA1” becomes “NA”
  const result = routingRegion.replace(/\d+/g, '')

  const routingRelationship = {
    na: "AMERICAS",
    br: "AMERICAS",
    lan: "AMERICAS",
    las: "AMERICAS",
    oce: "AMERICAS",
    kr: "ASIA",
    jp: "ASIA",
    eune: "EUROPE",
    euw: "EUROPE",
    tr: "EUROPE",
    ru: "EUROPE"
  }

  // Use bracket notation to access object by variable key
  const region = routingRelationship[result.toLowerCase()]

  // Return the mapped region, or undefined if not found
  return region
}

async function getMatches(puuid, region, count = 10) {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching match data for game ${gameId}:`, error.message);
    throw error; // propagate to caller
  }
}

async function GetPlayerMetaData(routingRegion,puuid) {
  try {
    const url = `https://${routingRegion}.api.riotgames.com/tft/league/v1/by-puuid/${puuid}?api_key=${apiKey}`;
    console.log(url)
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

    const riotRegion = getRegion(region)
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
    const matchData = []
    const riotRegion = getRegion(region)
    const matches = await getMatches(puuid,riotRegion)
    for(const match of matches){
      const data = await getMatchData(match)
      matchData.push(data._metatft.participant_info)
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
    const riotRegion = getRegion(region)
    const RoutingData = await getRoutingRegion(riotRegion,puuid)
    console.log(RoutingData,"test")
    const routingRegion = RoutingData.region
    
    const playerMetaData = await GetPlayerMetaData(routingRegion,puuid)

    res.json({ playerMetaData});


  } catch (error) {
    
    console.error(error);

    const statusCode = error.eror || error.response?.status || 500;

    return res.status(statusCode).json({
      error: true,
      message: 'error.message,'
    });
  }

});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
