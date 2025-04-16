import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import PortfolioTable from './components/PortfolioTable';
import StockDetail from './components/StockDetail';
import theme from './theme';

function App() {
  const [portfolio, setPortfolio] = useState(() => {
    // Initialize portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });

  // Save to localStorage whenever portfolio changes
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  return (
    <Router>
      <div style={{ 
        backgroundColor: theme.background, 
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <NavBar portfolio={portfolio} setPortfolio={setPortfolio} />
        <Routes>
          <Route path="/" element={
            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
              <PortfolioTable portfolio={portfolio} setPortfolio={setPortfolio} />
            </div>
          } />
          <Route path="/stockDetail/:symbol" element={<StockDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;