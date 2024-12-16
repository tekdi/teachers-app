import { useEffect, useState } from 'react';
import { getEventList } from '@/services/EventService';
import {
  shortDateFormat,
  getAfterDate,
  getBeforeDate,
  convertToIST,
} from '../utils/Helper';
import { dashboardDaysLimit } from '../../app.config';

const useEventDates = (
  idValue,
  idType,
  modifyAttendanceLimit,
  timeTableDate,
  eventUpdated,
  eventDeleted,
  eventCreated
) => {
  const [eventDates, setEventDates] = useState({});

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        if (idValue && idValue !== '') {
          let startDate, lastDate;

          if (modifyAttendanceLimit === dashboardDaysLimit) {
            const date = new Date(timeTableDate);
            const firstDayOfMonth = new Date(
              date.getFullYear(),
              date.getMonth(),
              1
            );
            startDate = shortDateFormat(firstDayOfMonth);
            const lastDayOfMonth = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );
            lastDate = shortDateFormat(lastDayOfMonth);
          } else {
            const date = new Date();
            startDate = shortDateFormat(new Date());
            const adjustedDate = new Date(
              date.setDate(date.getDate() + modifyAttendanceLimit)
            );
            lastDate = shortDateFormat(adjustedDate);
          }

          const afterDate = getAfterDate(startDate);
          const beforeDate = getBeforeDate(lastDate);
          if (idType === 'userId') {
            idType = 'createdBy';
          }
          const filters = {
            date: {
              after: afterDate,
              before: beforeDate,
            },
            [idType]: idValue,
            status: ['live'],
          };

          const response = await getEventList({
            limit: 0,
            offset: 0,
            filters,
          });

          const newEventDates = {};
          if (response?.events?.length > 0) {
            response.events.forEach((event) => {
              if (event.startDateTime) {
                const eventDate = convertToIST(event.startDateTime);
                newEventDates[eventDate] = { event: true };
              }
            });
          }
          setEventDates(newEventDates);
        }
      } catch (error) {
        console.error('Error fetching event dates:', error);
      }
    };

    fetchEventDates();
  }, [
    idValue,
    idType,
    modifyAttendanceLimit,
    timeTableDate,
    eventUpdated,
    eventDeleted,
    eventCreated,
  ]);

  return eventDates;
};

export default useEventDates;
