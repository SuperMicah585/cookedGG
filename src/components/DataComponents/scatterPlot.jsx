import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Scatter } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getUsers } from '../../services/userData';
import { useMutation } from '@tanstack/react-query';
import { tierToPoints } from '../../functions/rank_calculations';
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

const tierBase = {
  IRON: 0,
  BRONZE: 400,
  SILVER: 800,
  GOLD: 1200,
  PLATINUM: 1600,
  EMERALD: 2000,
  DIAMOND: 2400,
  MASTER: 2800,
};

const tierColors = {
  IRON: '#4A4A4A',
  BRONZE: '#CD7F32',
  SILVER: '#C0C0C0',
  GOLD: '#FFD700',
  PLATINUM: '#4EC9B0',
  EMERALD: '#00C853',
  DIAMOND: '#3A8FDB',
  'MASTER+': '#A855F7',
};

const getTierFromLP = (lp) => {
  if (lp >= tierBase.MASTER) return 'MASTER+';
  if (lp >= tierBase.DIAMOND) return 'DIAMOND';
  if (lp >= tierBase.EMERALD) return 'EMERALD';
  if (lp >= tierBase.PLATINUM) return 'PLATINUM';
  if (lp >= tierBase.GOLD) return 'GOLD';
  if (lp >= tierBase.SILVER) return 'SILVER';
  if (lp >= tierBase.BRONZE) return 'BRONZE';
  return 'IRON';
};

const ScatterPlot = () => {
  const [scatterData, setScatterData] = useState([]);
  const userData = useMutation({
    mutationFn: async (quantity) => {
      return getUsers(quantity);
    },
    onSuccess: (data) => {
      // Transform data into scatter plot format with tier information
      const points = data.data.map((item) => {
        const lp = tierToPoints(`${item.tier} ${item.rank} ${item.leaguepoints}LP`);
        const tier = getTierFromLP(lp);
        
        return {
          x: item.elo_difference,
          y: lp,
          tier: tier,
        };
      });
      
      setScatterData(points);
    },
    onError: (error) => {
      console.error(error.message ?? "Failed to fetch data");
    },
  });

  useEffect(() => {
    userData.mutate(10000);
  }, []);

  // Group points by tier for different datasets
  const datasetsByTier = {};
  scatterData.forEach(point => {
    const tier = point.tier;
    if (!datasetsByTier[tier]) {
      datasetsByTier[tier] = [];
    }
    datasetsByTier[tier].push({ x: point.x, y: point.y });
  });

  const data = {
    datasets: Object.keys(tierColors).map(tier => ({
      label: tier.charAt(0) + tier.slice(1).toLowerCase(),
      data: datasetsByTier[tier] || [],
      backgroundColor: tierColors[tier],
      borderColor: tierColors[tier],
      borderWidth: 0,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBorderWidth: 2,
      pointHoverBorderColor: '#fff',
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        display: true,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Player Distribution by Tier',
        font: {
          size: 24,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const tier = context.dataset.label;
            return [
              `Tier: ${tier}`,
              `ELO Diff: ${context.parsed.x.toFixed(1)}`,
              `LP: ${context.parsed.y.toFixed(0)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'ELO Difference',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'League Points (LP)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
    },
  };

  return (
    <div className="w-full z-20 " style={{ height: '600px' }}>
      <Card elevation={3} style={{ height: '100%' }}>
        <CardContent style={{ height: '100%' }}>
          <Scatter data={data} options={options} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ScatterPlot;