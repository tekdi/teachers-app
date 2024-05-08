import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface WeekDaysProps {
  useAbbreviation?: boolean;
}

const CardStyled = styled(Card)(({ theme }) => ({
  width: '60px',
  height: '60px',
  margin: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const WeekDays: React.FC<WeekDaysProps> = ({ useAbbreviation }) => {
  const theme = useTheme<any>();

  const days = useAbbreviation
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();

  return (
    <Box display="flex" justifyContent="center" overflow="auto">
      {days.map((day, index) => (
        <CardStyled
          key={index}
          style={{
            backgroundColor:
              index === currentDayIndex
                ? theme.palette.primary.main
                : 'inherit',
          }}
        >
          <Box className="card" marginTop={'1.5rem'}>
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
