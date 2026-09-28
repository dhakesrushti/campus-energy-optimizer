import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { fetchLatestReading } from '../services/api';
import { Users, Zap, CheckCircle2, AlertTriangle, Thermometer, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoomWise() {
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLatestReading();
        setReading(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white text-lg">Loading room data...</div>;
  if (error) return <div className="text-red-500 text-lg">Failed to load room data: {error}</div>;

  // We group by roomId if it exists in the database.
  // The current API fetches the single latest reading, but we can display it dynamically.
  // If multiple rooms existed, we would map over an array. Since we have one latest reading from the sensor:
  const roomId = reading.roomId || "ROOM_101";
  const deviceId = reading.deviceId || "ESP32_001";
  
  const hasAnomaly = !reading.occupancy && reading.power > 50;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Room-wise Analysis</h2>
        <p className="text-gray-400 mt-1">Live breakdown of individual spaces</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="relative overflow-hidden">
            {/* Status Indicator */}
            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg ${hasAnomaly ? 'bg-red-500 text-white' : 'bg-primary-green text-white'}`}>
              {hasAnomaly ? 'Anomaly' : 'Normal'}
            </div>
            
            <div className="flex items-center space-x-4 mb-6 mt-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xl font-bold text-white">
                {roomId.split('_')[1] || 'R'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{roomId}</h3>
                <p className="text-sm text-gray-400">Node: {deviceId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Occupancy</span>
                </div>
                <p className="text-2xl font-bold text-white">{reading.occupancy ? 'Occupied' : 'Vacant'}</p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Power</span>
                </div>
                <p className="text-2xl font-bold text-white">{reading.power} W</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <p className="text-2xl font-bold text-white">{reading.temperature} °C</p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Droplets className="w-4 h-4" />
                  <span className="text-sm font-medium">Humidity</span>
                </div>
                <p className="text-2xl font-bold text-white">{reading.humidity} %</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {hasAnomaly ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-primary-green" />
                  )}
                  <span className={`font-medium ${hasAnomaly ? 'text-red-500' : 'text-primary-green'}`}>
                    {hasAnomaly ? 'Wasting Energy' : 'Energy Optimized'}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Total Energy: {reading.energy} kWh</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
