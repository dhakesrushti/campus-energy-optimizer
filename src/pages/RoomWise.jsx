import React from 'react';
import GlassCard from '../components/GlassCard';
import { useSensorData } from '../hooks/useSensorData';
import { Building, Users, Thermometer, Zap, Power } from 'lucide-react';
import { clsx } from 'clsx';

export default function RoomWise() {
  const { rooms } = useSensorData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Room-wise Monitoring</h2>
        <p className="text-gray-400 mt-1">Granular insights by location</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room, idx) => (
          <GlassCard key={room.id} delay={idx * 0.1}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary-blue/20 text-primary-blue">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{room.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={clsx("w-2 h-2 rounded-full", room.status === 'Active' ? 'bg-primary-green' : room.status === 'Standby' ? 'bg-yellow-500' : 'bg-gray-500')}></span>
                    <span className="text-xs text-gray-400">{room.status}</span>
                  </div>
                </div>
              </div>
              <div className={clsx("px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1", room.occupancy === 'Occupied' ? 'bg-primary-green/20 text-primary-green border border-primary-green/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30')}>
                <Users className="w-3 h-3" />
                <span>{room.occupancy}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Thermometer className="w-4 h-4" />
                  <span className="text-xs uppercase">Climate</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{room.temp}°C</div>
                  <div className="text-gray-400 text-sm">{room.humidity}% RH</div>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs uppercase">Power</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{room.power} W</div>
                  <div className="text-gray-400 text-sm">{room.dailyEnergy} kWh</div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
