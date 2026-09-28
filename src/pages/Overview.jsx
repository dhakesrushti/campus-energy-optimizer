import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { fetchDashboardSummary } from '../services/api';
import { Zap, Droplets, Thermometer, Users, Activity, CheckCircle2, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, unit, icon: Icon, colorClass, delay }) => (
  <GlassCard delay={delay} className="flex items-center space-x-4">
    <div className={`p-4 rounded-xl bg-gradient-to-br ${colorClass} bg-opacity-20`}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline space-x-1">
        <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
        {unit && <span className="text-gray-400 font-medium">{unit}</span>}
      </div>
    </div>
  </GlassCard>
);

export default function Overview() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchDashboardSummary();
      setSummary(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(`Failed to fetch dashboard summary: ${err.message}`);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!summary) return <div className="text-white">Loading overview...</div>;

  const stats = [
    { title: "Current Power", value: summary.actual_power, unit: "W", icon: Zap, colorClass: "from-yellow-400 to-orange-500" },
    { title: "Expected Power", value: summary.expected_power, unit: "W", icon: Activity, colorClass: "from-primary-blue to-purple-500" },
    { title: "Temperature", value: summary.temperature, unit: "°C", icon: Thermometer, colorClass: "from-red-400 to-red-600" },
    { title: "Humidity", value: summary.humidity, unit: "%", icon: Droplets, colorClass: "from-blue-400 to-blue-600" },
    { title: "Occupancy", value: summary.occupancy ? 'Yes' : 'No', unit: "", icon: Users, colorClass: "from-primary-green to-emerald-600" },
    { title: "Deviation", value: summary.deviation, unit: "%", icon: TrendingDown, colorClass: "from-indigo-400 to-indigo-600" },
    { title: "System Status", value: summary.status, unit: "", icon: CheckCircle2, colorClass: summary.status === 'NORMAL' ? "from-green-400 to-primary-green" : "from-red-400 to-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Real-time Campus Energy Analytics</p>
          <p className="text-sm text-primary-blue mt-2 font-medium">Last DB Update: {lastUpdated}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center shadow-lg ${summary.status === 'NORMAL' ? 'bg-primary-green/20 text-primary-green border-primary-green/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
          <span className={`w-2 h-2 rounded-full animate-pulse mr-2 ${summary.status === 'NORMAL' ? 'bg-primary-green' : 'bg-red-500'}`}></span>
          {summary.status === 'NORMAL' ? 'Live Normal' : 'Anomaly Detected'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} delay={idx * 0.05} />
        ))}
      </div>
      
      <div className="mt-6">
        <GlassCard className="min-h-[150px]" delay={0.4}>
            <h3 className="text-lg font-semibold text-white mb-4">AI Recommendation</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-md text-gray-200">{summary.recommendation}</p>
            </div>
        </GlassCard>
      </div>
    </div>
  );
}
