import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import GlassCard from '../components/GlassCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#9CA3AF' // gray-400
      }
    }
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#9CA3AF',
      },
    },
  },
};

export default function Analytics() {
  const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
  
  const powerData = {
    labels: timeLabels,
    datasets: [
      {
        fill: true,
        label: 'Power Consumption (W)',
        data: [1200, 1100, 2500, 4800, 4200, 2100, 1300],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      }
    ]
  };

  const energyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: [45, 52, 48, 55, 50, 20, 18],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        <p className="text-gray-400 mt-1">Historical data and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Power Consumption vs Time</h3>
          <div className="h-72">
            <Line options={chartOptions} data={powerData} />
          </div>
        </GlassCard>

        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Energy Usage</h3>
          <div className="h-72">
            <Bar options={chartOptions} data={energyData} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
