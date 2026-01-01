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
    const bucketedData = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // indices 0-8

    for(const item of data.data){
      const diff = item.elo_difference;
      
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
      } else {
        bucketedData[8]++;
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
    labels: ['-200+', '-150', '-100', '-50', '0', '50','100','150','200+'],
    datasets: [
      {
        label: 'number of summoners',
        data: userDataForDistribution,
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