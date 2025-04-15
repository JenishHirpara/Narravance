import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import theme from '../theme';

const CandleChart = ({ symbol }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/5/minute/${today}/${today}?adjusted=true&sort=asc&apiKey=gth3um5ZpAC2vBPPiAkqkBisKvLQ0ZoJ`
        );

        if (data.status === 'OK') {
          const formattedData = data.results.map(item => ({
            x: new Date(item.t),
            y: [item.o, item.h, item.l, item.c]
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol]);

  const chartOptions = {
    chart: {
      type: 'candlestick',
      background: theme.background,
      foreColor: theme.text,
      toolbar: {
        tools: {
          download: false, // Hide download button
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        autoSelected: 'zoom'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: theme.text,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.text,
        },
      },
    },
    grid: {
      borderColor: theme.border,
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#4caf50',
          downward: '#f44336'
        }
      }
    },
    title: {
      text: `${symbol} Price Chart`,
      align: 'center',
      style: {
        color: theme.text
      }
    },
    tooltip: {
      theme: 'dark',
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const time = date.toLocaleTimeString();

        return `
          <div style="padding: 8px;">
            <div style="margin-bottom: 4px;"><b>${time}</b></div>
            <div>Open: $${o.toFixed(2)}</div>
            <div>High: $${h.toFixed(2)}</div>
            <div>Low: $${l.toFixed(2)}</div>
            <div>Close: $${c.toFixed(2)}</div>
          </div>
        `;
      }
    },
    theme: {
      mode: 'dark',
      palette: 'palette1'
    },
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress sx={{ color: theme.accent }} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <ReactApexChart
        options={chartOptions}
        series={[{ data: chartData }]}
        type="candlestick"
        height={400}
      />
    </Box>
  );
};

export default CandleChart;
