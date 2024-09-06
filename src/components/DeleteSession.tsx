import { Box, Radio, RadioGroup } from '@mui/material';
import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const DeleteSession = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState('thisSession');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Box sx={{ padding: '8px 16px' }}>
      <RadioGroup value={selectedValue} onChange={handleChange}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Box>{t('CENTER_SESSION.THIS_SESSION')}</Box>
          <Radio
            value="thisSession"
            style={{ color: theme?.palette?.warning['300'] }}
          />
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
          <Radio
            value="followingSessions"
            style={{ color: theme?.palette?.warning['300'] }}
          />
        </Box>
      </RadioGroup>
    </Box>
  );
};

export default DeleteSession;
