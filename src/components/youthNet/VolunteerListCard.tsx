import React from 'react';
import { Box, Typography, Card, CardContent, Link } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface CardProps {
  title: string;
  entries: number;
  volunteerCount: number;
  actionLabel: string;
  onActionClick: () => void;
}

const VolunteerListCard: React.FC<CardProps> = ({
  title,
  entries,
  volunteerCount,
  actionLabel,
  onActionClick,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mt: 2,
        borderRadius: '8px',
        boxShadow: 1,
        '&:hover': { boxShadow: 3 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CardContent
        sx={{
          p: 2,
          pb: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Title and Entries */}
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {entries} entries
          </Typography>
        </Box>
        <ArrowForwardIosIcon fontSize="small" color="action" />
      </CardContent>
      <Box
        sx={{
          backgroundColor: '#f5f0ff',
          px: 2,
          py: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#6d6d6d',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
          }}
        >
          <Box component="span" sx={{ color: 'red' }}>
            ❗
          </Box>
          {volunteerCount} Volunteers assigned
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 0.5,
          }}
        >
          <Link
            component="button"
            variant="body2"
            color="primary"
            onClick={onActionClick}
            sx={{
              fontWeight: '500',
              color: '#0D599E',
              textDecoration: 'none',
            }}
          >
            {actionLabel}
          </Link>

          <ArrowForwardIcon
            fontSize="small"
            sx={{
              color: '#0D599E',
            }}
          />
        </Box>
      </Box>
    </Card>
  );
};

export default VolunteerListCard;
