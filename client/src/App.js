import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import "./app.css";

// Lazy load pages for code splitting
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Lab = lazy(() => import("./pages/lab"));
const Result = lazy(() => import("./pages/result"));
const Titration = lazy(() => import("./pages/titration"));
const Organic = lazy(() => import("./pages/organic"));
const Inorganic = lazy(() => import("./pages/inorganic"));
const History = lazy(() => import("./pages/history"));
const Success = lazy(() => import("./pages/success"));

function App() {
  const location = useLocation();
  // Don't show Navbar on Landing or Login page
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      <CursorFollower />
      {showNavbar && <Navbar />}

      <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>Loading...</div>}>
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
      </Suspense>
    </div>
  );
}

export default App;
