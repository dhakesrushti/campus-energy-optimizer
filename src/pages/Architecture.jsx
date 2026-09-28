import React from 'react';
import GlassCard from '../components/GlassCard';
import { Database, Wifi, Server, MonitorSmartphone, Thermometer, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Node = ({ icon: Icon, title, desc, delay, isCore }) => (
  <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5 }}
    className={`p-4 rounded-xl flex flex-col items-center justify-center text-center relative z-10 
      ${isCore ? 'bg-primary-blue/20 border border-primary-blue/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-white/5 border border-white/10'}`}
  >
    <div className={`p-3 rounded-full mb-3 ${isCore ? 'bg-primary-blue text-white' : 'bg-white/10 text-gray-300'}`}>
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-white font-semibold">{title}</h4>
    <p className="text-xs text-gray-400 mt-1">{desc}</p>
  </motion.div>
);

export default function Architecture() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">System Architecture</h2>
        <p className="text-gray-400 mt-1">Data flow from IoT nodes to dashboard</p>
      </div>

      <GlassCard className="min-h-[600px] flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid for tech feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Sensors Layer */}
          <div className="flex flex-col space-y-6 w-full md:w-48 relative">
            <Node icon={Thermometer} title="DHT22" desc="Temp & Humidity" delay={0.1} />
            <Node icon={Activity} title="PIR Sensor" desc="Motion & Occupancy" delay={0.2} />
            <Node icon={Zap} title="PZEM-004T" desc="Power & Energy" delay={0.3} />
            
            {/* Connecting lines for mobile */}
            <div className="absolute inset-y-0 right-0 w-0.5 bg-gradient-to-b from-transparent via-primary-green/50 to-transparent hidden md:block" style={{ transform: 'translateX(24px)' }}></div>
          </div>

          {/* Microcontroller */}
          <div className="w-full md:w-56 relative flex justify-center">
            <Node icon={Server} title="ESP32 Edge Node" desc="Data Processing" delay={0.5} isCore />
            
            {/* Connecting line to network */}
            <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-primary-blue/50 hidden md:block"></div>
            <div className="absolute top-1/2 -left-12 w-12 h-0.5 bg-primary-green/50 hidden md:block"></div>
          </div>

          {/* Cloud / Network Layer */}
          <div className="w-full md:w-48 relative flex flex-col items-center">
            <div className="relative w-full">
              <Node icon={Wifi} title="Campus Network" desc="MQTT / HTTP" delay={0.7} />
              <div className="my-6 text-center">
                 <div className="w-0.5 h-8 bg-white/20 mx-auto"></div>
              </div>
              <Node icon={Database} title="Cloud Database" desc="Time-series Data" delay={0.8} />
              
              {/* Connecting line to Dashboard */}
              <div className="absolute top-1/2 -right-12 w-12 h-0.5 bg-white/20 hidden md:block"></div>
            </div>
          </div>

          {/* Application Layer */}
          <div className="w-full md:w-56 flex justify-center">
             <Node icon={MonitorSmartphone} title="React Dashboard" desc="Real-time UI" delay={1.0} isCore />
          </div>

        </div>
      </GlassCard>
    </div>
  );
}
