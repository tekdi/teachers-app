import { Box, Typography } from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const DropoutLabel = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        fontSize: '12px',
        color: theme.palette.warning['300'],
        background: theme.palette.error.light,
        fontWeight: '500',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        padding: '4px 8px',
        my: '0.5rem',
        mr: '11px',
      }}
    >
      <Typography
        sx={{ marginTop: '1px', fontWeight: 500, fontSize: '0.75rem' }}
      >
        {t('COMMON.DROPPED_OUT')}
      </Typography>
    </Box>
  );
};

export default DropoutLabel;
