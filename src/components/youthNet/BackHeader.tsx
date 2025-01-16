import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackHeaderProps {
  headingOne: string;
  headingTwo?: string;
  headingThree?: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({
  headingOne,
  headingTwo,
  headingThree,
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

        {(headingTwo || headingThree) && (
          <Box display="flex" alignItems="center" gap={1}>
            {headingTwo && (
              <Typography variant="body2" sx={{ color: '#4D4639', margin: 0 }}>
                {headingTwo}
              </Typography>
            )}
            {headingThree && (
              <Typography variant="body2" sx={{ color: '#BA1A1A', margin: 0 }}>
                ({headingThree})
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BackHeader;
