import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { fetchHistory } from '../services/api';
import { AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Alerts() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(100); // Fetch recent history to scan for anomalies
        setHistory(data);
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

  if (loading) return <div className="text-white text-lg">Scanning for system anomalies...</div>;
  if (error) return <div className="text-red-500 text-lg">Error loading alerts: {error}</div>;

  // Filter for actual anomalies (e.g. power > 50 and occupancy is false, or extremely high power)
  // Since we don't have expected_power in history endpoint, we use a heuristic based on occupancy
  const anomalies = history.filter(r => {
    const isVacantButConsuming = (!r.occupancy && r.power > 50);
    const isExtremeConsumption = (r.power > 1500); // Assuming 1.5kW is very high for a single node
    return isVacantButConsuming || isExtremeConsumption;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">System Alerts</h2>
          <p className="text-gray-400 mt-1">Real-time anomaly detection logs</p>
        </div>
        <div className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg border border-red-500/30 text-sm font-medium">
          {anomalies.length} Alerts Found
        </div>
      </div>

      <div className="space-y-4">
        {anomalies.length === 0 ? (
          <GlassCard className="p-8 text-center text-gray-400">
            No system anomalies detected in recent history. All rooms operating normally.
          </GlassCard>
        ) : (
          anomalies.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard className="flex items-start justify-between border-l-4 border-l-red-500">
                <div className="flex space-x-4">
                  <div className="mt-1 bg-red-500/20 p-2 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {alert.power > 1500 ? 'Critical Power Surge Detected' : 'Unoccupied Power Consumption'}
                    </h3>
                    <p className="text-gray-300 mt-1">
                      {alert.power > 1500 
                        ? `Abnormally high energy consumption detected (${alert.power} W).` 
                        : `Room is empty (Occupancy: False) but consuming ${alert.power} W of power.`}
                    </p>
                    <div className="flex items-center space-x-2 mt-3 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      <span className="mx-2">•</span>
                      <span>Room ID: {alert.roomId || 'ROOM_101'}</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-red-500/10 text-red-400 rounded text-xs font-semibold uppercase tracking-wider">
                  High Severity
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
