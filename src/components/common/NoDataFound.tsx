import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NoDataFoundProps {
    title?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ title = 'COMMON.NO_DATA_FOUND' }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        m: '1.125rem',
        width: '100%',
      }}
    >
      <Typography
        style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}
      >
        {t(title)}
      </Typography>
    </Box>
  );
}

export default NoDataFound;
