import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import RoleSelection from "./Pages/RoleSelection";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
    </Routes>
  );
}

export default App;
