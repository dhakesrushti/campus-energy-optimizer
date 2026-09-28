import React from 'react';
import GlassCard from '../components/GlassCard';
import { Lightbulb, AlertTriangle, Info, Zap, ThermometerSnowflake, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const recommendations = [
  {
    id: 1,
    title: "Unoccupied Room detected with lights on",
    desc: "Room A102 has been unoccupied for 30 minutes, but power consumption indicates lights are still on. Consider turning them off.",
    icon: Lightbulb,
    color: "yellow",
    action: "Turn Off Lights"
  },
  {
    id: 2,
    title: "HVAC operating in an empty room",
    desc: "Lab B201's HVAC system is running at full capacity, but motion sensors indicate it is vacant. Adjusting setpoint will save energy.",
    icon: ThermometerSnowflake,
    color: "blue",
    action: "Adjust HVAC"
  },
  {
    id: 3,
    title: "High energy consumption detected",
    desc: "Overall campus power usage spiked by 25% in the last hour compared to baseline. Check heavy machinery in the Workshop.",
    icon: Activity,
    color: "red",
    action: "Investigate"
  },
  {
    id: 4,
    title: "Potential energy-saving opportunity",
    desc: "Natural lighting is sufficient in the Library based on time of day and weather. Dimming artificial lights can save 5kWh daily.",
    icon: Zap,
    color: "green",
    action: "Apply Auto-Dimming"
  }
];

export default function Recommendations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        <p className="text-gray-400 mt-1">Machine Learning driven insights to optimize energy usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          return (
            <GlassCard key={rec.id} delay={idx * 0.1} className={`border-l-4 border-${rec.color}-500`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full bg-${rec.color}-500/20 text-${rec.color}-400 mt-1`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">{rec.desc}</p>
                  
                  <div className="mt-4 flex justify-end">
                    <button className={`px-4 py-2 text-sm font-medium rounded-lg bg-${rec.color}-500/20 text-${rec.color}-400 hover:bg-${rec.color}-500/30 transition-colors`}>
                      {rec.action}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
