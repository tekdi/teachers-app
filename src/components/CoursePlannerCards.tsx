import React from 'react';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CoursePlannerCardsProps } from '@/utils/Interfaces';

const CoursePlannerCards: React.FC<CoursePlannerCardsProps> = ({
  resources,
}) => {
  const theme = useTheme<any>();

  console.log(resources)

  return (
    <Box>
      <Grid container spacing={2} sx={{ px: '16px !important', cursor: 'pointer' }} >
        {resources?.map((resource: {
          link: string; name: string  }, index: number) => (
          <Grid item xs={6} md={2} sx={{ mt: 2 }} key={index}>
            <Box className="facilitator-bg"  onClick={() => {
                      console.log(resources)
                      window.open(resource?.link, '_blank');
                    }}>
              <Box
                sx={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['A400'],
                }}
              >
                {resource?.name}
              </Box>
              <Box
                sx={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['A400'],
                }}
              >
                Subtitle
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoursePlannerCards;
