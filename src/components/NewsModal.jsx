import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Link,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import theme from '../theme';

const NewsModal = ({ open, onClose, symbol }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!open) return;
      
      try {
        const { data } = await axios.get(
          `https://api.polygon.io/v2/reference/news?ticker=${symbol}&order=desc&limit=10&sort=published_utc&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`
        );
        setNews(data.results);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="news-modal-title"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 900,
        maxHeight: '90vh',
        bgcolor: theme.background,
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ color: theme.text, fontWeight: 'bold' }}>
            Latest News for {symbol}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: theme.text }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: theme.accent }} />
          </Box>
        ) : (
          <Box sx={{ overflowY: 'auto', pr: 2 }}>
            <Stack spacing={2}>
              {news.map((item) => (
                <Card 
                  key={item.id}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {item.image_url && (
                        <CardMedia
                          component="img"
                          sx={{ 
                            width: 120,
                            height: 80,
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                          image={item.image_url}
                          alt={item.title}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Link
                          href={item.article_url}
                          target="_blank"
                          rel="noopener"
                          sx={{ 
                            color: theme.text,
                            textDecoration: 'none',
                            '&:hover': { color: theme.accent }
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {item.title}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color={theme.grayText} gutterBottom>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.publisher.favicon_url && (
                          <img 
                            src={item.publisher.favicon_url} 
                            alt={item.publisher.name}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                        <Typography variant="caption" color={theme.grayText}>
                          {item.publisher.name} • {new Date(item.published_utc).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {item.keywords?.slice(0, 2).map((keyword, index) => (
                          <Chip
                            key={index}
                            label={keyword}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(124, 77, 255, 0.1)', 
                              color: theme.accent,
                              fontSize: '0.7rem'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default NewsModal;
