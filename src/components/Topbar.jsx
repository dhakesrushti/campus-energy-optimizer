import React from 'react';
import { Search, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Topbar() {
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 px-6 md:px-8 flex items-center justify-between z-10 relative"
    >
      <div className="flex-1 flex items-center">
        {/* Mobile menu button could go here */}
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue focus:bg-white/10 transition-all sm:text-sm"
            placeholder="Search dashboard..."
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Settings className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-blue to-primary-green flex items-center justify-center text-white font-semibold">
          <User className="h-5 w-5" />
        </div>
      </div>
    </motion.header>
  );
}
