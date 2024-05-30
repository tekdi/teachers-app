import { useState } from 'react';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
  subDays,
} from 'date-fns';
import { Box } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

const Calendar: React.FC<any> = ({ showDetailsHandle, data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [color, setColor] = useState(true);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const determinePathColor = useDeterminePathColor();

  // const changeMonthHandle = (btnType: string) => {
  //   if (btnType === 'prev') {
  //     setCurrentMonth(subMonths(currentMonth, 1));
  //   }
  //   if (btnType === 'next') {
  //     setCurrentMonth(addMonths(currentMonth, 1));
  //   }
  // };

  const changeWeekHandle = (btnType: string) => {
    const today = new Date();
    const startDate = subDays(today, 29);
    const newDate =
      btnType === 'prev'
        ? subWeeks(currentMonth, 1)
        : addWeeks(currentMonth, 1);
    const endDate =
      btnType === 'prev'
        ? subWeeks(currentMonth, 2)
        : addWeeks(currentMonth, 2);
    setCurrentMonth(newDate);
    setCurrentWeek(getWeek(newDate));
    setIsNextDisabled(false);
    setIsPrevDisabled(false);
    if (endDate <= startDate) {
      setIsPrevDisabled(true);
    }
    if (endDate >= today) {
      setIsNextDisabled(true);
    }
  };

  const onDateClickHandle = (day: any, dayStr: string) => {
    setColor(false);
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderDays = () => {
    const dateFormat = 'EEEEE';
    const days = [];
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          className={`col col-center${isToday ? ' currentDay' : ''}`}
          key={i}
        >
          {isToday ? 'Today' : format(day, dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    let showCircularProgress = false;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
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
                ? 'today'
                : isSameDay(day, selectedDate)
                  ? 'selected '
                  : ''
            }`}
            onClick={() => {
              const dayStr = format(cloneDay, 'ccc dd MMM yy');
              onDateClickHandle(cloneDay, dayStr);
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
    return <div className="body">{rows}</div>;
  };

  return (
    <div className="calendar">
      {!isPrevDisabled && (
        <div className="prev_btn" onClick={() => changeWeekHandle('prev')}>
          <ArrowDropDownCircleOutlinedIcon />
        </div>
      )}
      {!isNextDisabled && (
        <div className="next_btn" onClick={() => changeWeekHandle('next')}>
          <ArrowDropDownCircleOutlinedIcon />
        </div>
      )}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
