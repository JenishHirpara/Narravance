import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';

const PortfolioTable = ({ portfolio, setPortfolio }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [jumpPage, setJumpPage] = useState(page + 1);
  const [changedPrices, setChangedPrices] = useState({});
  const previousPrices = useRef({});

  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setJumpPage(newPage + 1);
  };

  const handleRowClick = (symbol) => {
    navigate(`/stockDetail/${symbol}`);
  };

  useEffect(() => {
    const refreshPrices = async () => {
      if (portfolio.length === 0) return;

      try {
        const symbols = portfolio.map((stock) => stock.symbol).join(',');
        const { data } = await axios.get(
          `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${symbols}&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`
        );

        if (data.status === 'OK') {
          const changes = {};
          const updatedPortfolio = portfolio.map((stock) => {
            const latestData = data.tickers.find((t) => t.ticker === stock.symbol);
            if (latestData) {
              const newPrice = latestData.lastTrade?.p || stock.currentPrice;
              const oldPrice = previousPrices.current[stock.symbol]?.currentPrice;

              if (oldPrice && newPrice !== oldPrice) {
                changes[stock.symbol] = newPrice > oldPrice ? 'up' : 'down';
              }

              return {
                ...stock,
                currentPrice: newPrice,
                priceChange: latestData.todaysChange || 0,
              };
            }
            return stock;
          });

          // Update previous prices
          previousPrices.current = updatedPortfolio.reduce((acc, stock) => ({
            ...acc,
            [stock.symbol]: stock,
          }), {});

          setChangedPrices(changes);
          setPortfolio(updatedPortfolio);

          // Clear highlights after animation
          setTimeout(() => setChangedPrices({}), 1000);
        }
      } catch (error) {
        console.error('Error refreshing prices:', error);
      }
    };

    // Initial fetch
    refreshPrices();

    // Set up 15-second interval
    const intervalId = setInterval(refreshPrices, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [portfolio.length, setPortfolio]);

  const headerCellStyle = {
    color: theme.text,
    fontWeight: 'bold',
    backgroundColor: theme.primary,
    fontSize: '1rem',
    borderBottom: `2px solid ${theme.border}`,
    padding: '16px',
  };

  const sortedPortfolio = [...portfolio].sort((a, b) => a.name.localeCompare(b.name));
  const paginatedStocks = sortedPortfolio.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      sx={{
        backgroundColor: theme.background,
        width: '80%',
        margin: '150px auto 0 auto',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        border: '2px solid white',
        overflow: 'hidden',
      }}
    >
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellStyle }}>Symbol</TableCell>
              <TableCell sx={{ ...headerCellStyle }}>Name</TableCell>
              <TableCell sx={{ ...headerCellStyle }} align="right">
                Current Price
              </TableCell>
              <TableCell sx={{ ...headerCellStyle }} align="right">
                Price Change
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStocks.map((stock) => (
              <TableRow
                key={stock.symbol}
                onClick={() => handleRowClick(stock.symbol)}
                className={changedPrices[stock.symbol] ? `highlight-${changedPrices[stock.symbol]}` : ''}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: theme.hover },
                  '& td': {
                    borderBottom: `1px solid ${theme.border}`,
                    padding: '12px 16px',
                  },
                  '&.highlight-up': {
                    backgroundColor: theme.priceUp,
                    transition: 'background-color 1s ease',
                  },
                  '&.highlight-down': {
                    backgroundColor: theme.priceDown,
                    transition: 'background-color 1s ease',
                  },
                }}
              >
                <TableCell sx={{ color: theme.text, fontWeight: 'bold' }}>
                  {stock.symbol}
                </TableCell>
                <TableCell sx={{ color: theme.text }}>{stock.name}</TableCell>
                <TableCell align="right" sx={{ color: theme.text }}>
                  ${stock.currentPrice.toFixed(2)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: stock.priceChange >= 0 ? '#4caf50' : '#f44336',
                    fontWeight: 'bold',
                  }}
                >
                  {stock.priceChange === 0
                    ? '+0.00'
                    : (stock.priceChange > 0 ? '+' : '') + stock.priceChange.toFixed(2)}
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          backgroundColor: theme.background,
          borderTop: `1px solid ${theme.border}`,
          color: theme.text,
        }}
      >
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={portfolio.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{
            color: theme.text,
          }}
        />

        {/* Jump to Page Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography variant="body2" sx={{ color: theme.text }}>
            Jump to page:
          </Typography>
          <input
            type="number"
            min={1}
            max={Math.ceil(portfolio.length / rowsPerPage)}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onBlur={() => {
              const newPage = Number(jumpPage) - 1;
              if (!isNaN(newPage) && newPage >= 0 && newPage < Math.ceil(portfolio.length / rowsPerPage)) {
                setPage(newPage);
              } else {
                setJumpPage(page + 1); // reset to current if invalid
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const newPage = Number(jumpPage) - 1;
                if (!isNaN(newPage) && newPage >= 0 && newPage < Math.ceil(portfolio.length / rowsPerPage)) {
                  setPage(newPage);
                } else {
                  setJumpPage(page + 1); // reset if invalid
                }
              }
            }}
            style={{
              width: '60px',
              padding: '4px 8px',
              backgroundColor: theme.background,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: '4px',
              outline: 'none',
            }}
          />
        </div>
      </div>
    </Paper>
  );
};

export default PortfolioTable;
