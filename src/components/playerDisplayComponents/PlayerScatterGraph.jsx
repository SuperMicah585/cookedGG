import { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { tierToPoints } from '../../functions/rank_calculations';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Deterministic jitter so multiple opponents in the same match don't stack exactly
const jitter = (matchIndex, opponentIndex) => matchIndex + ((opponentIndex % 5) - 2) * 0.08;

const PlayerScatterGraph = ({ userMatches, player, tag, matchDataIsLoading }) => {
  const [playerPoints, setPlayerPoints] = useState([]);
  const [opponentPoints, setOpponentPoints] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (userMatches && userMatches.length > 0) {
      const myRiotId = player + '#' + tag;

      const playerPts = [];
      const opponentPts = [];
      const dateLabels = [];

      userMatches.forEach((match, matchIndex) => {
        // Chronological index: 0 = oldest match (matches PlayerAverageGraph order)
        const chronIndex = userMatches.length - 1 - matchIndex;

        const myPlayer = match.players.find(
          (p) => p.riot_id?.toLowerCase() === myRiotId?.toLowerCase()
        );
        const myPts = myPlayer ? tierToPoints(myPlayer.ranked?.rating_text) : 0;
        if (myPts > 0) {
          playerPts.push({ x: chronIndex, y: myPts });
        }

        const opponents = match.players.filter(
          (p) => p.riot_id?.toLowerCase() !== myRiotId?.toLowerCase()
        );
        opponents.forEach((opp, oppIndex) => {
          const pts = tierToPoints(opp.ranked?.rating_text);
          if (pts > 0) {
            opponentPts.push({
              x: jitter(chronIndex, oppIndex),
              y: pts,
              riotId: opp.riot_id ?? 'Unknown',
            });
          }
        });

        dateLabels[chronIndex] = new Date(match.dateTime).toLocaleDateString();
      });

      setPlayerPoints(playerPts);
      setOpponentPoints(opponentPts);
      setDates(dateLabels);
    }
  }, [userMatches, player, tag]);

  const data = {
    datasets: [
      {
        label: `${player}#${tag}`,
        data: playerPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 8,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#fff',
      },
      {
        label: 'Opponents (per match)',
        data: opponentPoints,
        backgroundColor: 'rgba(39, 39, 42, 0.5)',
        borderColor: '#65656d',
        borderWidth: 0,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Opponent Rank (Points) vs Match — Each Point = One Opponent',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const matchIndex = Math.round(context.parsed.x);
            const dateStr = dates[matchIndex] ?? `Match ${matchIndex + 1}`;
            const lines = [
              context.dataset.label,
              `Rank points: ${Math.round(context.parsed.y)}`,
              `Match: ${dateStr}`,
            ];
            if (context.raw?.riotId) {
              lines[0] = context.raw.riotId;
            }
            return lines;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: -0.5,
        max: (userMatches?.length ?? 1) - 0.5,
        title: {
          display: true,
          text: 'Match (chronological)',
        },
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const i = Math.round(value);
            return dates[i] ?? value;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Rank Points',
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Card elevation={3} sx={{ height: '100%' }}>
        {matchDataIsLoading ? (
          <div className="flex items-center justify-center h-full">
            <CircularProgress size={20} />
          </div>
        ) : (
          <CardContent sx={{ height: '100%', padding: 2 }}>
            <Scatter data={data} options={options} />
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default PlayerScatterGraph;
