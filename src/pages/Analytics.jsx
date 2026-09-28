import React, { useState, useEffect } from 'react';
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
import { fetchHistory } from '../services/api';

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
    legend: { labels: { color: '#9CA3AF' } }
  },
  scales: {
    y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9CA3AF' } },
    x: { grid: { display: false }, ticks: { color: '#9CA3AF', maxTicksLimit: 10 } },
  },
};

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(50); // Fetch last 50 readings
        setHistory(data.reverse()); // Reverse to chronological order (oldest to newest)
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadHistory();
    const interval = setInterval(loadHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white text-lg">Loading historical data...</div>;
  if (error) return <div className="text-red-500 text-lg">Failed to load analytics: {error}</div>;

  // Process data for charts
  const labels = history.map(r => new Date(r.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
  
  const powerData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Power Consumption (W)',
        data: history.map(r => r.power),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      }
    ]
  };

  const environmentData = {
    labels,
    datasets: [
      {
        label: 'Temperature (°C)',
        data: history.map(r => r.temperature),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: history.map(r => r.humidity),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        <p className="text-gray-400 mt-1">Real-time historical data from MongoDB</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Power Consumption vs Time</h3>
          <div className="h-72">
            <Line options={chartOptions} data={powerData} />
          </div>
        </GlassCard>

        <GlassCard className="h-96">
          <h3 className="text-lg font-semibold text-white mb-4">Temperature & Humidity Trends</h3>
          <div className="h-72">
            <Line options={chartOptions} data={environmentData} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
