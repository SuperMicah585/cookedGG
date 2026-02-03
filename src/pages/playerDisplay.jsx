import PlayerAverageGraph from '../components/playerDisplayComponents/PlayerAverageGraph';
import PlayerScatterGraph from '../components/playerDisplayComponents/PlayerScatterGraph';
import NavBar from '../components/navBar'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import CookedStatus from '../components/playerDisplayComponents/cookedStatus';
import {getMatchData,userValidation,getUserMetaData,updateUser} from '../services/userData.js'
import { useMutation } from '@tanstack/react-query'
import { tierToPoints } from '../functions/rank_calculations';
import GenericTile from '../components/playerDisplayComponents/genericTile.jsx';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


function averageDifference(arr1, arr2) {
  console.log(arr1,arr2)
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must be the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += arr1[i] - arr2[i];
  }
  
  return sum / arr1.length;
}


function filterNullRanks(data, targetRiotId) {
    return data.filter(queueData => {
        // Check if any player in this queue matches the target riot_id and has null rank
        const targetPlayer = queueData.players?.find(player => player.riot_id === targetRiotId);
        
        // If player not found in this queue, keep it (or exclude it based on your needs)
        // If player found, only keep if ranked is not null/undefined
        if (targetPlayer) {
            return targetPlayer.ranked != null;
        }
        
        // If target player not in this queue, you can choose to keep or exclude
        return true; // Change to false if you want to exclude queues without the target player
    });
}



const UserDisplay = () =>{
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [summoner, setSummoner] = useState([])
  const [userMetaDataObject,setUserMetaDataObject] = useState([])
  const [userMatches,setUserMatches] = useState([])
  const { player,tag,region } = useParams();
  const [avgDifference, setAvgDifference] = useState(0)
  const [eloDiff, setEloDiff] = useState(0)
  const [tableUpdateTrigger, setTableUpdateTrigger] = useState(0)
  const [graphType, setGraphType] = useState('average')
  const [gamesLimit, setGamesLimit] = useState(10)
const validationMutation = useMutation({
  mutationFn: async ({ player, tag, region }) => {
    return userValidation(player, tag, region)
  },
  onSuccess: (data, variables) => {
    const { summoner } = data
    setSummoner([summoner])
    
  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})


const userMatchData = useMutation({
  mutationFn: async ({ summoner, region, gamesLimit }) => {
    return getMatchData(summoner[0].puuid, region, gamesLimit ?? 10)
  },
  onSuccess: (data) => {
    const { matchData } = data
    setUserMatches(filterNullRanks(matchData,player+'#'+tag))

    
  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})

const matchDataIsLoading = userMatchData.isPending 

const userMetaData = useMutation({
  mutationFn: async ({ summoner,region }) => {
    return getUserMetaData(summoner[0].puuid, region)
  },
  onSuccess: (data) => {
    const { playerMetaData } = data
    setUserMetaDataObject(playerMetaData)
    
  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})


const updateUsertable = useMutation({
  mutationFn: async ({ userData }) => {
    return updateUser(userData)
  },
  onSuccess: (data) => {
  setTableUpdateTrigger((prev)=>prev+1)


  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})

  useEffect(()=>{
    if(avgDifference!=0 && summoner.length>0 && userMetaDataObject.length>0 && userMatches.length === gamesLimit){

    const userData = {
      puuid: summoner[0].puuid,
      name: player,
      tag: tag,
      region: region,
      tier: userMetaDataObject[0].tier,
      rank: userMetaDataObject[0].rank,
      leaguepoints: userMetaDataObject[0].leaguePoints,
      elo_difference: avgDifference,
      wins: userMetaDataObject[0].wins,
      losses: userMetaDataObject[0].losses

    };
      updateUsertable.mutate({userData})
    }


  },[avgDifference,summoner,userMatches,gamesLimit])


  useEffect(() => {


    validationMutation.mutate({player,tag,region})
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [player, tag, region]);



  useEffect(() => {

    if(summoner.length>0 && region.length>0){
    userMatchData.mutate({summoner,region,gamesLimit})
    userMetaData.mutate({summoner,region})
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [summoner,region,gamesLimit]);


  useEffect(() => {
  if (userMatches && userMatches.length > 0) {
    const myRiotId = player + '#' + tag;
    
    const flatMatches = userMatches.map(item=>item.players).flat();
    // Get player rank points directly
    
    const playerPoints = flatMatches
      .filter((item) => item.riot_id?.toLowerCase() === myRiotId?.toLowerCase())
      .map((item) => tierToPoints(item.ranked?.rating_text))
      .filter(rank => rank); // Remove undefined/null
    
    

  
    console.log(flatMatches.filter((item)=> item.riot_id=="Akari00n#EUNE"))
    // Calculate lobby average rank points (excluding the player)
    const lobbyAveragePoints = [];
    userMatches.forEach(match => {
      const ranks = match.players
        .filter(item => item.riot_id?.toLowerCase() !== myRiotId?.toLowerCase()) // Exclude player
        .map(item => item.ranked?.rating_text)
        .filter(rank => rank); // Remove undefined/null
      
      if (ranks.length > 0) {
        const points = ranks.map(tierToPoints);
        const avgPoints = points.reduce((a, b) => a + b, 0) / points.length;
        lobbyAveragePoints.push(Math.round(avgPoints));
      }
    });

    const userPoints = [];
    userMatches.forEach(match => {
      const ranks = match.players
        .filter(item => item.riot_id?.toLowerCase() == myRiotId?.toLowerCase()) // Exclude player
        .map(item => item.ranked?.rating_text)
        .filter(rank => rank); // Remove undefined/null
      
      if (ranks.length > 0) {
        const points = ranks.map(tierToPoints);
        userPoints.push(points)
      }
    });
    
  
  
    setEloDiff(userPoints[0][0]-userPoints[userPoints.length-1][0])
    
    setAvgDifference(averageDifference(playerPoints,lobbyAveragePoints))

  }
}, [userMatches]);


return(

  
<div className ='absolute left-0 top-0 w-screen h-full'>
        {validationMutation.isError && (
        <p className='flex w-full h-full items-center justify-center'>Cannot find a TFT player with that name.</p>
      )}
      {validationMutation.isSuccess &&
    <div className = 'flex flex-col items-center relative w-full h-full bg-gray-50 overflow-y-scroll'>
      <NavBar/>
      {!matchDataIsLoading && userMatchData.isSuccess && userMatches.length === 0 && (
        <Alert severity="info" className="mt-4 mx-4">
          There is no data for this user. Please make sure region is correct.
        </Alert>
      )}
<div className='flex flex-col lg:flex-row w-screen h-screen mt-5'>
    <div className = 'flex shrink-0 lg:min-w-[320px]'> 
    <CookedStatus matchDataIsLoading={matchDataIsLoading} tableUpdateTrigger={tableUpdateTrigger} userMatches={userMatches} userMetaDataObject={userMetaDataObject} playerName={`${player}#${tag}`} gamesLimit={gamesLimit} setGamesLimit={setGamesLimit} />
    </div>
    
    <div className = 'flex flex-col gap-2 w-full pl-2 pr-2 sm:pl-10 sm:pr-10 lg:pl-20 lg:pr-20 relative'> 

      <div className = 'flex gap-2 lg:mt-0 mt-2 max-h-32 items-center justify-center lg:gap-5'> 
      {!matchDataIsLoading && <GenericTile dataColor = {'text-black'} data = {avgDifference.toFixed(2)} description = {"Average LP Difference"} descriptionColor = {avgDifference>=0?'text-red-500':'text-green-500'} />}
      {!matchDataIsLoading && <GenericTile dataColor = {'text-black'} data = {eloDiff>=0? '+' + eloDiff.toFixed(2): eloDiff.toFixed(2)} description = {`LP Last ${gamesLimit} Games`} descriptionColor = {eloDiff<=0?'text-red-500':'text-green-500'} />}
      </div>
     <div className="flex flex-col gap-2 w-full">
      {matchDataIsLoading !== true && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ToggleButtonGroup
            value={graphType}
            exclusive
            onChange={(_, value) => value != null && setGraphType(value)}
            aria-label="graph type"
            size="small"
            sx={{ alignSelf: 'center' }}
          >
            <ToggleButton value="average" aria-label="average opponent rank">
              Average
            </ToggleButton>
            <ToggleButton value="scatter" aria-label="opponents per match scatter">
              Scatter
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
        <div className="w-full h-96 lg:h-[700px] mb-20 md:mb-0">
          {graphType === 'average' ? (
            <PlayerAverageGraph matchDataIsLoading={matchDataIsLoading} key={windowWidth} userMatches={userMatches} player={player} tag={tag} />
          ) : (
            <PlayerScatterGraph matchDataIsLoading={matchDataIsLoading} key={windowWidth} userMatches={userMatches} player={player} tag={tag} />
          )}
        </div>
     </div>
     </div>

</div>

</div>
}
</div>
)

}

export default UserDisplay;