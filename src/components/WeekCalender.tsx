import { addDays, format, getWeek, isSameDay, subDays } from 'date-fns';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { dashboardDaysLimit, eventDaysLimit } from '../../app.config';
import useDeterminePathColor from '../hooks/useDeterminePathColor';

const Calendar: React.FC<any> = ({
  showDetailsHandle,
  data,
  disableDays,
  classId,
  showFromToday,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [color, setColor] = useState(true);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const determinePathColor = useDeterminePathColor();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const selectedItem = selectedItemRef.current;

    if (scrollContainer && selectedItem) {
      const containerWidth = scrollContainer.offsetWidth;
      const itemLeft = selectedItem.offsetLeft;
      const itemWidth = selectedItem.offsetWidth;

      const scrollPosition = itemLeft - containerWidth / 2 + itemWidth / 2;
      scrollContainer.scrollTo({ left: scrollPosition });
    }
  }, []);

  const onDateClickHandle = (day: any, dayStr: string) => {
    setColor(false);
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderDays = () => {
    const dateFormat = 'EEEEE';
    const days = [];
    const today = new Date();
    // const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const daysLimit = showFromToday ? eventDaysLimit : dashboardDaysLimit;
    const startDate = showFromToday
      ? subDays(today, 0)
      : subDays(today, dashboardDaysLimit - 1);
    for (let i = 0; i < daysLimit; i++) {
      const day = addDays(startDate, i);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          className={`col col-center${isToday ? ' currentDay' : ''}`}
          key={i}
          ref={isToday ? selectedItemRef : null}
        >
          {isToday ? 'Today' : format(day, dateFormat)}
        </div>
      );
    }

    return (
      <div
        className="days row"
        style={{ width: showFromToday ? '90vw' : '100%' }}
      >
        {days}
      </div>
    );
  };

  const renderCells = () => {
    const today = new Date();
    const endDate = subDays(today, 0);
    let startDate;
    if (showFromToday) {
      startDate = new Date(today);
      startDate.setDate(today.getDate() + 7);
      startDate = subDays(startDate, 0);
    } else {
      startDate = subDays(endDate, dashboardDaysLimit - 1);
    }
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    let showCircularProgress = false;
    let endDay = endDate;

    while (day <= endDate) {
      for (let i = 0; i < dashboardDaysLimit; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        let percentage = 0;
        let pathColor;

        if (data !== null) {
          const dayData = data?.[format(cloneDay, 'yyyy-MM-dd')] || {};
          const presentPercentage = parseFloat(dayData.present_percentage) || 0;
          percentage = presentPercentage;
          pathColor = determinePathColor(presentPercentage);

          const dayDataValuesExist = Object.values(dayData).some(
            (value) => value !== null && value !== undefined && value !== ''
          );
          if (dayDataValuesExist) {
            showCircularProgress = true;
          } else {
            showCircularProgress = false;
          }
        }

        days.push(
          <Box
            key={i}
            display={'flex'}
            border={'1px solid red'}
            width={'14%'}
            height={'20%'}
            overflow={'auto'}
            className={`col cell  ${
              isSameDay(day, new Date()) && color
                ? 'WeekToday'
                : isSameDay(day, selectedDate)
                  ? 'selected '
                  : ''
            }`}
            onClick={() => {
              if (!disableDays) {
                const dayStr = format(cloneDay, 'ccc dd MMM yy');
                onDateClickHandle(cloneDay, dayStr);
              } else {
                null;
              }
            }}
          >
            <div className="circularProgress">
              <div key={day + ''}>
                <span className="number">{formattedDate}</span>
              </div>
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {showCircularProgress && (
                  <Box
                    width={'25px'}
                    height={'2rem'}
                    marginTop={'0.25rem'}
                    padding={0}
                  >
                    <CircularProgressbar
                      value={percentage}
                      styles={buildStyles({
                        textColor: pathColor,
                        pathColor: pathColor,
                        trailColor: '#E6E6E6',
                        strokeLinecap: 'round',
                      })}
                      strokeWidth={20}
                    />
                  </Box>
                )}{' '}
              </Box>
            </div>
          </Box>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day + ''}>
          {days}
        </div>
      );
      days = [];
    }
    if (showFromToday && endDay <= startDate) {
      for (let i = 0; i < eventDaysLimit; i++) {
        formattedDate = format(endDay, dateFormat);
        const cloneDay = endDay;
        let percentage = 0;
        let pathColor;

        if (data !== null) {
          const dayData = data?.[format(cloneDay, 'yyyy-MM-dd')] || {};
          const presentPercentage = parseFloat(dayData.present_percentage) || 0;
          percentage = presentPercentage;
          pathColor = determinePathColor(presentPercentage);

          const dayDataValuesExist = Object.values(dayData).some(
            (value) => value !== null && value !== undefined && value !== ''
          );
          if (dayDataValuesExist) {
            showCircularProgress = true;
          } else {
            showCircularProgress = false;
          }
        }

        days.push(
          <Box
            key={i}
            display={'flex'}
            border={'1px solid red'}
            width={'14%'}
            height={'20%'}
            overflow-x={'none'}
            className={`col cell  ${
              isSameDay(endDay, new Date()) && color
                ? 'WeekToday'
                : isSameDay(endDay, selectedDate)
                  ? 'selected '
                  : ''
            }`}
            onClick={() => {
              if (!disableDays) {
                const dayStr = format(cloneDay, 'ccc dd MMM yy');
                onDateClickHandle(cloneDay, dayStr);
              } else {
                null;
              }
            }}
          >
            <div className="circularProgress">
              <div key={endDay + ''}>
                <span className="number">{formattedDate}</span>
              </div>
              <Box
                width={'100%'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
              >
                {showCircularProgress && (
                  <Box
                    width={'25px'}
                    height={'2rem'}
                    marginTop={'0.25rem'}
                    padding={0}
                  >
                    <CircularProgressbar
                      value={percentage}
                      styles={buildStyles({
                        textColor: pathColor,
                        pathColor: pathColor,
                        trailColor: '#E6E6E6',
                        strokeLinecap: 'round',
                      })}
                      strokeWidth={20}
                    />
                  </Box>
                )}{' '}
              </Box>
            </div>
          </Box>
        );
        endDay = addDays(endDay, 1);
      }

      rows.push(
        <div className="row" key={endDay + ''}>
          {days}
        </div>
      );
      days = [];
    }
    return (
      <div className="body" style={{ width: showFromToday ? '90vw' : '100%' }}>
        {rows}
      </div>
    );
  };

  return (
    <div
      className="calendar"
      ref={scrollContainerRef}
      style={{
        opacity: disableDays ? 0.5 : 1,
        overflow:
          classId === 'all' ? 'hidden' : showFromToday ? 'clip' : 'auto',
      }}
    >
      <Box className="calender_body_width">
        {renderDays()}
        {renderCells()}
      </Box>
    </div>
  );
};

export default Calendar;
