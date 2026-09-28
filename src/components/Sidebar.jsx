import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Building, BarChart3, Lightbulb, TrendingDown, Bell, Network, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/overview', name: 'Overview', icon: LayoutDashboard },
  { path: '/real-time', name: 'Real-Time', icon: Activity },
  { path: '/room-wise', name: 'Room-wise', icon: Building },
  { path: '/analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/recommendations', name: 'AI Insights', icon: Lightbulb },
  { path: '/energy-savings', name: 'Savings', icon: TrendingDown },
  { path: '/alerts', name: 'Alerts', icon: Bell },
  { path: '/architecture', name: 'Architecture', icon: Network },
];

export default function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 glass-card h-full flex flex-col m-4 mr-0 rounded-2xl hidden md:flex z-20 overflow-hidden"
    >
      <div className="p-6 flex items-center space-x-3 border-b border-white/5">
        <div className="p-2 bg-gradient-to-br from-primary-green to-primary-blue rounded-xl">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-green to-primary-blue">
          CampusOptimizer
        </h1>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></div>
          <span className="text-sm font-medium text-gray-400">System Online</span>
        </div>
      </div>
    </motion.aside>
  );
}
