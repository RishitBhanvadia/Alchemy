import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from "./components/Navbar";
import CursorFollower from "./components/CursorFollower";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingOverlay from "./components/LoadingOverlay";
import { LabSkeleton, DashboardSkeleton } from "./components/SkeletonLoader";
import { PrivateRoute, RoleRoute } from './utils/roleGuard';
import "./app.css";
import "./accessibility.css";

// Lazy load pages for better performance
const Lab = lazy(() => import("./pages/lab"));
const Lab3D = lazy(() => import("./pages/Lab3D"));
const Landing = lazy(() => import("./pages/Landing"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const Result = lazy(() => import("./pages/result"));
const Organic = lazy(() => import("./pages/organic"));
const Titration = lazy(() => import("./pages/titration"));
const Inorganic = lazy(() => import("./pages/inorganic"));
const History = lazy(() => import("./pages/history"));
const Profile = lazy(() => import("./pages/Profile"));
const Success = lazy(() => import("./pages/success"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const ClassroomDetail = lazy(() => import("./pages/ClassroomDetail"));

import useAuthStore from './store/authStore';

// Redirect root to correct dashboard based on role
function RootRedirect() {
  const profile = useAuthStore(state => state.profile);
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  if (loading) return <LoadingOverlay />;
  // If no user, show Landing page
  if (!user) return <Suspense fallback={<LoadingOverlay />}><Landing /></Suspense>;
  // If profile is still null after loading, redirect to login (auth without profile)
  if (!profile) return <Navigate to="/login" replace />;

  return <Navigate to={(profile.role === 'teacher' || profile.role === 'admin') ? '/teacher' : '/student'} replace />;
}

function App() {
  const init = useAuthStore(state => state.init);
  const loading = useAuthStore(state => state.loading);
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // Only redirect if everything is loaded and we are on /login
    if (!loading && user && profile && location.pathname === '/login') {

      const target = (profile.role === 'teacher' || profile.role === 'admin') ? '/teacher' : '/student';
      // console.log('Redirecting to:', target, 'Profile role:', profile.role);
      navigate(target, { replace: true });
    }
  }, [user, profile, loading, location.pathname, navigate]);

  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  if (loading) {
    return <LoadingOverlay />; 
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <CursorFollower />
        {showNavbar && <Navbar />}
        <Toaster />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Suspense fallback={<LoadingOverlay />}><AuthPage /></Suspense>} />


          {/* Student-only routes */}
          <Route path="/student" element={
            <PrivateRoute>
              <RoleRoute requiredRole="student">
                <Suspense fallback={<DashboardSkeleton />}><StudentDashboard /></Suspense>
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="/student/lab" element={
            <PrivateRoute>
              <RoleRoute requiredRole="student">
                <Suspense fallback={<LabSkeleton />}><Lab3D /></Suspense>
              </RoleRoute>
            </PrivateRoute>
          } />
          
          {/* Shared authenticated routes (mostly student-centric for now) */}
          <Route path="/lab" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Lab /></Suspense></PrivateRoute>} />
          <Route path="/result" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Result /></Suspense></PrivateRoute>} />
          <Route path="/titration" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Titration /></Suspense></PrivateRoute>} />
          <Route path="/organic" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Organic /></Suspense></PrivateRoute>} />
          <Route path="/inorganic" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Inorganic /></Suspense></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><History /></Suspense></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Profile /></Suspense></PrivateRoute>} />
          <Route path="/success" element={<PrivateRoute><Suspense fallback={<LoadingOverlay />}><Success /></Suspense></PrivateRoute>} />

          {/* Teacher-only routes */}
          <Route path="/teacher" element={
            <PrivateRoute>
              <RoleRoute requiredRole="teacher">
                <Suspense fallback={<DashboardSkeleton />}><TeacherDashboard /></Suspense>
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="/teacher/analytics" element={
            <PrivateRoute>
              <RoleRoute requiredRole="teacher">
                <Suspense fallback={<DashboardSkeleton />}><TeacherDashboard analytics /></Suspense>
              </RoleRoute>
            </PrivateRoute>
          } />
          {/* Placeholder for classroom detail (Iteration 11) */}
          <Route path="/teacher/classroom/:id" element={
            <PrivateRoute>
              <RoleRoute requiredRole="teacher">
                <Suspense fallback={<LoadingOverlay />}><ClassroomDetail /></Suspense>
              </RoleRoute>
            </PrivateRoute>
          } />

          {/* Catch-all redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AnimatePresence>
      </div>
    </ErrorBoundary >
  );
}

export default App;
