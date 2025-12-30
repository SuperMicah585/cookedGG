import PlayerAverageGraph from '../components/playerDisplayComponents/PlayerAverageGraph';
import NavBar from '../components/navBar'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import CookedStatus from '../components/playerDisplayComponents/cookedStatus';
import {getMatchData,userValidation,getUserMetaData} from '../services/userData.js'
import { useMutation } from '@tanstack/react-query'


const UserDisplay = () =>{
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [puuid, setPuuid] = useState('')
  const [userMetaDataObject,setUserMetaDataObject] = useState([])
  const [userMatches,setUserMatches] = useState([])
  const { player,tag,region } = useParams();
 
const validationMutation = useMutation({
  mutationFn: async ({ player, tag, region }) => {
    return userValidation(player, tag, region)
  },
  onSuccess: (data, variables) => {
    const { summoner } = data
    setPuuid(summoner.puuid)
    
  },
  onError: (error) => {
    setInputError(true)
    setInputErrorMessage(error.message ?? "Validation failed")
  },
})


const userMatchData = useMutation({
  mutationFn: async ({ puuid,region }) => {
    return getMatchData(puuid, region)
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


const userMetaData = useMutation({
  mutationFn: async ({ puuid,region }) => {
    return getUserMetaData(puuid, region)
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


  useEffect(() => {


    validationMutation.mutate({player,tag,region})
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [player, tag, region]);



  useEffect(() => {

    if(puuid.length>0 && region.length>0){
    userMatchData.mutate({puuid,region})
    userMetaData.mutate({puuid,region})
    }
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [puuid,region]);



  




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
    <CookedStatus userMatches = {userMatches} userMetaDataObject = {userMetaDataObject} playerName = {`${player}#${tag}`}/>
    </div>
    <div className = 'w-full pl-5 pr-5 sm:pl-10 sm:pr-10 lg:pl-20 lg:pr-20'> 
     < PlayerAverageGraph key={windowWidth} userMatches = {userMatches} player = {player} tag = {tag}/>
     </div>
</div>

</div>
}
</div>
)

}

export default UserDisplay;