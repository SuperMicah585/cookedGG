import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Bar } from 'react-chartjs-2';
import {useEffect, useState} from 'react'
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query'
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

    const [userDataForDistribution, setUserDataForDistribution] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0])
    const userData = useMutation({
    mutationFn: async (quantity) => {
      return getUsers(quantity)
    },
    onSuccess: (data) => {
    const bucketedData = [0, 0, 0, 0, 0, 0, 0, 0, 0,0]; // indices 0-8
    for(const item of data.data){
      const diff = Number(item.elo_difference);
      
      
      if (diff <= -200) {
        bucketedData[0]++;
      } else if (diff < -150) {
        bucketedData[1]++;
      } else if (diff < -100) {
        bucketedData[2]++;
      } else if (diff < -50) {
        bucketedData[3]++;
      } else if (diff < 0) {
        bucketedData[4]++;
      } else if (diff < 50) {
        bucketedData[5]++;
      } else if (diff < 100) {
        bucketedData[6]++;
      } else if (diff < 150) {
        bucketedData[7]++;
      } else if (diff < 200) {
        bucketedData[8]++;
      }
      else{
        bucketedData[9]++;
      }
    }


      setUserDataForDistribution(bucketedData)
      
    },
    onError: (error) => {
      setInputError(true)
      setInputErrorMessage(error.message ?? "Validation failed")
    },
  })

  useEffect(()=>{

    userData.mutate(10000)


},[])


  const data = {
labels: [
  "(-∞, -200]", 
  "(-200, -150]", 
  "(-150, -100]", 
  "(-100, -50]", 
  "(-50, 0]", 
  "(0, 50]", 
  "(50, 100]", 
  "(100, 150]", 
  "(150, 200]", 
  "(200, ∞)"
],
    datasets: [
      {
        label: 'Quantity of summoners',
        data: userDataForDistribution,
        backgroundColor: '#27272A',
        borderColor: '#27272A',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display:false
      },
      title: {
        display: true,
        text: 'AVG Difference of Players Compared to Lobby',
        font: {
          size: 24,
          weight: 'bold'
        },
      },
    },
  scales: {
    x: {
      title: {
        display: true,
        text: 'LP Ranges',  // Your x-axis label here
        font: {
            size: 14,
            weight: 'bold'
          }
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Quantity of Players',  // Optional y-axis label
        font: {
            size: 14,
            weight: 'bold'
          }
      }
    },
    },
  };

  return (
<div className="w-full h-full z-20">
  <Card elevation={3} sx={{ height: '100%' }}>
    <CardContent sx={{ height: '100%', padding: 2 }}>
      <Bar data={data} options={options} />
    </CardContent>
  </Card>
</div>
  );
}; export default LeaderBoardDistribution;