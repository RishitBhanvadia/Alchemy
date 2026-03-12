import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingOverlay from "./components/LoadingOverlay";
import { LabSkeleton, DashboardSkeleton } from "./components/SkeletonLoader";
import "./app.css";
import "./accessibility.css";

// Lazy load pages for better performance
const Lab = lazy(() => import("./pages/lab"));
const Lab3D = lazy(() => import("./pages/Lab3D"));
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
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <ErrorBoundary>
      <div className="App">
        <CursorFollower />
        {showNavbar && <Navbar />}
        <Toaster />

        <Routes>
          <Route path="/" element={<Suspense fallback={<LoadingOverlay />}><Landing /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<LoadingOverlay />}><Login /></Suspense>} />
          <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
          <Route path="/lab" element={<Suspense fallback={<LoadingOverlay />}><Lab /></Suspense>} />
          <Route path="/lab-3d" element={<Suspense fallback={<LabSkeleton />}><Lab3D /></Suspense>} />
          <Route path="/result" element={<Suspense fallback={<LoadingOverlay />}><Result /></Suspense>} />
          <Route path="/titration" element={<Suspense fallback={<LoadingOverlay />}><Titration /></Suspense>} />
          <Route path="/organic" element={<Suspense fallback={<LoadingOverlay />}><Organic /></Suspense>} />
          <Route path="/inorganic" element={<Suspense fallback={<LoadingOverlay />}><Inorganic /></Suspense>} />
          <Route path="/history" element={<Suspense fallback={<LoadingOverlay />}><History /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<LoadingOverlay />}><Profile /></Suspense>} />
          <Route path="/success" element={<Suspense fallback={<LoadingOverlay />}><Success /></Suspense>} />
          <Route path="/dashboard/teacher" element={<Suspense fallback={<DashboardSkeleton />}><TeacherDashboard /></Suspense>} />
        </Routes>
      </div>
    </ErrorBoundary >
  );
}

export default App;
