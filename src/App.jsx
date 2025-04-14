import React, { useState } from 'react';
import NavBar from './components/NavBar';
import PortfolioTable from './components/PortfolioTable';
import theme from './theme';
import './App.css';

function App() {
  const [portfolio, setPortfolio] = useState([]);

  return (
    <div style={{ 
      backgroundColor: theme.background, 
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <NavBar portfolio={portfolio} setPortfolio={setPortfolio} />
      
      <div style={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <PortfolioTable portfolio={portfolio} />
      </div>
    </div>
    
  );
}

export default App;