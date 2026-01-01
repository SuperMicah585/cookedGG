import PlayerAverageGraph from '../components/playerDisplayComponents/PlayerAverageGraph';
import NavBar from '../components/navBar'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import CookedStatus from '../components/playerDisplayComponents/cookedStatus';
import {getMatchData,userValidation,getUserMetaData,updateUser} from '../services/userData.js'
import { useMutation } from '@tanstack/react-query'
import { tierToPoints } from '../functions/rank_calculations';
function averageDifference(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must be the same length');
  }
  
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += arr1[i] - arr2[i];
  }
  
  return sum / arr1.length;
}



const UserDisplay = () =>{
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [summoner, setSummoner] = useState([])
  const [userMetaDataObject,setUserMetaDataObject] = useState([])
  const [userMatches,setUserMatches] = useState([])
  const { player,tag,region } = useParams();
  const [avgDifference, setAvgDifference] = useState(0)
  const [userData,setUserData] = useState([])
  const [tableUpdateTrigger, setTableUpdateTrigger] = useState(0)
 
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
  mutationFn: async ({ summoner,region }) => {
    return getMatchData(summoner[0].puuid, region)
  },
  onSuccess: (data) => {
    const { matchData } = data
    setUserMatches(matchData)

    
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
//nothing for now  
  setTableUpdateTrigger((prev)=>prev+1)


  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})

  useEffect(()=>{
    if(avgDifference!=0 && summoner.length>0 && userMetaDataObject.length>0){

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
    console.log(userData)

      updateUsertable.mutate({userData})
    }


  },[avgDifference,summoner])


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
    userMatchData.mutate({summoner,region})
    userMetaData.mutate({summoner,region})
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [summoner,region]);



  useEffect(() => {
  if (userMatches && userMatches.length > 0) {
    const myRiotId = player + '#' + tag;
    
    const flatMatches = userMatches.flat();
    
    // Get player rank points directly
    const playerPoints = flatMatches
      .filter((item) => item.riot_id?.toLowerCase() === myRiotId?.toLowerCase())
      .map((item) => tierToPoints(item.ranked?.rating_text))
      .filter(points => points > 0); // Remove 0 values (unranked)
    


    
    // Calculate lobby average rank points (excluding the player)
    const lobbyAveragePoints = [];
    userMatches.forEach(match => {
      const ranks = match
        .filter(item => item.riot_id?.toLowerCase() !== myRiotId?.toLowerCase()) // Exclude player
        .map(item => item.ranked?.rating_text)
        .filter(rank => rank); // Remove undefined/null
      
      if (ranks.length > 0) {
        const points = ranks.map(tierToPoints);
        const avgPoints = points.reduce((a, b) => a + b, 0) / points.length;
        lobbyAveragePoints.push(Math.round(avgPoints));
      }
    });
    
    setAvgDifference(averageDifference(playerPoints,lobbyAveragePoints))

  }
}, [userMatches]);




return(

  
<div className ='absolute left-0 top-0 w-screen h-screen'>
        {validationMutation.isError && (
        <p className='flex w-full h-full items-center justify-center'>Cannot find a TFT player with that name.</p>
      )}
      {validationMutation.isSuccess &&
    <div className = 'flex flex-col items-center relative w-full h-full bg-gray-50'>
      <NavBar/>
<div className='flex flex-col lg:flex-row w-screen h-screen mt-5'>
    <div className = 'flex flex-col'> 
    <CookedStatus matchDataIsLoading = {matchDataIsLoading} tableUpdateTrigger = {tableUpdateTrigger} userMatches = {userMatches} userMetaDataObject = {userMetaDataObject} playerName = {`${player}#${tag}`}/>
    </div>
    <div className = 'w-full pl-5 pr-5 sm:pl-10 sm:pr-10 lg:pl-20 lg:pr-20'> 
     < PlayerAverageGraph matchDataIsLoading = {matchDataIsLoading} key={windowWidth} userMatches = {userMatches} player = {player} tag = {tag}/>
     </div>
</div>

</div>
}
</div>
)

}

export default UserDisplay;