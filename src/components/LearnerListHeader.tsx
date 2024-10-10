import { Box, Grid, Stack, Typography } from '@mui/material';

import { LearListHeaderProps } from '@/utils/Interfaces';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const LearnerListHeader: React.FC<LearListHeaderProps> = ({
  numberOfColumns,
  firstColumnName,
  secondColumnName,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  return (
    <Stack>
      {numberOfColumns == 3 ? (
        <Box
          borderBottom={`1px solid ${theme.palette.warning['A100']}`}
          margin="0"
          alignItems={'center'}
          bgcolor={'#E6E6E6'}
          maxHeight={'auto'}
          className="br-md-tlr-8"
        >
          <Grid
            container
            alignItems="center"
            textAlign={'center'}
            justifyContent="space-between"
            p={'5px'}
          >
            <Grid item xs={6}>
              <Typography
                textAlign={'left'}
                sx={{
                  fontSize: '11px',
                  fontWeight: '500',
                  paddingLeft: '12px',
                }}
                className="one-line-text"
              >
                {t('COMMON.LEARNER_NAME')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                className="one-line-text"
                sx={{ fontSize: '11px', fontWeight: '500' }}
              >
                {firstColumnName}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                className="one-line-text"
                sx={{ fontSize: '11px', fontWeight: '500' }}
              >
                {secondColumnName}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          borderBottom={`1px solid ${theme.palette.warning['A100']}`}
          margin="0"
          alignItems={'center'}
          bgcolor={'#E6E6E6'}
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
                sx={{ fontSize: '11px', fontWeight: '500' }}
              >
                {t('ATTENDANCE.CENTER_NAME')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '11px', fontWeight: '500' }}>
                {firstColumnName}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Stack>
  );
};

export default LearnerListHeader;
