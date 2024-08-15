import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';

const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  title,
  subtitle,
}) => {
  const theme = useTheme<any>();

  return (
    <Box>
      <Grid container spacing={2} sx={{ px: '16px !important' }}>
        <Grid item xs={6} md={2} sx={{ mt: 2 }}>
          <Box className="facilitator-bg">
            <Box
              sx={{
                fontSize: '16px',
                fontWeight: '500',
                color: theme?.palette?.warning['A400'],
              }}
            >
              {title}
            </Box>
            <Box
              sx={{
                fontSize: '11px',
                fontWeight: '500',
                color: theme?.palette?.warning['A400'],
              }}
            >
              {subtitle}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;
