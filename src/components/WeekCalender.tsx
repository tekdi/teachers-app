import { Telemetry } from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { Box, useTheme } from '@mui/material';
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { dashboardDaysLimit, eventDaysLimit } from '../../app.config';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
const Calendar: React.FC<any> = ({
  showDetailsHandle,
  data,
  disableDays,
  classId,
  showFromToday,
  newWidth,
  eventData,
}) => {
  const theme = useTheme<any>();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [color, setColor] = useState(true);
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
    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'datewise-tracking',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'dashboard',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const renderDays = () => {
    const dateFormat = showFromToday ? 'EEE' : 'EEEEE';
    const days = [];
    const today = new Date();
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
      <div className="days row" style={{ width: '100%' }}>
        {days}
      </div>
    );
  };

  const renderCell = (day: Date, i: number) => {
    const dateFormat = 'd';
    const formattedDate = format(day, dateFormat);
    let percentage = 0;
    let pathColor;
    let showCircularProgress = false;
    const eventScheduled = eventData?.[format(day, 'yyyy-MM-dd')];

    if (data !== null) {
      const dayData = data?.[format(day, 'yyyy-MM-dd')] || {};
      const presentPercentage = parseFloat(dayData.present_percentage) || 0;
      percentage = presentPercentage;
      pathColor = determinePathColor(presentPercentage);

      const dayDataValuesExist = Object.values(dayData).some(
        (value) => value !== null && value !== undefined && value !== ''
      );
      showCircularProgress = dayDataValuesExist;
    }

    return (
      <Box
        key={i}
        display={'flex'}
        border={'1px solid red'}
        width={'14%'}
        height={'20%'}
        overflow={'auto'}
        className={`col cell ${
          isSameDay(day, new Date()) && color
            ? 'WeekToday'
            : isSameDay(day, selectedDate)
              ? 'selected'
              : ''
        }`}
        onClick={() => {
          if (!disableDays) {
            const dayStr = format(day, 'ccc dd MMM yy');
            onDateClickHandle(day, dayStr);
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
            {eventScheduled && (
              <div className="calender-icon">
                <CalendarMonthRoundedIcon
                  style={{
                    color: theme.palette.warning['A400'],
                    fontSize: '15px',
                  }}
                />
              </div>
            )}
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
            )}
          </Box>
        </div>
      </Box>
    );
  };

  const renderCells = () => {
    const today = new Date();
    const endDate = subDays(today, 0);
    const startDate = showFromToday
      ? new Date(today.setDate(today.getDate() + 7))
      : subDays(endDate, dashboardDaysLimit - 1);

    const rows = [];
    let day = startDate;
    let endDay = endDate;
    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < dashboardDaysLimit; i++) {
        days.push(renderCell(day, i));
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day + ''}>
          {days}
        </div>
      );
    }

    if (showFromToday && endDay <= startDate) {
      const days = [];

      for (let i = 0; i < eventDaysLimit; i++) {
        days.push(renderCell(endDay, i));
        endDay = addDays(endDay, 1);
      }

      rows.push(
        <div className="row" key={endDay + ''}>
          {days}
        </div>
      );
    }

    return (
      <div className="body" style={{ width: '100%' }}>
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
      <Box sx={{ width: newWidth }} className="calender_body_width">
        {renderDays()}
        {renderCells()}
      </Box>
    </div>
  );
};

export default Calendar;
