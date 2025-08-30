import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip
} from '@mui/material';
import type { ChangeType, MetricCardProps } from '../types';

const MetricCard = ({ data } : MetricCardProps) => {
  const getChangeColor = (type: ChangeType): string => {
    switch (type) {
      case 'positive':
        return '#22c55e';
      case 'negative':
        return '#ef4444';
      case 'neutral':
        return '#ff7b00ff';
      default:
        return '#6b7280';
    }
  };

  const IconComponent = data.icon;

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '100%',
        color: 'white',
        borderRadius: "1.5rem",
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with title and icon */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          mb: 2 
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            {data.title}
          </Typography>
          <Box sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconComponent size={16} color="#94a3b8" />
          </Box>
        </Box>

        {/* Main value */}
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '2rem',
            mb: 1,
            color: '#1e293b'
          }}
        >
          {data.value}
        </Typography>

        {/* Change indicator and description */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Chip
            label={data.change}
            size="small"
            sx={{
              backgroundColor: getChangeColor(data.changeType),
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 600,
              height: 24,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#94a3b8',
              fontSize: '0.75rem'
            }}
          >
            {data.description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
