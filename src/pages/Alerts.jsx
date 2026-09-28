import React from 'react';
import GlassCard from '../components/GlassCard';
import { AlertCircle, AlertTriangle, Info, BellRing } from 'lucide-react';
import { clsx } from 'clsx';

const alerts = [
  { id: 1, type: 'Critical', message: 'High Temperature Alert in Server Room B', time: '10 mins ago' },
  { id: 2, type: 'Warning', message: 'Excessive Power Consumption in Lab A201', time: '45 mins ago' },
  { id: 3, type: 'Critical', message: 'Sensor Offline: PZEM-004T Node 4', time: '1 hour ago' },
  { id: 4, type: 'Warning', message: 'Motion Detected After Hours: Main Hall', time: '2 hours ago' },
  { id: 5, type: 'Info', message: 'System update completed successfully', time: '1 day ago' }
];

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Alerts & Notifications</h2>
          <p className="text-gray-400 mt-1">System events and anomalies</p>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium flex items-center">
          <BellRing className="w-4 h-4 mr-2" />
          Mark All Read
        </button>
      </div>

      <GlassCard className="p-0">
        <div className="divide-y divide-white/10">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-6 flex items-start space-x-4 hover:bg-white/5 transition-colors cursor-pointer">
              <div className={clsx(
                "p-2 rounded-full",
                alert.type === 'Critical' ? 'bg-red-500/20 text-red-500' :
                alert.type === 'Warning' ? 'bg-yellow-500/20 text-yellow-500' :
                'bg-blue-500/20 text-blue-500'
              )}>
                {alert.type === 'Critical' ? <AlertCircle className="w-5 h-5" /> :
                 alert.type === 'Warning' ? <AlertTriangle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-medium">{alert.message}</h4>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="mt-1">
                  <span className={clsx(
                    "text-xs font-semibold px-2 py-0.5 rounded-full border",
                    alert.type === 'Critical' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                    alert.type === 'Warning' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                    'border-blue-500/30 text-blue-400 bg-blue-500/10'
                  )}>
                    {alert.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
