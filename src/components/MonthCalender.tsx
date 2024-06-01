import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  CheckCircleOutlineOutlined,
  CancelOutlined,
} from '@mui/icons-material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { shortDateFormat } from '@/utils/Helper';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
interface CalendarWithAttendanceProps {
  formattedAttendanceData?: FormattedAttendanceData;
  learnerAttendanceDate?: learnerAttendanceDate;
  onChange: (date: Date) => void;
  onDateChange: (date: Date) => void;
}

type AttendanceData = {
  present_percentage: number;
};

type FormattedAttendanceData = {
  [date: string]: AttendanceData;
};

type learnerAttendanceDate = {
  [date: string]: AttendanceData;
};

const MonthCalender: React.FC<CalendarWithAttendanceProps> = ({
  formattedAttendanceData,
  learnerAttendanceDate,
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

  function tileContent({
    date,
    view,
    formattedAttendanceData,
    learnerAttendanceDate,
  }: {
    date: Date;
    view: string;
    formattedAttendanceData?: FormattedAttendanceData;
    learnerAttendanceDate?: learnerAttendanceDate;
  }) {
    if (formattedAttendanceData) {
      if (view !== 'month') return null;
      const dateString = shortDateFormat(date);
      console.log('formattedAttendanceData', formattedAttendanceData);
      const attendanceData = formattedAttendanceData?.[dateString];
      if (!attendanceData) return null;
      const presentPercentage = attendanceData?.present_percentage;

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
    } else if (learnerAttendanceDate) {
      if (view !== 'month') return null;
      const dateString = shortDateFormat(date);
      const attendanceDate = learnerAttendanceDate?.[dateString];
      const status = attendanceDate?.attendanceStatus;
      switch (status) {
        case 'present':
          return (
            <div className="present-marker">
              <CheckCircleOutlineOutlined />
            </div>
          );
        case 'absent':
          return (
            <div className="absent-marker">
              <CancelOutlined />
            </div>
          );
        default:
          return null;
      }
    }
  }

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const classes = ['tile-day'];
    if (date.toDateString() === new Date().toDateString()) {
      classes.push('today');
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
    onChange(activeStartDate);
  };

  const handleDateChange: (value: any) => void = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div>
      <div className="day-tile-wrapper custom-calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          tileContent={({ date, view }) =>
            tileContent({
              date,
              view,
              formattedAttendanceData,
              learnerAttendanceDate,
            })
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
