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
          borderBottom={`1px solid ${theme.palette.warning['300']}`}
          margin="0px"
          alignItems={'center'}
          bgcolor={'#E6E6E6'}
          // padding="1rem"
          maxHeight={'auto'}
        >
          <Grid
            container
            alignItems="center"
            textAlign={'center'}
            justifyContent="space-between"
            p={2}
          >
            <Grid item xs={4}>
              <Typography
                textAlign={'left'}
                sx={{ fontSize: '11px', fontWeight: '500' }}
              >
                {t('COMMON.LEARNER_NAME')}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={{ fontSize: '11px', fontWeight: '500' }}>
                {firstColumnName}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={{ fontSize: '11px', fontWeight: '500' }}>
                {secondColumnName}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      ) : (
        'none'
      )}
    </Stack>
  );
};

export default LearnerListHeader;
