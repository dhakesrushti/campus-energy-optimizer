import { useState, useEffect } from 'react';

// Initial fallback data to prevent crashes while loading or if the DB is empty
const initialData = {
  overview: {
    currentPowerW: 0,
    energyTodayKWh: 0,
    temperature: 0,
    humidity: 0,
    occupancyStatus: '-',
    activeRooms: 0,
    estimatedSavings: 0,
    systemHealth: 'Connecting...'
  },
  sensorData: {
    dht22: { temperature: 0, humidity: 0 },
    pir: { motionDetected: false, status: '-' },
    pzem: {
      voltage: 0,
      current: 0,
      power: 0,
      energy: 0,
      frequency: 0,
      powerFactor: 0
    }
  },
  rooms: []
};

// Fallback data in case the server fails or DB is empty
const fallbackData = {
  createdAt: new Date().toISOString(),
  overview: {
    currentPowerW: 420,
    energyTodayKWh: 12.4,
    temperature: 24.1,
    humidity: 45,
    occupancyStatus: 'Vacant',
    activeRooms: 0,
    estimatedSavings: 15.2,
    systemHealth: 'Offline (Mock Data)'
  },
  sensorData: {
    dht22: { temperature: 24.1, humidity: 45 },
    pir: { motionDetected: false, status: 'Vacant' },
    pzem: {
      voltage: 230,
      current: 1.82,
      power: 420,
      energy: 12.4,
      frequency: 50,
      powerFactor: 0.98
    }
  },
  rooms: [
    { 
      id: 'A101', 
      name: 'Room A101', 
      occupancy: 'Vacant', 
      temp: 24.1, 
      humidity: 45, 
      power: 420, 
      dailyEnergy: 12.4, 
      status: 'Offline' 
    }
  ]
};

export function useSensorData() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data from backend');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        // Use fallback data, but update the timestamp so the UI doesn't appear frozen
        setData({
          ...fallbackData,
          createdAt: new Date().toISOString()
        }); 
      }
    };

    // Fetch immediately on mount
    fetchRealData();
    
    // Set up polling interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchRealData, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  return data;
}
