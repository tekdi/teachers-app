import { Box, Card, CardContent, Typography } from '@mui/material';

import React, { useEffect, useRef } from 'react';
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
  overflow: 'visible',
}));

const WeekDays: React.FC<WeekDaysProps> = ({ useAbbreviation }) => {
  const theme = useTheme<any>();

  const days = useAbbreviation
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const selectedItem = selectedItemRef.current;

    if (scrollContainer && selectedItem) {
      const containerWidth = scrollContainer.offsetWidth;
      const itemLeft = selectedItem.offsetLeft;
      const itemWidth = selectedItem.offsetWidth;

      const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2;
      scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      overflow="auto"
      ref={scrollContainerRef}
    >
      {days.map((day, index) => (
        <CardStyled
          key={day}
          ref={index === currentDayIndex ? selectedItemRef : null}
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
