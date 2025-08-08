import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ClaimsList from './components/ClaimsList';
import ClaimDetails from './components/ClaimDetails';
import AddClaim from './components/AddClaim';
import EditClaim from './components/EditClaim';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Claims Management Dashboard</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ClaimsList />} />
            <Route path="/claim/:id" element={<ClaimDetails />} />
            <Route path="/add-claim" element={<AddClaim />} />
            <Route path="/claim/:id/edit" element={<EditClaim />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
