import React, { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  CheckCircleOutlineOutlined,
  CancelOutlined,
  RemoveCircleOutline,
  RemoveOutlined,
} from '@mui/icons-material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { shortDateFormat } from '@/utils/Helper';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
interface CalendarWithAttendanceProps {
  formattedAttendanceData: FormattedAttendanceData;
  onChange: (date: Date) => void;
  onDateChange: (date: Date) => void;
}

type AttendanceData = {
  present_percentage: number;
};

type FormattedAttendanceData = {
  [date: string]: AttendanceData;
};

const MonthCalender: React.FC<CalendarWithAttendanceProps> = ({
  formattedAttendanceData,
  onChange,
  onDateChange,
}) => {
  const [date, setDate] = useState(() => new Date());
  const determinePathColor = useDeterminePathColor();

  useEffect(() => {
    const currentDate = new Date();
    localStorage.setItem('activeStartDate', currentDate.toDateString());
    console.log('activeStartDate child', currentDate);
  }, []);

  function reduceDatesByOneDay(dates: string[]) {
    return dates.map((dateString) => {
      const date = new Date(dateString);
      date.setDate(date.getDate() - 1);
      return date.toISOString().slice(0, 10);
    });
  }

  function getAttendanceStatus(date: Date) {
    const dateString = date.toISOString().slice(0, 10);
    // const currentDate = new Date().toISOString().slice(0, 10);

    return null;
  }

  function tileContent({
    date,
    view,
    formattedAttendanceData,
  }: {
    date: Date;
    view: string;
    formattedAttendanceData: FormattedAttendanceData;
  }) {
    if (view !== 'month') return null;
    const dateString = shortDateFormat(date);
    const attendanceData = formattedAttendanceData?.[dateString];
    if (!attendanceData) return null;
    const presentPercentage = attendanceData.present_percentage;

    // const status = getAttendanceStatus(date);
    const pathColor = determinePathColor(presentPercentage);

    const status = 'present';
    switch (status) {
      case 'present':
        return (
          <div className="circularProgressBar">
            <CircularProgressbar
              value={presentPercentage}
              styles={buildStyles({
                textColor: pathColor,
                pathColor: pathColor,
                trailColor: '#E6E6E6',
                strokeLinecap: 'round',
              })}
              strokeWidth={20}
            />
          </div>
        );
      default:
        return null;
    }
  }

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const classes = ['tile-day'];
    if (date.toDateString() === new Date().toDateString()) {
      classes.push('today');
    }
    if (getAttendanceStatus(date) === 'attendanceNotMarked') {
      classes.push('attendance-not-marked');
    }
    return classes.join(' ');
  }

  const formatShortWeekday: (
    locale: string | undefined,
    date: Date
  ) => string = (locale, date) => {
    if (!date) {
      return '';
    }
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return weekdays[date.getDay()];
  };

  const handleActiveStartDateChange: ({
    action,
    activeStartDate,
    value,
    view,
  }: any) => void = ({ activeStartDate }) => {
    console.log('Active start date changed:', activeStartDate);
    // localStorage.setItem("activeStartDate", activeStartDate);
    onChange(activeStartDate);
  };

  const handleDateChange: (value: any) => void = (newDate) => {
    // Handle the selected date here
    console.log('Selected date:', newDate?.toDateString());
    setDate(newDate); // Update state with the new selected date if needed
    onDateChange(newDate);
  };

  return (
    <div>
      <div className="day-tile-wrapper custom-calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={({ date, view }) =>
            tileContent({ date, view, formattedAttendanceData })
          }
          tileClassName={tileClassName}
          calendarType="gregory"
          className="calender-body"
          formatShortWeekday={formatShortWeekday}
          onActiveStartDateChange={handleActiveStartDateChange}
        />
      </div>
    </div>
  );
};

export default MonthCalender;
