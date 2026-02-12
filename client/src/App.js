import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import PageWrapper from "./components/PageWrapper";
import "./app.css";

function App() {
  const location = useLocation();
  // Don't show Navbar on Landing or Login page
  const showNavbar = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <div className="App">
      <CursorFollower />
      {showNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/lab" element={<PageWrapper><Lab /></PageWrapper>} />
          <Route path="/result" element={<PageWrapper><Result /></PageWrapper>} />
          <Route path="/titration" element={<PageWrapper><Titration /></PageWrapper>} />
          <Route path="/organic" element={<PageWrapper><Organic /></PageWrapper>} />
          <Route path="/inorganic" element={<PageWrapper><Inorganic /></PageWrapper>} />
          <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
          <Route path="/success" element={<PageWrapper><Success /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
