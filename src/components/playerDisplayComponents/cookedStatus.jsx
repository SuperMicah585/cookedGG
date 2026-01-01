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

const CookedStatus = ({userMatches, playerName,userMetaDataObject,tableUpdateTrigger}) =>{
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
    
    for (let i = 0; i < 10; i++) {
      dataForTable.push({playerPoints:playerPoints[i],lobbyAveragePoints:lobbyAveragePoints[i],difference: playerPoints[i]-lobbyAveragePoints[i]})
    }
    setDataForTable(dataForTable.reverse())
  }
}, [userMatches]);

return(
    <div className = 'flex flex-col gap-2 ml-2 mr-2 p-2 h-full w-full'> 
    <Card elevation={3}>
      <CardContent>

          <div className='flex-col justify-center items-center gap-2 text-sm'> 
            <div className = 'font-bold text-2xl'>{playerName}</div>
            <div className = 'font-bold'>{userMetaData.tier} {userMetaData.rank} {userMetaData.leaguePoints} LP</div>
            <div>{userPositionData.percentile}% | #{userPositionData.position}</div>
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
    </Card>


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
    </div>
)

}; export default CookedStatus;