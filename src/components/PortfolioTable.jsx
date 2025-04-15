import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import theme from '../theme';

const PortfolioTable = ({ portfolio }) => {
  const headerCellStyle = {
    color: theme.text,
    fontWeight: 'bold',
    backgroundColor: theme.primary,
    fontSize: '1rem',
    borderBottom: `2px solid ${theme.border}`,
    padding: '16px',
  };

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: theme.background,
        width: '80%',
        margin: '150px auto 0 auto',
        height: 'auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '2px solid white', // temp border to debug
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...headerCellStyle }}>Symbol</TableCell>
            <TableCell sx={{ ...headerCellStyle }}>Name</TableCell>
            <TableCell sx={{ ...headerCellStyle }} align="right">Current Price</TableCell>
            <TableCell sx={{ ...headerCellStyle }} align="right">Price Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...portfolio]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((stock) => (
            <TableRow 
              key={stock.symbol}
              sx={{
                '&:hover': {
                  backgroundColor: theme.hover,
                },
                '& td': {
                  borderBottom: `1px solid ${theme.border}`,
                  padding: '12px 16px', // Added padding
                }
              }}
            >
              <TableCell 
                sx={{ 
                  color: theme.text,
                  fontWeight: 'bold',
                }}
              >
                <Link 
                  to={`/stockDetail/${stock.symbol}`}
                  style={{ 
                    color: theme.text,
                    textDecoration: 'none',
                  }}
                >
                  {stock.symbol}
                </Link>
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.text,
                }}
              >
                {stock.name}
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ color: theme.text }}
              >
                ${stock.currentPrice.toFixed(2)}
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  color: stock.priceChange >= 0 || stock.priceChange === 0 ? '#4caf50' : '#f44336',
                  fontWeight: 'bold'
                }}
              >
                {stock.priceChange === 0 ? '+0.00' : 
                  (stock.priceChange > 0 ? '+' : '') + stock.priceChange.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          {portfolio.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={4} 
                align="center"
                sx={{ 
                  color: theme.text,
                  padding: '24px',
                  borderBottom: 'none',
                }}
              >
                <Typography variant="body1">
                  No stocks in portfolio. Use the search bar to add stocks.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PortfolioTable;
