import React, { useState } from 'react';
import NavBar from './components/NavBar';
import theme from './theme';
import './App.css';

function App() {
  const [portfolio, setPortfolio] = useState([]);

  return (
    <div style={{ 
      backgroundColor: theme.background, 
      minHeight: '100vh',
      width: '100%'
    }}>
      <NavBar portfolio={portfolio} setPortfolio={setPortfolio} />
    </div>
  );
}

export default App;