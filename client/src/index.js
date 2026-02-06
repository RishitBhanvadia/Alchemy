import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Result from "./pages/result";
import Lab from "./pages/lab";
import Organic from "./pages/organic";
import Titration from "./pages/titration";
import Inorganic from "./pages/inorganic";
import Success from "./pages/success";
import History from "./pages/history";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="result" element={<Result />} />
      <Route path="lab" element={<Lab />} />
      <Route path="organic" element={<Organic />} />
      <Route path="titration" element={<Titration />} />
      <Route path="inorganic" element={<Inorganic />} />
      <Route path="success" element={<Success />} />
      <Route path="history" element={<History />} />
    </Routes>
  </BrowserRouter>
);
