import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { TimeTableCardProps } from '@/utils/Interfaces';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useTheme } from '@mui/material/styles';

const TimeTableCard: React.FC<TimeTableCardProps> = ({
  subject,
  instructor,
  time,
}) => {
  const theme = useTheme<any>();
  return (
    <Box>
      <Card
        sx={{ border: '1px solid #ccc', borderRadius: '8px', margin: '15px' }}
      >
        <CardContent sx={{ alignItems: 'center' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid item xs={1.5}>
              <ApartmentIcon />
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h5"
                sx={{ fontWeight: '400', fontSize: '16px' }}
                component="div"
              >
                {subject}
              </Typography>
              <Typography
                margin={0}
                color={theme.palette.warning['400']}
                fontSize={'14px'}
                fontWeight={'400'}
                variant="body2"
              >
                {instructor}
              </Typography>
            </Grid>
            <Grid item xs={4.5}>
              <Typography
                margin={0}
                color={theme.palette.warning['400']}
                fontSize={'14px'}
                fontWeight={'400'}
                // variant="h5"
                component="div"
              >
                {time}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TimeTableCard;
