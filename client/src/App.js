import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Eager load Landing and Login for fast initial render
import Landing from "./pages/Landing";
import Login from "./pages/Login";

import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import "./app.css";

// Lazy load other pages to split bundles
const Lab = lazy(() => import("./pages/lab"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Result = lazy(() => import("./pages/result"));
const Organic = lazy(() => import("./pages/organic"));
const Titration = lazy(() => import("./pages/titration"));
const Inorganic = lazy(() => import("./pages/inorganic"));
const History = lazy(() => import("./pages/history"));
const Success = lazy(() => import("./pages/success"));

// Simple Loading Fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg-gradient)',
    color: 'var(--primary-neon)',
    fontFamily: 'var(--font-main)',
    fontSize: '1.5rem',
    textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
  }}>
    LOADING SYSTEM...
  </div>
);

function App() {
  const location = useLocation();
  // Don't show Navbar on Landing or Login page
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      <CursorFollower />
      {showNavbar && <Navbar />}

      <Suspense fallback={<LoadingFallback />}>
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
