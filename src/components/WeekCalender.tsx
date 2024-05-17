import { useState } from 'react';
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { Box } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const Calendar: React.FC<any> = ({ showDetailsHandle, data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [color, setColor] = useState(true);

  const changeMonthHandle = (btnType: string) => {
    if (btnType === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType: string) => {
    //console.log("current week", currentWeek);
    if (btnType === 'prev') {
      //console.log(subWeeks(currentMonth, 1));
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      //console.log(addWeeks(currentMonth, 1));
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day: any, dayStr: string) => {
    setColor(false);
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    const dateFormat = 'MMM yyyy';
    return (
      <div className="header row flex-middle">
        <div className="col col-start"></div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end"></div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'EEEEE';
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

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
        // console.log('cloneDay', cloneDay);
        let percentage = 0;
        let pathColor = 'gray';

        if (data !== null) {
          const dayData = data?.[format(cloneDay, 'yyyy-MM-dd')] || {};
          const presentPercentage = parseFloat(dayData.present_percentage) || 0;
          percentage = presentPercentage;
          if (presentPercentage < 25) {
            pathColor = '#BA1A1A';
          } else if (presentPercentage < 50) {
            pathColor = '#987100';
          } else {
            pathColor = '#06A816';
          }
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
                      })}
                      strokeWidth={15}
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
  const renderFooter = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle('prev')}>
            prev week
          </div>
        </div>
        <div>{currentWeek}</div>
        <div className="col col-end" onClick={() => changeWeekHandle('next')}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };
  return (
    <div className="calendar">
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
