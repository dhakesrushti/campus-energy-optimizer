import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Overview from './pages/Overview';
import RealTime from './pages/RealTime';
import RoomWise from './pages/RoomWise';
import Analytics from './pages/Analytics';
import Recommendations from './pages/Recommendations';
import EnergySavings from './pages/EnergySavings';
import Alerts from './pages/Alerts';
import Architecture from './pages/Architecture';

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden text-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/real-time" element={<RealTime />} />
              <Route path="/room-wise" element={<RoomWise />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/energy-savings" element={<EnergySavings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/architecture" element={<Architecture />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
