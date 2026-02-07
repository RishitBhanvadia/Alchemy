import { Routes, Route } from 'react-router-dom';
import Lab from "./pages/lab";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Result from "./pages/result"; // Assuming this is needed for existing logic
import "./app.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/result" element={<Result />} />
        {/* Add other placeholders if they don't exist yet but are in sidebar */}
        <Route path="/titration" element={<div style={{ padding: 50 }}>Titration Page (Coming Soon)</div>} />
        <Route path="/organic" element={<div style={{ padding: 50 }}>Organic Page (Coming Soon)</div>} />
        <Route path="/inorganic" element={<div style={{ padding: 50 }}>Inorganic Page (Coming Soon)</div>} />
        <Route path="/history" element={<div style={{ padding: 50 }}>History Page (Coming Soon)</div>} />
      </Routes>
    </div>
  );
}

export default App;
