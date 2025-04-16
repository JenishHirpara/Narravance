import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { Box, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import theme from '../theme';

const TIMEZONES = {
  'GMT': 'GMT',
  'HST': 'Pacific/Honolulu',    // Hawaiian
  'AKST': 'America/Anchorage',  // Alaskan
  'PST': 'America/Los_Angeles', // Pacific
  'MST': 'America/Denver',      // Mountain
  'CST': 'America/Chicago',     // Central
  'EST': 'America/New_York'     // Eastern
};

const CandleChart = ({ symbol }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('GMT');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await axios.get(
          `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/5/minute/${today}/${today}?adjusted=true&sort=asc&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`
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

  const convertToTimezone = (utcDate, timezone) => {
    return new Date(utcDate).toLocaleString('en-US', {
      timeZone: TIMEZONES[timezone],
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    });
  };

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
        formatter: function(val) {
          return convertToTimezone(val, selectedTimezone);
        },
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
        const timestamp = w.globals.seriesX[seriesIndex][dataPointIndex];
        const time = convertToTimezone(timestamp, selectedTimezone);

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
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        mb: 2 
      }}>
        <FormControl 
          size="small"
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-root': {
              color: theme.text,
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
            },
            '& .MuiInputLabel-root': {
              color: theme.grayText,
            },
            '& .MuiSelect-icon': {
              color: theme.text,
            },
            // Style for the dropdown paper
            '& .MuiSelect-select': {
              '&:focus': {
                backgroundColor: 'transparent',
              },
            },
          }}
        >
          <InputLabel id="timezone-select-label">Timezone</InputLabel>
          <Select
            labelId="timezone-select-label"
            value={selectedTimezone}
            label="Timezone"
            onChange={(e) => setSelectedTimezone(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme.background,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  '& .MuiMenuItem-root': {
                    '&:hover': {
                      backgroundColor: theme.hover,
                    },
                    '&.Mui-selected': {
                      backgroundColor: `${theme.accent}40`,
                      '&:hover': {
                        backgroundColor: `${theme.accent}60`,
                      },
                    },
                  },
                },
              },
            }}
          >
            {Object.keys(TIMEZONES).map((tz) => (
              <MenuItem key={tz} value={tz}>
                {tz}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
