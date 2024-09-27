import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ScheduleModalProps } from '../utils/Interfaces';

const sessionData = [
  {
    key: 'PLANNED_SESSION',
    title: 'CENTER_SESSION.PLANNED_SESSION',
    description: 'CENTER_SESSION.FIXES_SUBJECTS',
  },
  {
    key: 'EXTRA_SESSION',
    title: 'CENTER_SESSION.EXTRA_SESSION',
    description: 'CENTER_SESSION.DOUBT_CLEARING',
  },
];

const Schedule: React.FC<ScheduleModalProps> = ({ handleClick, clickedBox }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { primary, warning } = theme.palette;

  const renderSessionBox = (key: string, title: string, description: string) => (
    <Box
      key={key}
      sx={{
        border: `${clickedBox === key ? '2px' : '1px'} solid ${clickedBox === key ? primary.main : warning['700']}`,
        borderRadius: '8px',
        padding: '15px',
        mb: 2,
        cursor: 'pointer',
      }}
      onClick={() => handleClick?.(key)}
    >
      <Box
        sx={{
          fontSize: '16px',
          fontWeight: '400',
          color: warning['300'],
        }}
      >
        {t(title)}
      </Box>
      <Box>{t(description)}</Box>
    </Box>
  );

  return (
    <Box sx={{ padding: '10px 16px' }}>
      {sessionData.map(({ key, title, description }) => renderSessionBox(key, title, description))}
    </Box>
  );
};

export default Schedule;
