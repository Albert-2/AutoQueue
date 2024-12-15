import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import QueueManagement from "./pages/QueueManagement";
import UserRegistration from "./pages/UserRegistration";
import QueueDetails from "./components/QueueDetails";
import "./App.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/api/users/:queueID/register"
        element={<UserRegistration />}
      />
      <Route path="/api/queues/info/:queueID" element={<QueueDetails />} />
      <Route path="/api/queues" element={<QueueManagement />} />
    </Routes>
  </Router>
);

export default App;
