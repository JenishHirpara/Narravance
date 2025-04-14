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
import theme from '../theme';

const PortfolioTable = ({ portfolio }) => {
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
            <TableCell 
              sx={{ 
                color: theme.text, 
                fontWeight: 'bold',
                backgroundColor: theme.primary,
                fontSize: '1rem',
                borderBottom: `2px solid ${theme.border}`,
                padding: '16px',  // Added padding
                width: '30%',     // Fixed width for symbol column
              }}
            >
              Symbol
            </TableCell>
            <TableCell 
              sx={{ 
                color: theme.text, 
                fontWeight: 'bold',
                backgroundColor: theme.primary,
                fontSize: '1rem',
                borderBottom: `2px solid ${theme.border}`,
                padding: '16px',  // Added padding
              }}
            >
              Name
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {portfolio.map((stock) => (
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
                {stock.symbol}
              </TableCell>
              <TableCell 
                sx={{ 
                  color: theme.text,
                }}
              >
                {stock.name}
              </TableCell>
            </TableRow>
          ))}
          {portfolio.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={2} 
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
