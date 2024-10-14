// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home.tsx';
import GridTest from './pages/gridTest.tsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gridTest" element={<GridTest />} />
      </Routes>
    </Router>
  );
}

export default App;
