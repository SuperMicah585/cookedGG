import { useEffect, useState } from "react"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tierToPoints } from "../../functions/rank_calculations";
import {getUserPosition} from "../../services/userData"
import { useMutation } from '@tanstack/react-query'
import CircularProgress from '@mui/material/CircularProgress';
import iron from '../../assets/iron.png'
import bronze from '../../assets/bronze.png'
import silver from '../../assets/silver.png'
import gold from '../../assets/gold.png'
import platinum from '../../assets/platinum.png'
import diamond from '../../assets/diamond.png'
import master from '../../assets/master.png'
import grandmaster from '../../assets/grandmaster.png'
import challenger from '../../assets/challenger.png'
import emerald from '../../assets/emerald.png'
import chonc from '../../assets/chonc.png'


const CookedStatus = ({userMatches, playerName,userMetaDataObject,tableUpdateTrigger, matchDataIsLoading}) =>{
const [anchorEl, setAnchorEl] = useState(null);
const [userMetaData,setUserMetaData] = useState({puuid: '', wins:0,losses:0,tier:'',rank:'',leaguePoints:0})
const [dataForTable, setDataForTable] = useState([])
const [userPositionData,setUserPositionData] = useState({eloDifference:0,position:0,percentile:0,totalUsers:0})
useEffect(()=>{

if(userMetaDataObject && userMetaDataObject.length>0){
setUserMetaData(userMetaDataObject[0])
}

},[userMetaDataObject])

const open = Boolean(anchorEl);

const popUpMessage = () => {
    return(
        `this is your cooked mmr percentile and rank`
    )
}



  const userPosition = useMutation({
    mutationFn: async () => {
      return getUserPosition(userMetaData.puuid)
    },
    onSuccess: (data) => {
      setUserPositionData({eloDifference:data.eloDifference,position:data.position,percentile:data.percentile,totalUsers:data.totalUsers})
      
    },
    onError: (error) => {
      setInputError(true)
      setInputErrorMessage(error.message ?? "Validation failed")
    },
  })

  useEffect(()=>{
if(userMetaData.puuid !==''){
    userPosition.mutate(userMetaData)
}

},[userMetaData,tableUpdateTrigger])





useEffect(() => {
  if (userMatches && userMatches.length > 0) {
    const myRiotId = playerName;

    const dataForTable = []
    
    const flatMatches = userMatches.map(item=>item.players).flat();
    
    // Get player rank points directly
    const playerPoints = flatMatches
      .filter((item) => item.riot_id?.toLowerCase() === myRiotId?.toLowerCase())
      .map((item) => tierToPoints(item.ranked?.rating_text))
      .filter(points => points > 0); // Remove 0 values (unranked)
    
    
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
    
    for (let i = 0; i < playerPoints.length; i++) {
      dataForTable.push({playerPoints:playerPoints[i],lobbyAveragePoints:lobbyAveragePoints[i],difference: playerPoints[i]-lobbyAveragePoints[i]})
    }
    setDataForTable(dataForTable.reverse())
  }
}, [userMatches]);


    const tierIcons = {
      IRON: iron,
      BRONZE: bronze,
      SILVER: silver,
      GOLD: gold,
      PLATINUM: platinum,
      EMERALD:emerald,
      DIAMOND: diamond,
      MASTER: master,
      GRANDMASTER: grandmaster,
      CHALLENGER: challenger
    };

return(
    <div className = 'flex flex-col gap-2 ml-2 mr-2 h-full w-full'> 
    
    <div className = 'flex gap-2 items-center'> 
      
        <img className = 'w-20 h-20 rounded-full' src={userMetaData.iconId} alt="Summoner Icon" />
      <div className = 'font-bold text-2xl font-bold text-black'>{playerName}</div>
    </div>
    <Card elevation={3}>
      {!matchDataIsLoading &&
      <CardContent>
    <div className = 'flex items-center justify-center p-2 w-full'> 
          <div className='flex-col justify-center items-center gap-2 text-sm'> 
            
            <div className = ' flex font-bold items-center justify-center'>            
              <img
              src={tierIcons[userMetaData.tier]}
              alt={`${userMetaData.tier} icon`}
              style={{ width:65, height: 65, marginRight: 5 }}
            /> {userMetaData.tier} {userMetaData.rank} {userMetaData.leaguePoints} LP</div>
            <div className = 'text-gray-500 text-xs'>Top {userPositionData.percentile}% | Rank #{userPositionData.position}</div>
          </div>
 </div>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={()=>setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ pointerEvents: 'none' }}
          disableRestoreFocus
        >
          <Typography sx={{ p: 2 }}>{popUpMessage()}</Typography>
        </Popover>

        <div className = 'flex gap-5 items-center justify-center mt-2 text-sm'> 
        <div className = 'flex items-center justify-center whitespace-nowrap'>
        <div> <CheckCircleIcon color="success" /></div>
        <div>Wins: {userMetaData.wins}  </div>
        
        </div>
    
        <div className = 'flex items-center justify-center whitespace-nowrap'>
        <div> <CancelIcon color="error" /></div>
        <div>Losses: {userMetaData.losses}  </div>
        
        </div>
 </div>
      </CardContent>
}
    </Card>

{matchDataIsLoading? <Card elevation={3} ><div className = 'w-full h-96 flex items-center justify-center'> <CircularProgress size={20} /></div></Card>:
        <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Game</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Player Elo</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Average Lobby Elo</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white" }}>Elo Difference</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {dataForTable.map((row,index) => (
            <TableRow key={row.id}>
              <TableCell>{index+1}</TableCell>
              <TableCell>{row?.playerPoints}</TableCell>
              <TableCell>{row?.lobbyAveragePoints}</TableCell>
              <TableCell>{row?.difference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


        }
    </div>
)

}; export default CookedStatus;