import { Box, Grid, Stack, Typography } from '@mui/material';

import { CohortAttendanceListViewProps } from '@/utils/Interfaces';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { lowLearnerAttendanceLimit } from '../../app.config';

const CohortAttendanceListView: React.FC<CohortAttendanceListViewProps> = ({
  cohortName,
  attendancePercent,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const textColor = attendancePercent > lowLearnerAttendanceLimit ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Stack>
      <Box
        borderBottom={`1px solid ${theme.palette.warning['A100']}`}
        margin="0"
        alignItems={'center'}

        bgcolor={theme.palette.warning['A400']}
        maxHeight={'auto'}
      >
        <Grid
          container
          alignItems="center"
          textAlign={'center'}
          justifyContent="space-between"
          p={'5px'}
        >
          <Grid item xs={9}>
            <Typography
              textAlign={'left'}
              sx={{ fontSize: '0.875rem', fontWeight: '400', color: theme.palette.warning['300'] }}
            >
              {cohortName}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '1rem', fontWeight: '500', color: textColor }}>
              {attendancePercent}%
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default CohortAttendanceListView;
