import { useEffect, useState } from "react"
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import KitchenIcon from '@mui/icons-material/Kitchen';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
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
import SummaryPill from './SummaryPill';

const TOOLTIP = {
  cooked: 'Top 20% of LP differences',
  raw: 'Bottom 20% of LP differences',
  hot: 'Gained more than 75 LP in the selected games.',
  cold: 'Lost more than 75 LP in the selected games.',
};

const GAMES_LIMIT_OPTIONS = [10, 20, 30];

const CookedStatus = ({ userMatches, playerName, userMetaDataObject, tableUpdateTrigger, matchDataIsLoading, gamesLimit, setGamesLimit }) => {
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

  // LP change over last 10 games: positive = lost LP, negative = gained LP (matches playerDisplay eloDiff logic)
  const lpChangeLast10 =
    dataForTable.length >= 2
      ? dataForTable[dataForTable.length - 1].playerPoints - dataForTable[0].playerPoints
      : null;

  const cookedRawLabel =
    userPositionData.totalUsers > 0
      ? userPositionData.percentile <= 20
        ? 'Cooked'
        : userPositionData.percentile >= 80
          ? 'Raw'
          : null
      : null;

  // Hot = gained 75+ LP (positive value e.g. 160), Cold = lost 75+ LP (negative value)
  const hotColdLabel =
    lpChangeLast10 != null
      ? lpChangeLast10 > 75
        ? 'Hot'
        : lpChangeLast10 < -75
          ? 'Cold'
          : null
      : null;


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
    
    <div className = 'flex flex-col gap-2'> 
      <div className = 'flex gap-2 items-start'> 
        <img className = 'w-20 h-20 rounded-full shrink-0' src={userMetaData.iconId} alt="Summoner Icon" />
        <div className="flex flex-col gap-1">
          <div className = 'font-bold text-2xl font-bold text-black'>{playerName}</div>
          {setGamesLimit != null && (
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Games to analyze:</span>
              <select
                value={gamesLimit ?? 10}
                onChange={(e) => setGamesLimit(Number(e.target.value))}
                disabled={matchDataIsLoading}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {GAMES_LIMIT_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {cookedRawLabel && (
          <SummaryPill
            label={cookedRawLabel}
            icon={
              cookedRawLabel === 'Cooked' ? (
                <LocalFireDepartmentIcon sx={{ fontSize: 18 }} />
              ) : (
                <KitchenIcon sx={{ fontSize: 18 }} />
              )
            }
            colorClasses={
              cookedRawLabel === 'Cooked'
                ? 'text-amber-800 border-amber-800'
                : 'text-green-600 border-green-600'
            }
            tooltip={cookedRawLabel === 'Cooked' ? TOOLTIP.cooked : TOOLTIP.raw}
          />
        )}
        {hotColdLabel && (
          <SummaryPill
            label={hotColdLabel}
            icon={
              hotColdLabel === 'Hot' ? (
                <WhatshotIcon sx={{ fontSize: 18 }} />
              ) : (
                <AcUnitIcon sx={{ fontSize: 18 }} />
              )
            }
            colorClasses={
              hotColdLabel === 'Hot'
                ? 'text-red-600 border-red-600'
                : 'text-blue-600 border-blue-600'
            }
            tooltip={hotColdLabel === 'Hot' ? TOOLTIP.hot : TOOLTIP.cold}
          />
        )}
      </div>
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
        <TableContainer
          component={Paper}
          sx={(theme) => ({
            maxHeight: 420,
            [theme.breakpoints.up('lg')]: { maxHeight: 560 },
          })}
          className="overflow-auto"
        >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white", fontSize: "1rem", py: 1.5, px: 2 }}>Game</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white", fontSize: "1rem", py: 1.5, px: 2 }}>Player LP</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white", fontSize: "1rem", py: 1.5, px: 2 }}>Opponent LP</TableCell>
            <TableCell sx={{ backgroundColor: "#27272A", color: "white", fontSize: "1rem", py: 1.5, px: 2 }}>LP Difference</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {dataForTable.map((row,index) => (
            <TableRow key={row.id}>
              <TableCell sx={{ fontSize: "0.95rem", py: 1.5, px: 2 }}>{index+1}</TableCell>
              <TableCell sx={{ fontSize: "0.95rem", py: 1.5, px: 2 }}>{row?.playerPoints}</TableCell>
              <TableCell sx={{ fontSize: "0.95rem", py: 1.5, px: 2 }}>{row?.lobbyAveragePoints}</TableCell>
              <TableCell
                sx={{
                  fontSize: "0.95rem",
                  py: 1.5,
                  px: 2,
                  color: (Number(row?.difference) ?? 0) >= 0 ? '#ef4444' : '#22c55e',
                  fontWeight: 1000,
                }}
              >
                {Math.round(Number(row?.difference))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


        }
    </div>
)

}; export default CookedStatus;