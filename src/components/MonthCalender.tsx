import 'react-calendar/dist/Calendar.css';

import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { shortDateFormat } from '@/utils/Helper';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
import useStore from '../store/store';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { format } from 'date-fns';

interface CalendarWithAttendanceProps {
  formattedAttendanceData?: FormattedAttendanceData;
  learnerAttendanceDate?: learnerAttendanceDate;
  onChange: (date: Date) => void;
  onDateChange: (date: Date | Date[] | null) => void;
  selectionType?: 'single' | 'range';
  selectedRangeRetention?: Date | null | undefined | [Date | null, Date | null];
  eventData?: any;
}

type AttendanceData = {
  present_percentage?: number;
  attendanceStatus?: string;
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
  selectionType,
  selectedRangeRetention,
  eventData,
}) => {
  const store = useStore();
  const setValue = useStore((state) => state.setValue);
  const [date, setDate] = useState<
    Date | null | undefined | [Date | null, Date | null]
  >(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const selectedMonth = localStorage.getItem('selectedMonth');
      if (selectedMonth) {
        const parsedDate = new Date(selectedMonth);
        if (!Number.isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
    }
    return new Date();
  });

  const [selectedDates, setSelectedDates] = useState<
    [Date | null, Date | null] | null
  >(null);
  const determinePathColor = useDeterminePathColor();
  //  useEffect(() => {
  //   const currentDate = new Date();
  //   localStorage.setItem('activeStartDate', currentDate.toDateString());
  // }, []);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (selectionType === 'range') {
        setDate(null);
        const touch = event.touches[0];
        const startDate = getDateFromTouch(touch);
        if (startDate) {
          setSelectedDates([startDate, startDate]);
          onDateChange([startDate, startDate]);
        }
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (selectionType === 'range') {
        const touch = event.touches[0];
        const moveDate = getDateFromTouch(touch);

        if (moveDate && selectedDates) {
          const [startDate] = selectedDates;
          setSelectedDates([startDate, moveDate]);
          if (startDate !== null) {
            onDateChange([startDate, moveDate]);
          }
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (selectionType === 'range') {
        const touch = event.changedTouches[0];
        const endDate = getDateFromTouch(touch);
        if (endDate && selectedDates) {
          const [startDate] = selectedDates;
          setSelectedDates([startDate, endDate]);
          if (startDate !== null) {
            onDateChange([startDate, endDate]);
          }
        }
      }
    };
    const getDateFromTouch = (touch: Touch) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (element) {
        const tile = element.closest('.react-calendar__tile');
        if (tile) {
          const abbr = tile.querySelector('abbr');
          if (abbr) {
            const dateString = abbr.getAttribute('aria-label');
            if (dateString) {
              return new Date(dateString);
            }
          }
        }
      }
      return null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [selectedDates, onDateChange]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.localStorage &&
      selectionType === 'range'
    ) {
      const retentionDate = localStorage.getItem('selectedRangeArray');
      if (retentionDate) {
        try {
          const retention = JSON.parse(retentionDate);
          if (retention) {
            handleDateChange(retention);
          }
        } catch (error) {
          console.error('Failed to parse date range:', error);
        }
      }
    }
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
    const eventScheduled = eventData?.[format(date, 'yyyy-MM-dd')];

    if (formattedAttendanceData) {
      if (view !== 'month') return null;
      const dateString = shortDateFormat(date);
      const attendanceData = formattedAttendanceData?.[dateString];
      if (!attendanceData) return null;
      const presentPercentage = attendanceData?.present_percentage || 0;

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
    } else if (eventScheduled) {
      return (
        <div className="calender-icon">
          <CalendarMonthRoundedIcon
            className="custom-calendar-icon"
            sx={{ fontSize: '15px' }}
          />
        </div>
      );
    }
  }

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null;
    const classes = [
      selectionType === 'range' ? 'custom-date-range-pop-up' : 'tile-day',
    ];
    if (date.toDateString() === new Date().toDateString()) {
      classes.push('today');
    }

    if (selectedDates) {
      const [start, end] = selectedDates;
      if (start && end) {
        const startDate = new Date(start).setHours(0, 0, 0, 0);
        const endDate = new Date(end).setHours(0, 0, 0, 0);
        const currentDate = new Date(date).setHours(0, 0, 0, 0);

        if (currentDate > startDate && currentDate < endDate) {
          classes.push('selected-range');
        } else if (currentDate === startDate || currentDate === endDate) {
          classes.push('selected-start-end');
        }
      }
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
    onChange(activeStartDate);
  };

  const handleDateChange = (
    newDate: Date | null | undefined | [Date | null, Date | null]
  ) => {
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    setDate(newDate);
    if (newDate !== undefined) {
      setValue(JSON.stringify(newDate));
    } else {
      console.error('newDate is undefined');
    }
    if (newDate !== undefined) {
      let datesToSet: [Date | null, Date | null];
      if (Array.isArray(newDate)) {
        datesToSet = [newDate[0] || null, newDate[1] || null];
      } else {
        datesToSet = [newDate || null, newDate || null];
      }
      setSelectedDates(datesToSet);
    }
    onDateChange(newDate as Date | Date[] | null);

    if (newDate === null) {
      setDate(null);
      setSelectedDates(null);
      onDateChange(null);
    } else if (Array.isArray(newDate)) {
      if (newDate) {
        setDate(newDate);
        setSelectedDates(newDate);
        onDateChange(newDate as Date | Date[] | null);
      }
    } else {
      const formattedDate = formatDate(newDate as Date);
      setDate(newDate);
      if (typeof newDate === 'object') {
        setSelectedDates([newDate, newDate]);
      }
      onDateChange(newDate as Date | Date[] | null);
    }
  };

  const handleClickDay = (clickedDate: Date) => {
    setSelectedDates(null);
  };

  return (
    <div>
      <div className="day-tile-wrapper custom-calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          selectRange={selectionType === 'range'}
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
          className="calender-body" // need to add gradient color in custom theme
          formatShortWeekday={formatShortWeekday}
          onActiveStartDateChange={handleActiveStartDateChange}
          onClickDay={handleClickDay}
        />
      </div>
    </div>
  );
};

export default MonthCalender;
