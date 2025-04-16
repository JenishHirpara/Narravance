import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
  Link,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import theme from '../theme';
import axios from 'axios';
import companyIcon from '../assets/company-icon.png';
import CandleChart from './CandleChart';

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=gth3um5ZpAC2vBPPiAkqkBisKvLQ0ZoJ`
        );
        console.log(response.data);
        setStockData(response.data.results);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol]);

  if (loading) {
    return (
      <Container 
        sx={{ 
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100vh', // Takes full viewport height
          paddingTop: '0', // Remove the top padding
          color: theme.text 
        }}
      >
        <CircularProgress sx={{ color: theme.accent }} />
      </Container>
    );
  }

  if (!stockData) {
    return (
      <Container sx={{ paddingTop: '70px', color: theme.text }}>
        <Typography variant="h6">No data available for {symbol}</Typography>
      </Container>
    );
  }

  const {
    branding,
    name,
    description,
    homepage_url,
    market_cap,
    total_employees,
    address,
    phone_number,
    primary_exchange,
    list_date,
    sic_description,
    currency_name,
  } = stockData;

  // Reduced padding for the paper components
  const paperStyle = {
    backgroundColor: theme.background,
    padding: { xs: '16px', md: '24px' }, // Reduced padding
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    border: `1px solid ${theme.border}`,
    borderRadius: '16px',
    color: theme.text,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Container maxWidth="xl" sx={{ 
      paddingTop: { xs: '70px', md: '80px' },  // Reduced top padding
      paddingBottom: { xs: '20px', md: '30px' }, // Reduced bottom padding
      paddingLeft: { xs: '12px', md: '24px' }, // Reduced side padding on small screens
      paddingRight: { xs: '12px', md: '24px' },
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 }, // Reduced gap
          width: '100%',
        }}
      >
        {/* Company Info Panel - 30% width on md screens and above */}
        <Box sx={{ 
          flexBasis: { xs: '100%', md: '40%' }, 
          width: { xs: '100%', md: '40%' },
        }}>
          <Paper sx={paperStyle}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                src={
                  branding?.logo_url
                    ? `${branding.logo_url}?apiKey=gth3um5ZpAC2vBPPiAkqkBisKvLQ0ZoJ`
                    : companyIcon
                }
                alt={name}
                variant="rounded"
                sx={{
                  width: { xs: 48, md: 56 }, // Slightly smaller avatar
                  height: { xs: 48, md: 56 },
                  bgcolor: 'white',
                  '& img': {
                    objectFit: 'contain',
                    padding: '6px',
                  },
                }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h5" fontWeight="bold">
                  {name}
                </Typography>
                {description && (
                  <Tooltip title={description} arrow placement="top">
                    <IconButton size="small" sx={{ color: theme.accent, padding: 0 }}>
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Typography variant="subtitle1" color="gray" mb={1}>
              {symbol} - {primary_exchange}
            </Typography>

            {/* Grid with elements side by side from sm breakpoint up */}
            <Grid container spacing={1} sx={{ mt: 0.5 }}>
              {/* First column - always 50% on sm and up */}
              <Grid item xs={12} sm={6}>
                <CompactInfoLabel title="Market Cap" value={`$${(market_cap / 1e12).toFixed(2)}T`} />
                <CompactInfoLabel title="Employees" value={total_employees?.toLocaleString()} />
              </Grid>
              {/* Second column - always 50% on sm and up */}
              <Grid item xs={12} sm={6}>
                <CompactInfoLabel title="Listed Since" value={list_date} />
                <CompactInfoLabel title="Industry" value={sic_description} />
              </Grid>
              {/* Third column - always 50% on sm and up */}
              <Grid item xs={12} sm={6}>
                <CompactInfoLabel title="Currency" value={currency_name?.toUpperCase()} />
                <CompactInfoLabel title="Phone" value={phone_number} />
              </Grid>
              {/* Fourth column - always 50% on sm and up */}
              <Grid item xs={12} sm={6}>
                <CompactInfoLabel
                  title="Website"
                  value={
                    <Link href={homepage_url} target="_blank" underline="hover" color={theme.accent}>
                      {homepage_url?.length > 25 ? `${homepage_url.substring(0, 25)}...` : homepage_url}
                    </Link>
                  }
                />
                <CompactInfoLabel
                  title="Headquarters"
                  value={
                    [
                      address?.address1 || '',
                      address?.city || '',
                      address?.state || '',
                      address?.postal_code || '',
                    ]
                      .filter(Boolean)
                      .join(', ') || 'N/A'
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Chart Panel - 70% width on md screens and above */}
        <Box sx={{ 
          flexBasis: { xs: '100%', md: '60%' }, 
          width: { xs: '100%', md: '60%' },
        }}>
          <Paper sx={paperStyle}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Price Chart
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <CandleChart symbol={symbol} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

// More compact version of InfoLabel with reduced margins
const CompactInfoLabel = ({ title, value }) => (
  <Box sx={{ mb: 1 }}>
    <Typography variant="subtitle2" color="gray" sx={{ mb: 0.25 }}>
      {title}
    </Typography>
    <Typography variant="body2" fontWeight="500" color={theme.text} noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {value}
    </Typography>
  </Box>
);

export default StockDetail;