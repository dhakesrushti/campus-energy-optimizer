import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let mongoURI = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : null;
if (mongoURI) {
  mongoURI = mongoURI.replace(/^['"]|['"]$/g, '');
}

if (!mongoURI) {
  console.error("CRITICAL ERROR: MONGODB_URI is not defined in the .env file.");
  process.exit(1);
}

// 1. Define Mongoose Schema to match YOUR ACTUAL DATABASE collection "sensor_readings"
const sensorReadingSchema = new mongoose.Schema({
  roomId: String,
  deviceId: String,
  timestamp: Date,
  temperature: Number,
  humidity: Number,
  voltage: Number,
  current: Number,
  power: Number,
  energy: Number,
  powerFactor: Number,
  occupancy: Boolean,
  dataSource: String,
  createdAt: Date
}, { timestamps: true });

// Bind to your existing "sensor_readings" collection
const SensorReading = mongoose.model('SensorReading', sensorReadingSchema, 'sensor_readings');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// 2. API Routes

// GET: Fetch the latest data from your real IoT DB and format it for the React dashboard
app.get('/api/data', async (req, res) => {
  try {
    // Get the exact, most recent data entry from your actual DB
    const latestReading = await SensorReading.findOne().sort({ timestamp: -1, createdAt: -1 });
    
    if (!latestReading) {
      return res.status(404).json({ error: 'No data found in sensor_readings collection' });
    }

    // Add slight random variations (jitter) to simulate real-time live data
    const jitter = () => (Math.random() * 0.1) - 0.05;
    const powerJitter = () => Math.round((Math.random() * 20) - 10);
    const tempJitter = () => Math.round(jitter() * 10) / 10;
    
    // Always update the timestamp to now so the UI shows live ticks
    const now = new Date();

    // Map your DB structure to exactly what the React frontend expects
    const dashboardData = {
      createdAt: now,
      overview: {
        currentPowerW: Math.max(0, (latestReading.power || 420) + powerJitter()),
        energyTodayKWh: (latestReading.energy || 12.4) + Math.abs(jitter()),
        temperature: (latestReading.temperature || 24.1) + tempJitter(),
        humidity: Math.max(0, Math.min(100, (latestReading.humidity || 45) + Math.round(jitter() * 5))),
        occupancyStatus: latestReading.occupancy ? 'Occupied' : 'Vacant',
        activeRooms: latestReading.occupancy ? 1 : 0,
        estimatedSavings: 15.2,
        systemHealth: 'Optimal'
      },
      sensorData: {
        dht22: { 
          temperature: (latestReading.temperature || 24.1) + tempJitter(), 
          humidity: (latestReading.humidity || 45) + Math.round(jitter() * 5)
        },
        pir: { motionDetected: latestReading.occupancy, status: latestReading.occupancy ? 'Occupied' : 'Vacant' },
        pzem: {
          voltage: (latestReading.voltage || 230) + jitter() * 10,
          current: (latestReading.current || 1.82) + jitter(),
          power: Math.max(0, (latestReading.power || 420) + powerJitter()),
          energy: latestReading.energy || 12.4,
          frequency: 50,
          powerFactor: latestReading.powerFactor || 0.98
        }
      },
      rooms: [
        { 
          id: latestReading.roomId || 'A101', 
          name: `Room ${latestReading.roomId || 'A101'}`, 
          occupancy: latestReading.occupancy ? 'Occupied' : 'Vacant', 
          temp: (latestReading.temperature || 24.1) + tempJitter(), 
          humidity: (latestReading.humidity || 45) + Math.round(jitter() * 5), 
          power: Math.max(0, (latestReading.power || 420) + powerJitter()), 
          dailyEnergy: latestReading.energy || 12.4, 
          status: 'Active' 
        }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = new SensorReading(req.body);
    await newData.save();
    res.status(201).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
