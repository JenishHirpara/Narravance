import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AppBar, 
  Toolbar, 
  TextField, 
  Box, 
  Typography, 
  List, 
  ListItem,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import theme from '../theme';

const NavBar = ({ portfolio, setPortfolio }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stocks, setStocks] = useState([]);
  
  // Remove filteredStocks state and use useMemo instead
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return [];
    const searchTermLower = searchTerm.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTermLower) ||
        stock.name.toLowerCase().includes(searchTermLower)
    );
  }, [searchTerm, stocks]);

  // Debounced search term change handler
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  const addToPortfolio = (stock) => {
    if (!portfolio.some(item => item.symbol === stock.symbol)) {
      setPortfolio([...portfolio, stock]);
      console.log('Added to portfolio:', stock.symbol);
    }
  };

  useEffect(() => {
    fetch('/src/assets/stocks.csv')
      .then((response) => response.text())
      .then((data) => {
        const rows = data.split('\n').slice(1);
        const stockData = rows.map((row) => {
          const [symbol, name] = row.split(',');
          return { symbol, name };
        });
        setStocks(stockData);
      });
  }, []);

  return (
    <AppBar 
      sx={{ 
        backgroundColor: theme.primary,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <Container maxWidth={false}>
        <Toolbar sx={{ justifyContent: 'space-between', height: '70px' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.text,
              flexGrow: 0,
            }}
          >
            StockTracker
          </Typography>
          
          <Box sx={{ 
            position: 'relative',
            width: '40%',
            margin: '0 auto',
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span style={{ color: theme.text }}>🔍</span>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '& fieldset': { 
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': { 
                    borderColor: theme.accent,
                  },
                  '&.Mui-focused fieldset': { 
                    borderColor: theme.accent,
                  },
                  '& input': {
                    color: theme.text,
                    '&::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
            
            {searchTerm && (
              <List
                sx={{
                  position: 'absolute',
                  width: '100%',
                  top: '100%',
                  backgroundColor: theme.background,
                  borderRadius: '4px',
                  marginTop: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  maxHeight: '144px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.accent,
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {filteredStocks.map((stock, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      color: theme.text,
                      height: '48px',
                      padding: '0 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      '&:hover': {
                        backgroundColor: theme.hover,
                        cursor: 'pointer',
                      },
                      borderBottom: `1px solid ${theme.border}`,
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 'bold', marginRight: 1 }}>
                        {stock.symbol}
                      </Typography>
                      - 
                      <Typography sx={{ marginLeft: 1, color: 'rgba(255, 255, 255, 0.7)' }}>
                        {stock.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => addToPortfolio(stock)}
                      disabled={portfolio.some(item => item.symbol === stock.symbol)}
                      sx={{
                        color: theme.accent,
                        fontSize: '20px',
                        '&:hover': {
                          backgroundColor: 'rgba(124, 77, 255, 0.1)',
                        },
                        '&.Mui-disabled': {
                          color: theme.border,
                        }
                      }}
                    >
                      +
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
          
          <Box sx={{ flexGrow: 0, width: '100px' }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
