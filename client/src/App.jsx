import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import ErrorBoundary from "./components/ErrorBoundary";
import "./app.css";
import "./accessibility.css";

// Lazy load pages for better performance
const Lab = lazy(() => import("./pages/lab"));
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Result = lazy(() => import("./pages/result"));
const Organic = lazy(() => import("./pages/organic"));
const Titration = lazy(() => import("./pages/titration"));
const Inorganic = lazy(() => import("./pages/inorganic"));
const History = lazy(() => import("./pages/history"));
const Profile = lazy(() => import("./pages/Profile"));
const Success = lazy(() => import("./pages/success"));

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <ErrorBoundary>
      <div className="App">
        <CursorFollower />
        {showNavbar && <Navbar />}
        <Toaster />

        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#0a0a0a',
            color: '#00ff88',
            fontSize: '1.5rem'
          }}>
            Loading...
          </div>
        }>
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary >
  );
}

export default App;
