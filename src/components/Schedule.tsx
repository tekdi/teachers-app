import { Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Schedule = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ padding: '10px 16px' }}>
        <Box
          sx={{
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: '8px',
            padding: '15px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              color: theme?.palette?.warning['300'],
            }}
          >
            {t('CENTER_SESSION.PLANNED_SESSION')}
          </Box>
          <Box>{t('CENTER_SESSION.FIXES_SUBJECTS')}</Box>
        </Box>
        <Box
          sx={{
            border: `2px solid ${theme.palette.primary.main}`,
            borderRadius: '8px',
            padding: '15px',
            mb: 2,
          }}
        >
          <Box
            sx={{
              fontSize: '16px',
              fontWeight: '400',
              color: theme?.palette?.warning['300'],
            }}
          >
            {t('CENTER_SESSION.EXTRA_SESSION')}
          </Box>
          <Box>{t('CENTER_SESSION.DOUBT_CLEARING')}</Box>
        </Box>
      </Box>
    </>
  );
};

export default Schedule;
