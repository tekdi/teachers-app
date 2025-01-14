import { Box, CardContent, Typography } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';

interface WeekDaysProps {
  useAbbreviation?: boolean;
  onSelectionChange?: (selectedDays: string[]) => void;
  selectedDays?: any[];
  multiselect?: boolean;
}

const WeekDays: React.FC<WeekDaysProps> = ({
  useAbbreviation,
  onSelectionChange,
  selectedDays = [],
  multiselect,
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
    setLocalSelectedDays(selectedDays);
    if (selectedDays && onSelectionChange) {
      const selectedWeekDays = selectedDays.map(
        (dayIndex: any) => fullDays[dayIndex]
      );
      onSelectionChange(selectedWeekDays);
    }
  }, []);

  const handleDayClick = (index: number) => {
    // if (useAbbreviation) {
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
    // }
  };

  // useEffect(() => {
  // if (useAbbreviation) {
  // const selectedWeekDays = selectedDays.map(
  //   (dayIndex) => fullDays[dayIndex]
  // );

  // if (onSelectionChange) {
  //   onSelectionChange(selectedWeekDays);
  // }

  // const selectedIndices = selectedDays.map((day) => fullDays.indexOf(day));
  // setLocalSelectedDays(selectedIndices);
  // }
  // }, [selectedDays, useAbbreviation, fullDays, onSelectionChange]);

  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      overflow={useAbbreviation ? 'none' : 'auto'}
      ref={scrollContainerRef}
      sx={{
        display: 'flex',
        gap: '14.5px',
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingTop: '10px',
        paddingBottom: '10px',
      }}
    >
      {days.map((day, index) => (
        <Box
          key={`${day}-${index}`}
          ref={index === currentDayIndex ? selectedItemRef : null}
          style={{
            backgroundColor: multiselect
              ? localSelectedDays.includes(index)
                ? theme.palette.primary.main
                : 'inherit'
              : index === currentDayIndex
                ? theme.palette.primary.main
                : 'inherit',
            cursor: multiselect ? 'pointer' : 'default',
            border: `1px solid ${theme?.palette?.warning['A100']}`,
            borderRadius: '4px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => handleDayClick(index)}
        >
          <Box
            className="card flex-center"
            sx={{ width: '2.6rem', height: '50px' }}
          >
            <CardContent align-item="center">
              <Typography
                sx={{ color: theme?.palette?.warning['300'], fontSize: '14px' }}
                variant="body1"
              >
                {day}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default WeekDays;
