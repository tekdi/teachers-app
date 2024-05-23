import { Box, Card, CardContent, Typography } from '@mui/material';

import React from 'react';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface WeekDaysProps {
  useAbbreviation?: boolean;
}

const CardStyled = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
  border: '1px solid #ccc',
  boxShadow: 'none',
  backgroundImage: 'none',
  overflow: 'visible'
}));

const WeekDays: React.FC<WeekDaysProps> = ({ useAbbreviation }) => {
  const theme = useTheme<any>();

  const days = useAbbreviation
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();

  return (
    <Box display="flex" justifyContent="flex-start" overflow="auto">
      {days.map((day, index) => (
        <CardStyled
          key={day}
          style={{
            backgroundColor:
              index === currentDayIndex
                ? theme.palette.primary.main
                : 'inherit',
          }}
        >
          <Box
            className="card flex-center"
            sx={{ width: '55px', height: '55px' }}
          >
            <CardContent align-item="center">
              <Typography variant="body1">{day}</Typography>
            </CardContent>
          </Box>
        </CardStyled>
      ))}
    </Box>
  );
};

export default WeekDays;
