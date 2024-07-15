import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const DeleteSession = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  return (
    <>
      <Box sx={{ padding: '8px 16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Box>{t('CENTER_SESSION.THIS_SESSION')}</Box>
          <Radio style={{ color: theme?.palette?.warning['300'] }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 2,
          }}
        >
          <Box>{t('CENTER_SESSION.FOLLOWING_SESSIONS')}</Box>
          <Radio style={{ color: theme?.palette?.warning['300'] }} />
        </Box>
      </Box>
    </>
  );
};

export default DeleteSession;
