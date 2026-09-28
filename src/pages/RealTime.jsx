import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { fetchLatestReading } from '../services/api';
import { Thermometer, Activity, Zap } from 'lucide-react';

const SensorCard = ({ title, data, icon: Icon, color }) => (
  <GlassCard className="flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></span>
        <span className="text-xs text-gray-400">Live</span>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mt-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="bg-white/5 p-4 rounded-xl border border-white/10">
          <p className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {value}
          </p>
        </div>
      ))}
    </div>
  </GlassCard>
);

export default function RealTime() {
  const [reading, setReading] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = async () => {
    try {
      const data = await fetchLatestReading();
      setReading(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError(`Failed to fetch real-time data: ${err.message}`);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!reading) return <div className="text-white">Loading live data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white">Real-Time Sensor Data</h2>
          <p className="text-gray-400 mt-1">Raw telemetry from IoT nodes</p>
        </div>
        <p className="text-sm text-primary-blue">Last Updated: {lastUpdated}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SensorCard 
          title="DHT22 Environment" 
          data={{ 
            temperature: `${reading.temperature}°C`, 
            humidity: `${reading.humidity}%` 
          }} 
          icon={Thermometer} 
          color="blue" 
        />
        
        <SensorCard 
          title="PIR Motion" 
          data={{ 
            motionDetected: reading.occupancy ? 'Yes' : 'No', 
            status: reading.occupancy ? 'Occupied' : 'Vacant' 
          }} 
          icon={Activity} 
          color="green" 
        />
        
        <SensorCard 
          title="PZEM-004T Meter" 
          data={{ 
            voltage: `${reading.voltage}V`, 
            current: `${reading.current}A`,
            power: `${reading.power}W`,
            energy: `${reading.energy}kWh`,
            powerFactor: reading.powerFactor
          }} 
          icon={Zap} 
          color="yellow" 
        />
      </div>
    </div>
  );
}
