import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, Paper } from '@mui/material';
import theme from '../theme';

const StockDetail = () => {
  const { symbol } = useParams();

  return (
    <Container 
      sx={{ 
        paddingTop: '90px',
        height: '100vh',
      }}
    >
      <Paper
        sx={{
          backgroundColor: theme.background,
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.text,
            marginBottom: '20px'
          }}
        >
          {symbol} Details
        </Typography>
        {/* We'll add more content here later */}
      </Paper>
    </Container>
  );
};

export default StockDetail;
