import { Box, Card, CardContent, Typography } from '@mui/material';

import React, { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

interface WeekDaysProps {
  useAbbreviation?: boolean;
  onSelectionChange?: (selectedDays: string[]) => void;
  selectedDays?: string[];
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

const WeekDays: React.FC<WeekDaysProps> = ({
  useAbbreviation,
  onSelectionChange,
  selectedDays = [],
}) => {
  const theme = useTheme<any>();
  const [localSelectedDays, setLocalSelectedDays] = useState<number[]>([]);
  const fullDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = useAbbreviation ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : fullDays;

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

  const handleDayClick = (index: number) => {
    if (useAbbreviation) {
      // setLocalSelectedDays((prev) =>
      //   prev.includes(index)
      //     ? prev.filter((day) => day !== index)
      //     : [...prev, index]
      // );
      const newSelectedDays = localSelectedDays.includes(index)
        ? localSelectedDays.filter((day) => day !== index)
        : [...localSelectedDays, index];

      setLocalSelectedDays(newSelectedDays);

      if (onSelectionChange) {
        const selectedWeekDays = newSelectedDays.map(
          (dayIndex) => fullDays[dayIndex]
        );
        onSelectionChange(selectedWeekDays);
      }
    }
  };

  useEffect(() => {
    if (useAbbreviation) {
      // const selectedWeekDays = selectedDays.map(
      //   (dayIndex) => fullDays[dayIndex]
      // );
      // console.log('Selected days:', selectedWeekDays);

      // if (onSelectionChange) {
      //   onSelectionChange(selectedWeekDays);
      // }

      const selectedIndices = selectedDays.map((day) => fullDays.indexOf(day));
      setLocalSelectedDays(selectedIndices);
    }
  }, [selectedDays, useAbbreviation, fullDays, onSelectionChange]);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      overflow={useAbbreviation ? 'none' : 'auto'}
      ref={scrollContainerRef}
    >
      {days.map((day, index) => (
        <CardStyled
          key={`${day}-${index}`}
          ref={index === currentDayIndex ? selectedItemRef : null}
          style={{
            backgroundColor: useAbbreviation
              ? localSelectedDays.includes(index)
                ? theme.palette.primary.main
                : 'inherit'
              : index === currentDayIndex
                ? theme.palette.primary.main
                : 'inherit',
            cursor: useAbbreviation ? 'pointer' : 'default',
          }}
          onClick={() => handleDayClick(index)}
        >
          <Box
            className="card flex-center"
            sx={{ width: 'auto', height: '50px' }}
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
