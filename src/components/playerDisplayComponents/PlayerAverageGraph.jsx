import {useState,useEffect} from 'react'
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {tierToPoints} from '../../functions/rank_calculations'
import CircularProgress from '@mui/material/CircularProgress';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);




const PlayerAverageGraph = ({userMatches,player,tag, matchDataIsLoading}) =>{
const [playerRankPoints, setPlayerRankPoints] = useState([])
const [lobbyAverageRankPoints, setLobbyAverageRankPoints] = useState([])



useEffect(() => {
  if (userMatches && userMatches.length > 0) {
    const myRiotId = player + '#' + tag;
    
    const flatMatches = userMatches.flat();
    
    // Get player rank points directly
    const playerPoints = flatMatches
      .filter((item) => item.riot_id?.toLowerCase() === myRiotId?.toLowerCase())
      .map((item) => tierToPoints(item.ranked?.rating_text))
      .filter(points => points > 0); // Remove 0 values (unranked)
    

    setPlayerRankPoints(playerPoints.reverse());
    
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
    
    setLobbyAverageRankPoints(lobbyAveragePoints.reverse());
  }
}, [userMatches, player, tag]);

const date = playerRankPoints.map((_, index) => `Game ${index + 1}`);

const data = {
  labels: date,
  datasets: [
    {
      label: `${player}#${tag}`,
      data: playerRankPoints,
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
    },
    {
      label: "lobby average",
      data: lobbyAverageRankPoints,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.4,
    },
  ],
};

const options = {
  maintainAspectRatio: true,
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Average Lobby Rank vs Player Rank (Points)" },
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Rank Points'
      }
    },
  },
};

return(
    <div className = 'w-full h-full'> 
        <Card elevation={3}>
          {matchDataIsLoading?<div className = 'flex items-center justify-center h-96 '> <CircularProgress size={20} /></div>:
            <CardContent>
      <Line data={data} options={options} />
      </CardContent>
}
      </Card>
          
    </div>
)

}

export default PlayerAverageGraph;