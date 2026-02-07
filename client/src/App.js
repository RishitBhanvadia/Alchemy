import { Routes, Route, useLocation } from 'react-router-dom';
import Lab from "./pages/lab";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Result from "./pages/result";
import Organic from "./pages/organic";
import Titration from "./pages/titration";
import Inorganic from "./pages/inorganic";
import History from "./pages/history";
import Success from "./pages/success";
import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import "./app.css";

function App() {
  const location = useLocation();
  // Don't show Navbar on Landing or Login page
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      <CursorFollower />
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/result" element={<Result />} />
        <Route path="/titration" element={<Titration />} />
        <Route path="/organic" element={<Organic />} />
        <Route path="/inorganic" element={<Inorganic />} />
        <Route path="/history" element={<History />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;
