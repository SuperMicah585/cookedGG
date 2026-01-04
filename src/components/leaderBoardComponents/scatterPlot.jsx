import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Scatter } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query';
import {tierToPoints} from '../../functions/rank_calculations'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ScatterPlot = () => {
  const [scatterData, setScatterData] = useState([]);
  
  const userData = useMutation({
    mutationFn: async (quantity) => {
      return getUsers(quantity);
    },
    onSuccess: (data) => {
      // Transform data into scatter plot format
      const points = data.data.map((item, index) => ({
        x: item.elo_difference,
        y: tierToPoints(`${item.tier} ${item.rank} ${item.leaguePoints}LP`)
      }));
      
      setScatterData(points);
    },
    onError: (error) => {
      console.error(error.message ?? "Failed to fetch data");
    },
  });

  useEffect(() => {
    userData.mutate(10000);
  }, []);

  const data = {
    datasets: [
      {
        label: 'Player Data',
        data: scatterData,
        backgroundColor: 'rgba(28, 146, 7, 1)',
        borderColor: 'rgba(28, 146, 7, 1)',
        borderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: true,
        text: 'Player Distribution Scatter Plot',
        font: {
          size: 20
        }
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'ELO Difference'
        }
      },
      y: {
        title: {
          display: true,
          text: 'LP'
        }
      },
    },
  };

  return (
    <div className="w-full z-20">
      <Card elevation={3}>
        <CardContent>
          <Scatter data={data} options={options} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScatterPlot;