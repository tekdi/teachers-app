import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackHeaderProps {
  headingOne: string;
  headingTwo?: any;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  headingOne,
  headingTwo,
  onBackClick,
  showBackButton = false,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      sx={{
        margin: '18px 0',
        color: '#4D4639',
      }}
    >
      {showBackButton && (
        <IconButton
          onClick={onBackClick}
          sx={{
            color: '#4D4639',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Box>
        <Typography textAlign="left" fontSize="22px">
          {headingOne}
        </Typography>
        {headingTwo && (
          <Typography variant="body2" sx={{ color: '#4D4639', margin: 0 }}>
            {headingTwo}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BackHeader;
