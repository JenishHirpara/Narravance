import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Box, Avatar, Link, CircularProgress } from '@mui/material';
import theme from '../theme';
import axios from 'axios';
import companyIcon from '../assets/company-icon.png';  // You'll need to add this image

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(`https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=gth3um5ZpAC2vBPPiAkqkBisKvLQ0ZoJ`);
        console.log('Stock details response:', response);
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
      <Container sx={{ paddingTop: '90px', color: theme.text }}>
        <CircularProgress sx={{ color: theme.accent }} />
      </Container>
    );
  }

  if (!stockData) {
    return (
      <Container sx={{ paddingTop: '90px', color: theme.text }}>
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

  return (
    <Container sx={{ paddingTop: '90px', paddingBottom: '40px' }}>
      <Paper
        sx={{
          backgroundColor: theme.background,
          padding: '32px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          color: theme.text,
        }}
      >
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Avatar
            src={branding?.logo_url ? `${branding.logo_url}?apiKey=gth3um5ZpAC2vBPPiAkqkBisKvLQ0ZoJ` : companyIcon}
            alt={name}
            variant="rounded"
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: "white",
              '& img': {
                objectFit: 'contain',
                padding: '8px',
              }
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">{name}</Typography>
            <Typography variant="subtitle1" color="gray">{symbol} - {primary_exchange}</Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3, color: '#ccc' }}>{description}</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoLabel title="Market Cap" value={`$${(market_cap / 1e12).toFixed(2)}T`} />
            <InfoLabel title="Employees" value={total_employees?.toLocaleString()} />
            <InfoLabel title="Listed Since" value={list_date} />
            <InfoLabel title="Industry" value={sic_description} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoLabel title="Currency" value={currency_name.toUpperCase()} />
            <InfoLabel title="Phone" value={phone_number} />
            <InfoLabel
              title="Website"
              value={
                <Link href={homepage_url} target="_blank" underline="hover" color={theme.accent}>
                  {homepage_url}
                </Link>
              }
            />
            <InfoLabel
              title="Headquarters"
              value={[
                address?.address1 || '',
                address?.city || '',
                address?.state || '',
                address?.postal_code || ''
              ].filter(Boolean).join(', ') || 'N/A'}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

const InfoLabel = ({ title, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="gray">{title}</Typography>
    <Typography variant="body1" fontWeight="500" color={theme.text}>{value}</Typography>
  </Box>
);

export default StockDetail;
