import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LeaderBoardDistribution = () =>{


  const data = {
    labels: ['-200+', '-150', '-100', '-50', '0', '50','100','150','200+'],
    datasets: [
      {
        label: 'number of summoners',
        data: [2, 4, 8, 10, 15, 10,8,4,2],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cooked Distribution',
      },
    },
  scales: {
    x: {
      title: {
        display: true,
        text: 'LP Difference'  // Your x-axis label here
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Summoners'  // Optional y-axis label
      }
    },
    },
  };

  return (
    <div className="w-full z-20">
            <Card elevation={3}>
      <CardContent>
      <Bar data={data} options={options} />
      </CardContent>
      </Card>
    </div>
  );
}; export default LeaderBoardDistribution;