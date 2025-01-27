import * as React from 'react';

import useNotification from '@/hooks/useNotification';
import { createEvent, editEvent } from '@/services/EventService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { getOptionsByCategory } from '@/utils/Helper';
import { CreateEvent, PlannedModalProps } from '@/utils/Interfaces';
import {
  CenterType,
  Role,
  Status,
  Telemetry,
  sessionMode,
  sessionType,
} from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import {
  DaysOfWeek,
  eventDaysLimit,
  frameworkId,
  idealTimeForSession,
  timeZone,
} from '../../app.config';
import ConfirmationModal from './ConfirmationModal';
import SessionMode from './SessionMode';
import { showToastMessage } from './Toastify';
import WeekDays from './WeekDays';

dayjs.extend(utc);
dayjs.extend(timezone);
type mode = (typeof sessionMode)[keyof typeof sessionMode];
// type type = (typeof sessionType)[keyof typeof sessionType];

interface Session {
  id?: number | string;
  sessionMode?: string;
  // sessionType?: string;
  selectedWeekDays?: string[];
  DaysOfWeek?: number[];
  recurringStartDate?: string;
  startDatetime?: string;
  endDatetime?: string;
  endDateValue?: string;
  courseType?: string | null;
  subjectDropdown?: string[] | null;
  subject?: string | null;
  subjectTitle?: string;
  isRecurring?: boolean;
  meetingLink?: string;
  meetingPasscode?: string;
  onlineProvider?: string;
  sessionStartDate?: Dayjs | null | undefined;
  sessionEndDate?: Dayjs | null | undefined;
  sessionStartTime?: Dayjs | null | undefined;
  sessionEndTime?: Dayjs | null | undefined;
}

const PlannedSession: React.FC<PlannedModalProps> = ({
  removeModal,
  clickedBox,
  scheduleEvent,
  cohortName,
  cohortType,
  cohortId,
  onCloseModal,
  editSession,
  onEventDeleted,
  eventData,
  updateEvent,
  onEventUpdated,
  StateName,
  board,
  medium,
  grade,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [mode, setMode] = useState<mode>(
    cohortType === CenterType.REGULAR ? sessionMode.OFFLINE : sessionMode.ONLINE
  );
  // const [eventType, setEventType] = useState<type>(sessionType.JUST);
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkTouched, setLinkTouched] = useState(false);
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>();
  const [editEventData, setEditEventData] = useState(eventData);

  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const [selectedCourseType, setSelectedCourseType] = useState<string>();
  const [selectedBlockId, setSelectedBlockId] = useState<number>(0);
  const [editSelection, setEditSelection] = React.useState(
    t('CENTER_SESSION.EDIT_THIS_SESSION')
  );
  const [courseTypes, setCourseTypes] = useState<string[]>();
  const [subjectLists, setSubjectLists] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>();
  const [initialEventData, setInitialEventData] = useState(null);
  const [shortDescription, setShortDescription] = useState<string>('');
  const [meetingPasscode, setMeetingPasscode] = useState<string>();
  const [selectedDays, setSelectedDays] = useState<number[]>();
  dayjs.extend(utc);
  const [startDates, setStartDates] = useState<Dayjs[]>([]);
  const [endDates, setEndDates] = useState<Dayjs[]>([]);
  const [startTimes, setStartTimes] = useState<Dayjs[]>([]);
  const [endTimes, setEndTimes] = useState<Dayjs[]>([]);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [eventValid, setEventValid] = useState(true);
  const [sessionBlocks, setSessionBlocks] = useState<Session[]>([
    {
      id: 0,
      selectedWeekDays: [],
      DaysOfWeek: [],
      sessionMode: mode,
      // sessionType: eventType,
      startDatetime: '',
      endDatetime: '',
      endDateValue: '',
      subject: null,
      courseType: null,
      subjectTitle: '',
      isRecurring: false,
      meetingLink: '',
      meetingPasscode: '',
      onlineProvider: '',
      sessionStartDate: startDates[0],
      sessionEndDate: endDates[0],
      sessionStartTime: startTimes[0],
      sessionEndTime: endTimes[0],
    },
  ]);

  useEffect(() => {
    const handleBMGS = async () => {
      try {
        if (medium && grade && board) {
          const url = `/api/framework/v1/read/${frameworkId}`;
          const boardData = await fetch(url).then((res) => res.json());
          const frameworks = boardData?.result?.framework;

          // const getStates = getOptionsByCategory(frameworks, 'state');
          // const matchState = getStates.find(
          //   (item: any) =>
          //     item?.name?.toLowerCase() === StateName?.toLocaleLowerCase()
          // );

          const getBoards = getOptionsByCategory(frameworks, 'board');
          const matchBoard = getBoards.find((item: any) => item.name === board);

          const getMedium = getOptionsByCategory(frameworks, 'medium');
          const matchMedium = getMedium.find(
            (item: any) => item.name === medium
          );

          const getGrades = getOptionsByCategory(frameworks, 'gradeLevel');
          const matchGrade = getGrades.find((item: any) => item.name === grade);

          const getCourseTypes = getOptionsByCategory(frameworks, 'courseType');
          const courseTypes = getCourseTypes?.map((type: any) => type.name);
          setCourseTypes(courseTypes);

          const getSubjects = getOptionsByCategory(frameworks, 'subject');
          const subjects = getSubjects?.map((type: any) => type.name);
          console.log('subjects!!', getSubjects);
          // setCourseTypes(courseTypes);

          // const courseTypesAssociations = getCourseTypes?.map((type: any) => {
          //   return {
          //     code: type.code,
          //     name: type.name,
          //     associations: type.associations,
          //   };
          // });
          // const subjectAssociations = getSubjects?.map((type: any) => {
          //   return {
          //     code: type.code,
          //     name: type.name,
          //     associations: type.associations,
          //   };
          // });

          // const courseSubjectLists = getSubjects.map((subject: any) => {
          const commonAssociations = getSubjects?.filter(
            (assoc: any) =>
              // matchState?.associations.filter(
              //   (item: any) => item.code === assoc.code
              // )?.length &&
              matchBoard?.associations.filter(
                (item: any) => item.code === assoc.code
              )?.length &&
              matchMedium?.associations.filter(
                (item: any) => item.code === assoc.code
              )?.length &&
              matchGrade?.associations.filter(
                (item: any) => item.code === assoc.code
              )?.length
          );
          // const getSubjects = getOptionsByCategory(frameworks, 'subject');
          // const subjectAssociations = commonAssociations?.filter(
          //   (assoc: any) =>
          //     getSubjects.map((item: any) => assoc.code === item?.code)
          // );
          console.log('commonAssociations', commonAssociations);
          // return {
          // courseTypeName: courseType?.name,
          // courseType: courseType?.code,
          const subjectList = commonAssociations?.map(
            (subject: any) => subject?.name
          );
          // };
          // });
          setSubjectLists(subjectList);
        }
      } catch (error) {
        console.error('Error fetching board data:', error);
      }
    };
    handleBMGS();
  }, []);

  useEffect(() => {
    if (eventData) {
      setInitialEventData(eventData);
      const mode =
        eventData?.meetingDetails?.url !== undefined
          ? sessionMode.ONLINE
          : sessionMode.OFFLINE;
      setMode(mode);
      const courseType = eventData?.metadata?.courseType;
      setSelectedCourseType(courseType);
      // const courseSubjects = subjectLists?.find(
      //   (item: any) => item.courseTypeName === courseType
      // );
      // if (courseSubjects) {
      // setSubjects(subjectLists);
      // }
      const sub = eventData?.metadata?.subject;
      setSelectedSubject(sub);
      const sessionTitle = eventData?.shortDescription;
      setShortDescription(sessionTitle);
      const url = eventData?.meetingDetails?.url;
      setLink(url);
      const passcode = eventData?.meetingDetails?.password;
      setMeetingPasscode(passcode);

      const startDateTime = eventData?.startDateTime;
      const endDateTime = eventData?.endDateTime;
      const endDateValue = eventData?.recurrencePattern?.endCondition?.value;
      const recurringStartDate =
        eventData?.recurrencePattern?.recurringStartDate;

      const localStartDateTime = dayjs.utc(startDateTime).tz(timeZone);
      const localEndDateTime = dayjs.utc(endDateTime).tz(timeZone);
      const localEndDateValue = dayjs.utc(endDateValue).tz(timeZone);
      const recurringStartDateValue = dayjs
        .utc(recurringStartDate)
        .tz(timeZone);

      setStartTimes([localStartDateTime]);
      if (editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION')) {
        setEndDates([localEndDateTime.startOf('day')]);
        setStartDates([localStartDateTime.startOf('day')]);
      } else {
        setEndDates([localEndDateValue.startOf('day')]);
        setStartDates([recurringStartDateValue.startOf('day')]);
      }

      setEndTimes([localEndDateTime]);

      const recurrencePattern = eventData?.recurrencePattern?.daysOfWeek;
      setSelectedDays(recurrencePattern);
      setSessionBlocks([
        {
          id: 0,
          subject: sub,
          subjectTitle: sessionTitle,
          startDatetime: startDateTime,
          endDatetime: endDateTime,
          endDateValue: endDateValue,
        },
      ]);
    }
  }, [eventData, editSelection, subjectLists]);

  const handleOpenModel = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditSelection = (selection: string, eventData: any) => {
    setEditSelection(selection);
  };

  useEffect(() => {
    const initialStartDateTime = combineDateAndTime(
      startDates[selectedBlockId],
      startTimes[selectedBlockId]
    );
    const initialEndDateTime = combineDateAndTime(
      startDates[selectedBlockId],
      endTimes[selectedBlockId]
    );
    const sessionEndDate = combineDateAndTime(
      endDates[selectedBlockId],
      endTimes[selectedBlockId]
    );

    const startDatetime = convertToUTC(initialStartDateTime);
    const endDatetime = convertToUTC(initialEndDateTime);
    const endDateValue = convertToUTC(sessionEndDate);

    setSessionBlocks((blocks) =>
      blocks.map((block) =>
        block.id === selectedBlockId
          ? {
              ...block,
              startDatetime: startDatetime || '',
              endDatetime: endDatetime || '',
              endDateValue: endDateValue || '',
              sessionStartDate: startDates[selectedBlockId],
              sessionEndDate: endDates[selectedBlockId],
              sessionStartTime: startTimes[selectedBlockId],
              sessionEndTime: endTimes[selectedBlockId],
            }
          : block
      )
    );
  }, [startDates, startTimes, endDates, endTimes, selectedBlockId]);

  const handleSessionModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string | number | undefined
  ) => {
    const mode = event.target.value;
    setMode(mode as mode);
    const updatedSessionBlocks = sessionBlocks.map((block) =>
      block.id === id
        ? { ...block, sessionMode: event.target.value.toLowerCase() }
        : block
    );
    setSessionBlocks(updatedSessionBlocks);
  };

  const handleSubjectChange = (
    id: number | string | undefined,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newSubject = event.target.value as string;
    setSelectedSubject(newSubject);
    setSessionBlocks(
      sessionBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              subject: newSubject,
            }
          : block
      )
    );
  };

  const handleCourseTypeChange = (
    id: number | string | undefined,
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newCourseType = event.target.value as string;
    setSelectedCourseType(newCourseType);
    const courseSubjects = subjectLists?.find(
      (item: any) => item.courseTypeName === newCourseType
    );

    // if (courseSubjects) {
    //   setSubjects(courseSubjects.subjects);
    // }
    setSessionBlocks(
      sessionBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              courseType: newCourseType,
              subjectDropdown: subjectLists,
            }
          : block
      )
    );
  };

  const combineDateAndTime = (
    date: Dayjs | null,
    time: Dayjs | null
  ): Dayjs | null => {
    if (date && time) {
      const dateTime = date
        .hour(time.hour())
        .minute(time.minute())
        .second(time.second());
      return dateTime;
    }
    return null;
  };

  const convertToUTC = (dateTime: Dayjs | null): string | null => {
    return dateTime ? dateTime.utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : null;
  };

  const handleChange = (
    id: number,
    newValue: Dayjs | null,
    type: 'start' | 'end',
    field: 'date' | 'time'
  ) => {
    setSelectedBlockId(id);
    if (newValue) {
      const isValid = true;

      setStartTimeError(null);
      setEndTimeError(null);
      setStartDateError(null);
      setDateError(null);
      setEndDateError(null);

      const sessionBlock = sessionBlocks?.find((block) => block.id === id);
      if (!sessionBlock) return;

      if (type === 'start' && field === 'date') {
        if (newValue.isAfter(sessionBlock.sessionEndDate)) {
          setEventValid(false);
          setStartDateError(t('CENTER_SESSION.START_DATE_ERROR'));
        }

        const today = dayjs();
        if (newValue.isBefore(today, 'day')) {
          setEventValid(false);
          setStartDateError(
            t('CENTER_SESSION.START_DATE_MUST_BE_TODAY_OR_FUTURE_DATE')
          );
          setDateError(t('CENTER_SESSION.DATE_MUST_BE_TODAY_OR_FUTURE_DATE'));
        }
        setStartDates((prev) => {
          const updated = [...prev];
          const combinedStartDateTime = combineDateAndTime(
            newValue,
            sessionBlock.sessionStartTime ?? null
          );
          const combinedEndDateTime = combineDateAndTime(
            newValue,
            sessionBlock.sessionEndTime ?? null
          );
          updated[id] = newValue;
          updateSessionBlock(
            id,
            combinedStartDateTime,
            combinedEndDateTime,
            sessionBlock.sessionEndDate ?? null,
            type
          );
          return updated;
        });
      } else if (type === 'start' && field === 'time') {
        const combinedStartDateTime = combineDateAndTime(
          sessionBlock.sessionStartDate ?? null,
          newValue
        );
        if (
          combinedStartDateTime?.isAfter(
            combineDateAndTime(
              sessionBlock.sessionStartDate ?? null,
              sessionBlock.sessionEndTime ?? null
            )
          )
        ) {
          setEventValid(false);
          setStartTimeError(t('CENTER_SESSION.START_TIME_ERROR'));
        }
        setStartTimes((prev) => {
          const updated = [...prev];
          const combinedStartDateTime = combineDateAndTime(
            sessionBlock.sessionStartDate ?? null,
            newValue
          );
          updated[id] = newValue;
          updateSessionBlock(
            id,
            combinedStartDateTime,
            sessionBlock.sessionEndTime ?? null,
            sessionBlock.sessionEndDate ?? null,
            type
          );
          return updated;
        });
      } else if (type === 'end' && field === 'date') {
        if (newValue.isBefore(sessionBlock.sessionStartDate)) {
          setEventValid(false);
          setEndDateError(t('CENTER_SESSION.END_DATE_ERROR'));
        }
        setEndDates((prev) => {
          const updated = [...prev];
          const combinedEndDateTime = combineDateAndTime(
            newValue,
            sessionBlock.sessionEndTime ?? null
          );
          updated[id] = newValue;
          updateSessionBlock(
            id,
            sessionBlock.sessionStartDate ?? null,
            sessionBlock.sessionEndTime ?? null,
            combinedEndDateTime,
            type
          );
          return updated;
        });
      } else if (type === 'end' && field === 'time') {
        const combinedEndDateTime = combineDateAndTime(
          sessionBlock.sessionStartDate ?? null,
          newValue
        );
        if (
          combinedEndDateTime?.isBefore(
            combineDateAndTime(
              sessionBlock.sessionStartDate ?? null,
              sessionBlock.sessionStartTime ?? null
            )
          )
        ) {
          setEventValid(false);
          setEndTimeError(t('CENTER_SESSION.END_TIME_ERROR'));
        }
        setEndTimes((prev) => {
          const updated = [...prev];
          const combinedEndDateTime = combineDateAndTime(
            sessionBlock.sessionStartDate ?? null,
            newValue
          );
          updated[id] = newValue;
          const combinedEndDateValue = combineDateAndTime(
            sessionBlock.sessionEndDate ?? null,
            newValue
          );
          updateSessionBlock(
            id,
            sessionBlock.sessionStartDate ?? null,
            combinedEndDateTime,
            combinedEndDateValue,
            type
          );
          return updated;
        });
      }
    }
  };

  const updateSessionBlock = (
    id: number,
    combinedStartDateTime: Dayjs | null,
    combinedEndDateTime: Dayjs | null,
    combinedEndDateValue: Dayjs | null,
    type: 'start' | 'end'
  ) => {
    setSelectedBlockId(id);
    const sessionBlock = sessionBlocks?.find((block) => block.id === id);
    if (!sessionBlock) return;

    let endDatetime: any;
    let startDatetime: any;
    let recurringStartDate: any;
    let endDateValue: any;
    if (type === 'start') {
      const combinedStartDate = combineDateAndTime(
        sessionBlock.sessionStartDate ?? null,
        combinedStartDateTime
      );
      const combinedEndDate = combineDateAndTime(
        sessionBlock.sessionStartDate ?? null,
        combinedEndDateTime
      );
      endDatetime = convertToUTC(combinedEndDate);
      startDatetime = convertToUTC(combinedStartDate);

      recurringStartDate = convertToUTC(combinedStartDateTime);
      const endValue = combineDateAndTime(
        combinedEndDateValue,
        combinedEndDateTime
      );
      endDateValue =
        clickedBox === 'EXTRA_SESSION' ? endDatetime : convertToUTC(endValue);
    } else if (type === 'end') {
      const startDatetimeValue = combineDateAndTime(
        combinedEndDateTime,
        sessionBlock.sessionStartTime ?? null
      );
      startDatetime = convertToUTC(sessionBlock.sessionStartTime ?? null);
      const endDatetimeValue = combineDateAndTime(
        sessionBlock.sessionStartTime ?? null,
        combinedEndDateTime
      );
      endDatetime = convertToUTC(endDatetimeValue);
      const combinedStartDate = combineDateAndTime(
        sessionBlock.sessionStartDate ?? null,
        sessionBlock.sessionStartTime ?? null
      );
      recurringStartDate = convertToUTC(combinedStartDate);
      endDateValue =
        clickedBox === 'EXTRA_SESSION'
          ? endDatetime
          : convertToUTC(combinedEndDateValue);
    }

    if (startDatetime && endDatetime && endDateValue) {
      const isRecurringEvent = endDatetime !== endDateValue ? true : false;
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === id
            ? {
                ...block,
                recurringStartDate: recurringStartDate,
                startDatetime: startDatetime,
                endDatetime: endDatetime,
                endDateValue: endDateValue,
                isRecurring: isRecurringEvent,
                sessionStartDate: startDates[id],
                sessionEndDate: endDates[id],
                sessionStartTime: startTimes[id],
                sessionEndTime: endTimes[id],
              }
            : block
        )
      );
    }
  };

  useEffect(() => {
    const combinedStartDateTime = combineDateAndTime(
      startDates[selectedBlockId],
      startTimes[selectedBlockId]
    );
    const combinedEndDateTime = combineDateAndTime(
      startDates[selectedBlockId],
      endTimes[selectedBlockId]
    );
    const combinedEndDateValue = combineDateAndTime(
      endDates[selectedBlockId],
      endTimes[selectedBlockId]
    );

    const startDatetime = convertToUTC(combinedStartDateTime);
    const endDatetime = convertToUTC(combinedEndDateTime);
    const endDateValue =
      clickedBox === 'EXTRA_SESSION'
        ? endDatetime
        : convertToUTC(combinedEndDateValue);

    if (startDatetime && endDatetime && endDateValue) {
      const isRecurringEvent = endDatetime !== endDateValue ? true : false;
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === selectedBlockId
            ? {
                ...block,
                startDatetime: startDatetime,
                endDatetime: endDatetime,
                endDateValue: endDateValue,
                isRecurring: isRecurringEvent,
                sessionStartDate: startDates[selectedBlockId],
                sessionEndDate: endDates[selectedBlockId],
                sessionStartTime: startTimes[selectedBlockId],
                sessionEndTime: endTimes[selectedBlockId],
              }
            : block
        )
      );
    }
  }, [startDates, endDates, startTimes, endTimes, selectedBlockId]);

  const CustomTimePicker = styled(TimePicker)(({ theme }) => ({
    '& .MuiInputAdornment-root': {
      display: 'none',
    },
  }));

  const handleLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string | number | undefined
  ) => {
    const value = event?.target?.value;
    setLink(value);
    if (linkTouched) {
      setLinkError(!value ? t('CENTER_SESSION.MEETING_LINK_REQUIRED') : '');
    }
    // const zoomLinkPattern =
    //   /^https?:\/\/[\w-]*\.?zoom\.(com|us)\/(j|my)\/[\w-]+(\?[\w=&-]*)?$/;

    // const googleMeetLinkPattern =
    //   /^https?:\/\/meet\.(google\.com|[a-zA-Z0-9-]+\.com)\/[a-z]{3,}-[a-z]{3,}-[a-z]{3}(\?[\w=&-]*)?$/;

    let onlineProvider: string;
    if (value.includes('zoom')) {
      setLinkError('');
      onlineProvider = t('CENTER_SESSION.ZOOM');
    } else if (value.includes('google')) {
      setLinkError('');
      onlineProvider = t('CENTER_SESSION.GOOGLEMEET');
    } else {
      setLinkError(t('CENTER_SESSION.ENTER_VALID_MEETING_LINK'));
    }

    setSessionBlocks(
      sessionBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              meetingLink: value,
              onlineProvider: onlineProvider,
            }
          : block
      )
    );
  };

  const handleLinkBlur = () => {
    setLinkTouched(true);
    if (!link) {
      setLinkError(t('CENTER_SESSION.MEETING_LINK_REQUIRED'));
    }
  };

  const handlePasscodeChange = (
    event: any,
    id: string | number | undefined
  ) => {
    const value = event?.target?.value;
    setMeetingPasscode(value);
    setSessionBlocks(
      sessionBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              meetingPasscode: value,
            }
          : block
      )
    );
  };

  const handleSelectionChange = (
    id: string | number | undefined,
    newSelectedDays: string[]
  ) => {
    const mappedSelectedDays = newSelectedDays?.map(
      (day) => DaysOfWeek[day as keyof typeof DaysOfWeek]
    );
    setSelectedDays(mappedSelectedDays);

    setSessionBlocks(
      sessionBlocks.map((block) =>
        block?.id === id
          ? {
              ...block,
              selectedWeekDays: newSelectedDays,
              DaysOfWeek: mappedSelectedDays,
            }
          : block
      )
    );
  };

  const handleSubjectTitleChange = (
    event: any,
    id: string | number | undefined
  ) => {
    const value = event?.target?.value;
    setShortDescription(value);
    setSessionBlocks(
      sessionBlocks.map((block) =>
        block.id === id
          ? {
              ...block,
              subjectTitle: value,
            }
          : block
      )
    );
  };
  const { getNotification } = useNotification();

  const handleAddSession = () => {
    const newSessionId = sessionBlocks.length;
    setSessionBlocks([
      ...sessionBlocks,
      {
        id: newSessionId,
        selectedWeekDays: [],
        DaysOfWeek: [],
        sessionMode: '',
        // sessionType: '',
        startDatetime: '',
        endDatetime: '',
        subject: null,
        subjectTitle: '',
        meetingLink: '',
        meetingPasscode: '',
        onlineProvider: '',
        sessionStartDate: null,
        sessionEndDate: null,
        sessionStartTime: null,
        sessionEndTime: null,
      },
    ]);
    setSelectedBlockId(newSessionId);
  };

  const handleRemoveSession = (id: any) => {
    setSessionBlocks(sessionBlocks.filter((block) => block?.id !== id));
  };

  const scheduleNewEvent = async () => {
    if (!scheduleEvent) return;

    try {
      const userId =
        typeof window !== 'undefined'
          ? localStorage.getItem('userId') || ''
          : '';
      const userName =
        typeof window !== 'undefined'
          ? localStorage.getItem('userName') || ''
          : '';

      // Initialize variables
      let attendeeCount = 0;
      let attendeeArray: string[] = [];

      // Fetch cohort members if cohortId is available
      if (cohortId) {
        const filters = {
          cohortId,
          role: Role.STUDENT,
          status: [Status.ACTIVE],
        };

        const response = await getMyCohortMemberList({
          limit: 20,
          page: 0,
          filters,
        });

        const resp = response?.result;

        if (resp) {
          attendeeCount = resp.totalCount || 0;
          attendeeArray =
            resp.userDetails?.map((attendee: any) => attendee.userId) || [];
        }
      }

      // Determine title based on clickedBox and mode
      let title = '';
      if (clickedBox === 'PLANNED_SESSION') {
        title =
          mode === t('CENTER_SESSION.ONLINE')
            ? t('CENTER_SESSION.RECURRING_ONLINE')
            : t('CENTER_SESSION.RECURRING_OFFLINE');
      } else if (clickedBox === 'EXTRA_SESSION') {
        title =
          mode === t('CENTER_SESSION.ONLINE')
            ? t('CENTER_SESSION.EXTRA_ONLINE')
            : t('CENTER_SESSION.EXTRA_OFFLINE');
      }

      // Create API bodies
      const apiBodies: CreateEvent[] = sessionBlocks.map((block) => {
        const baseBody: CreateEvent = {
          title,
          shortDescription: block?.subjectTitle || shortDescription,
          description: '',
          eventType: block?.sessionMode || mode,
          isRestricted: true,
          autoEnroll: true,
          location: cohortName || '',
          // longitude: '',
          // latitude: '',
          maxAttendees: attendeeCount,
          attendees: attendeeArray,
          status: 'live',
          createdBy: userId,
          updatedBy: userId,
          idealTime: idealTimeForSession,
          isRecurring: block?.isRecurring || false,
          startDatetime: block?.startDatetime || '',
          endDatetime: block?.endDatetime || '',
          registrationStartDate: '',
          registrationEndDate: '',
          metaData: {
            category: title,
            courseType: block?.courseType || '',
            subject: block?.subject || '',
            teacherName: userName,
            cohortId: cohortId || '',
            cycleId: '',
            tenantId: '',
            type:
              clickedBox === 'PLANNED_SESSION'
                ? sessionType.PLANNED
                : sessionType.EXTRA,
          },
        };

        if (block?.isRecurring) {
          baseBody.recurrencePattern = {
            frequency:
              block?.selectedWeekDays?.length === eventDaysLimit
                ? 'daily'
                : 'weekly',
            interval: 1,
            daysOfWeek: block?.DaysOfWeek || [],
            endCondition: {
              type: 'endDate',
              value: block?.endDateValue || '',
            },
            recurringStartDate: block?.startDatetime || '',
          };
        }

        // Add meetingDetails only if sessionMode is 'online'
        if (block?.sessionMode === t('CENTER_SESSION.ONLINE')) {
          (baseBody.onlineProvider = block?.onlineProvider || ''),
            (baseBody.isMeetingNew = false),
            (baseBody.meetingDetails = {
              url: block?.meetingLink || '',
              password: block?.meetingPasscode || '',
              id: '',
            });
        }

        return baseBody;
      });
      // if (eventValid) {
      await Promise.all(
        apiBodies.map(async (apiBody) => {
          try {
            const isEventValid = validateEventBody(apiBody);
            if (isEventValid) {
              const response = await createEvent(apiBody);

              if (response?.responseCode === 'Created') {
                showToastMessage(
                  t('COMMON.SESSION_SCHEDULED_SUCCESSFULLY'),
                  'success'
                );

                if (cohortId) {
                  const replacements = { '{sessionName}': shortDescription };
                  const filters = {
                    cohortId,
                    role: Role.STUDENT,
                    // status: [Status.ACTIVE],
                  };
                  try {
                    const response = await getMyCohortMemberList({
                      // limit: 20,
                      // page: 0,
                      filters,
                    });

                    if (response?.result?.userDetails) {
                      const deviceId = response?.result?.userDetails
                        ?.flatMap((device: any) => device.deviceId || [])
                        .filter((id: any) => id !== null);
                      if (deviceId?.length > 0) {
                        getNotification(
                          deviceId,
                          'LEARNER_NEW_SESSION_ALERT',
                          replacements
                        );
                      } else {
                        console.warn(
                          'No valid device IDs found. Skipping notification API call.'
                        );
                      }
                    }
                  } catch (error) {
                    console.error('Error fetching cohort member list:', error);
                  }
                }

                const windowUrl = window.location.pathname;
                const cleanedUrl = windowUrl.replace(/^\//, '');
                const telemetryInteract = {
                  context: {
                    env: 'teaching-center',
                    cdata: [],
                  },
                  edata: {
                    id: 'event-created-successfully',
                    type: Telemetry.CLICK,
                    subtype: '',
                    pageid: cleanedUrl,
                  },
                };
                telemetryFactory.interact(telemetryInteract);

                ReactGA.event('event-created-successfully', {
                  creatorId: userId,
                });
                if (onCloseModal) {
                  onCloseModal();
                }
              } else {
                if (response?.response?.data?.params?.errmsg) {
                  const errMsg = response?.response?.data?.params?.errmsg;
                  let errorMessage;
                  if (typeof errMsg === 'string') {
                    console.log(errMsg);
                    errorMessage = errMsg;
                  } else {
                    errorMessage =
                      errMsg[0] + (errMsg[1] ? ' and ' + errMsg[1] : '');
                  }
                  showToastMessage(errorMessage, 'error');
                } else {
                  showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
                }
              }
              // if (onCloseModal) {
              //   console.log('list api got called');
              //   onCloseModal();
              // }
            }
          } catch (error) {
            console.error('Error creating event:', error);
            // if (onCloseModal) {
            //   onCloseModal();
            // }
          }
        })
      );
      // }
    } catch (error) {
      console.error('Error scheduling new event:', error);
      ReactGA.event('event-creation-fail', {
        error: error,
      });
    }
  };

  const validateEventBody = (eventBody: any) => {
    const showError = (message: string) => {
      showToastMessage(message, 'error');
      return false;
    };

    if (eventBody?.meetingDetails && eventBody?.meetingDetails?.url === '') {
      return showError(t('CENTER_SESSION.MEETING_URL_ERROR'));
    }
    if (eventBody.isRecurring) {
      if (
        !eventBody?.recurrencePattern?.daysOfWeek ||
        eventBody.recurrencePattern.daysOfWeek.length === 0
      ) {
        return showError(t('CENTER_SESSION.WEEKDAY_ERROR'));
      }
      if (
        eventBody.startDatetime.slice(0, 10) !==
        eventBody.endDatetime.slice(0, 10)
      ) {
        return showError(t('CENTER_SESSION.MULTIDAY_EVENT_ERROR'));
      }
      return true;
    }
    const boxType = clickedBox ?? '';

    if (['PLANNED_SESSION', 'EXTRA_SESSION']?.includes(boxType)) {
      // if (
      //   boxType === 'PLANNED_SESSION' &&
      //   !eventBody?.recurrencePattern?.daysOfWeek
      // ) {
      //   return showError(t('CENTER_SESSION.WEEKDAY_ERROR'));
      // }
      if (!eventBody?.startDatetime || !eventBody?.endDatetime) {
        const message =
          boxType === 'EXTRA_SESSION'
            ? t('CENTER_SESSION.EXTRA_SESSION_DATE_TIME_REQUIRED_ERROR')
            : t('CENTER_SESSION.PLANNED_SESSION_DATE_TIME_REQUIRED_ERROR');
        return showError(message);
      }

      if (
        eventBody.startDatetime === '' ||
        eventBody.startDatetime === t('CENTER_SESSION.INVALID_DATE')
      ) {
        const message =
          boxType === 'EXTRA_SESSION'
            ? t('CENTER_SESSION.EXTRA_SESSION_VALID_DATE_TIME_REQUIRED_ERROR')
            : t(
                'CENTER_SESSION.PLANNED_SESSION_START_DATE_TIME_REQUIRED_ERROR'
              );
        return showError(message);
      }

      if (
        eventBody.endDatetime === '' ||
        eventBody.endDatetime === t('CENTER_SESSION.INVALID_DATE')
      ) {
        const message =
          boxType === 'EXTRA_SESSION'
            ? t('CENTER_SESSION.EXTRA_SESSION_END_DATE_TIME_REQUIRED_ERROR')
            : t('CENTER_SESSION.PLANNED_SESSION_END_DATE_TIME_REQUIRED_ERROR');
        return showError(message);
      }

      return true;
    }

    return showError(t('CENTER_SESSION.INVALID_EVENT_CONFIGURATION'));
  };

  useEffect(() => {
    scheduleNewEvent();
  }, [scheduleEvent, cohortId]);

  const handleEditSession = (event: any) => {
    setEditSelection(event.target.value);
  };

  const handelDeleteEvent = async (eventData: any, deleteSelection: string) => {
    try {
      const isMainEvent =
        !eventData?.isRecurring ||
        deleteSelection !== t('CENTER_SESSION.EDIT_THIS_SESSION');

      const eventRepetitionId = eventData?.eventRepetitionId;
      const userId =
        typeof window !== 'undefined'
          ? localStorage.getItem('userId') || ''
          : '';
      const apiBody = {
        isMainEvent: isMainEvent,
        status: 'archived',
        updatedBy: userId,
      };
      const response = await editEvent(eventRepetitionId, apiBody);
      if (response?.responseCode === 'OK') {
        showToastMessage(
          t('CENTER_SESSION.SESSION_DELETED_SUCCESSFULLY'),
          'success'
        );
      } else {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      }
      if (onEventDeleted) {
        onEventDeleted();
      }
    } catch (error) {
      console.error('Error in deleting event:', error);
    }
  };

  useEffect(() => {
    const onUpdateEvent = async () => {
      if (updateEvent && eventData) {
        try {
          const userId =
            typeof window !== 'undefined'
              ? localStorage.getItem('userId') || ''
              : '';
          let isMainEvent;
          if (eventData?.isRecurring === false) {
            isMainEvent = true;
          }
          if (eventData?.isRecurring === true) {
            if (editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION')) {
              isMainEvent = false;
            } else {
              isMainEvent = true;
            }
          }
          const eventRepetitionId = eventData?.eventRepetitionId;
          const apiBody: any = {
            isMainEvent: isMainEvent,
            status: 'live',
            updatedBy: userId,
          };

          if (editSelection === t('CENTER_SESSION.EDIT_FOLLOWING_SESSIONS')) {
            const DaysOfWeek =
              sessionBlocks?.[0]?.DaysOfWeek ||
              eventData?.recurrencePattern?.daysOfWeek;
            const RecurringEndDate = sessionBlocks?.[0]?.endDateValue;
            const RecurringstartDate =
              sessionBlocks?.[0]?.recurringStartDate ??
              sessionBlocks?.[0]?.startDatetime;
            const endDateTime = sessionBlocks?.[0]?.endDatetime;
            apiBody['endDatetime'] = sessionBlocks?.[0]?.endDatetime;
            const datePart = sessionBlocks?.[0]?.endDateValue?.split('T')[0];
            const timePart = sessionBlocks?.[0]?.startDatetime?.split('T')[1];
            const startDateValue = `${datePart}T${timePart}`;
            apiBody['startDatetime'] = sessionBlocks?.[0]?.startDatetime;
            apiBody['recurrencePattern'] = {
              interval: 1,
              frequency: 'weekly',
              daysOfWeek: DaysOfWeek,
              endCondition: {
                type: 'endDate',
                value: RecurringEndDate,
              },
              recurringStartDate: RecurringstartDate,
            };
          } else if (editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION')) {
            const startDateTime = sessionBlocks?.[0]?.startDatetime;

            if (startDateTime && eventData?.startDateTime) {
              const startDateTimeDate = new Date(startDateTime);
              const eventDateTimeDate = new Date(eventData.startDateTime);

              if (startDateTimeDate.getTime() !== eventDateTimeDate.getTime()) {
                apiBody['startDatetime'] = startDateTime;
              }
            }

            const endDateTime = sessionBlocks?.[0]?.endDatetime;
            if (endDateTime && eventData?.endDateTime) {
              const endDateTimeDate = new Date(endDateTime);
              const eventDateTimeDate = new Date(eventData.endDateTime);

              if (endDateTimeDate.getTime() !== eventDateTimeDate.getTime()) {
                apiBody['endDatetime'] = endDateTime;
              }
            }
          }

          const metadata = {
            category: eventData?.title || '',
            courseType: eventData?.metadata?.courseType || '',
            subject: eventData?.metadata?.subject || '',
            teacherName: eventData?.metadata?.teacherName || '',
            cohortId: eventData?.metadata?.cohortId || '',
            cycleId: eventData?.metadata?.cycleId || '',
            tenantId: eventData?.metadata?.tenantId || '',
            type: eventData?.metadata?.type || '',
          };

          const sessionSubject = sessionBlocks?.[0]?.subject || '';

          if (
            (sessionSubject &&
              eventData?.metadata?.subject !== sessionSubject) ||
            (selectedCourseType &&
              eventData?.metadata?.courseType !== selectedCourseType)
          ) {
            metadata.subject = sessionSubject;
            metadata.courseType = selectedCourseType;
            apiBody['metadata'] = metadata;
            const erMetaData = {
              topic: null,
              subTopic: [],
            };
            apiBody['erMetaData'] = erMetaData;
          }

          const sessionTitle = sessionBlocks?.[0]?.subjectTitle;
          if (
            eventData?.shortDescription !== sessionTitle &&
            sessionTitle !== ''
          ) {
            apiBody['shortDescription'] = sessionTitle;
          }
          if (sessionBlocks?.[0]?.sessionMode === 'online') {
            const meetingDetails = {
              id: eventData?.meetingDetails?.id || '',
              onlineProvider:
                eventData?.meetingDetails?.onlineProvider || 'zoom',
              password: eventData?.meetingDetails?.password || '',
              providerGenerated:
                eventData?.meetingDetails?.providerGenerated || false,
              url: eventData?.meetingDetails?.url || '',
            };

            const meetingUrl = sessionBlocks?.[0]?.meetingLink;
            if (
              eventData?.meetingDetails?.url !== meetingUrl &&
              meetingUrl !== ''
            ) {
              meetingDetails.url = meetingUrl;
              apiBody['meetingDetails'] = meetingDetails;
            }

            const meetingPassword = sessionBlocks?.[0]?.meetingPasscode;
            if (
              eventData?.meetingDetails?.password !== meetingPassword &&
              meetingPasscode !== ''
            ) {
              meetingDetails.password = meetingPassword;
              apiBody['meetingDetails'] = meetingDetails;
            }
          }
          if (sessionBlocks?.[0]?.sessionMode === 'offline') {
            apiBody['meetingDetails'] = null;
          }

          const response = await editEvent(eventRepetitionId, apiBody);
          if (response?.responseCode === 'OK') {
            showToastMessage(
              t('CENTER_SESSION.SESSION_EDITED_SUCCESSFULLY'),
              'success'
            );
          } else {
            if (response?.response?.data?.params?.errmsg) {
              const errMsg = response?.response?.data?.params?.errmsg;
              let errorMessage;
              if (typeof errMsg === 'string') {
                console.log(errMsg);
                errorMessage = errMsg;
              } else {
                errorMessage = errMsg[0] + ' and ' + errMsg[1];
              }
              showToastMessage(errorMessage, 'error');
            } else {
              showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            }
          }
          if (onEventUpdated) {
            onEventUpdated();
          }
        } catch (error) {
          console.error('Error in editing event:', error);
        }
      }
    };
    onUpdateEvent();
  }, [updateEvent]);

  return (
    <Box overflow={'hidden'}>
      {sessionBlocks.map((block, index) => (
        <Box key={block.id} sx={{ padding: '10px 16px' }}>
          {editSession && editSession?.isRecurring && (
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-labelledby="session-mode-label"
                name="session-mode-group"
                value={editSelection}
                onChange={handleEditSession}
              >
                <FormControlLabel
                  value={t('CENTER_SESSION.EDIT_THIS_SESSION')}
                  onClick={() =>
                    handleEditSelection(
                      t('CENTER_SESSION.EDIT_THIS_SESSION'),
                      editSession
                    )
                  }
                  label={
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: theme.palette.warning['A200'],
                      }}
                    >
                      {t('CENTER_SESSION.EDIT_THIS_SESSION')}
                    </span>
                  }
                  control={
                    <Radio style={{ color: theme.palette.warning['300'] }} />
                  }
                  labelPlacement="start"
                  sx={{
                    display: 'flex',
                    marginLeft: '0px',
                    marginRight: '0px',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                />

                <FormControlLabel
                  value={t('CENTER_SESSION.EDIT_FOLLOWING_SESSIONS')}
                  onClick={() =>
                    handleEditSelection(
                      t('CENTER_SESSION.EDIT_FOLLOWING_SESSIONS'),
                      editSession
                    )
                  }
                  control={
                    <Radio style={{ color: theme.palette.warning['300'] }} />
                  }
                  label={
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '400',
                        color: theme.palette.warning['A200'],
                      }}
                    >
                      {t('CENTER_SESSION.EDIT_FOLLOWING_SESSIONS')}
                    </span>
                  }
                  labelPlacement="start"
                  sx={{
                    display: 'flex',
                    marginLeft: '0px',
                    marginRight: '0px',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                />
              </RadioGroup>
            </FormControl>
          )}

          <Box>
            {(!medium || !grade || !board) && (
              <Box
                padding="0.5rem"
                style={{
                  backgroundColor: theme?.palette?.primary['light'],
                }}
              >
                <Typography variant="h2" component="h2">
                  {t('CENTER_SESSION.BOARD_MEDIUM_GRADE_NOT_ASSIGNED')}
                </Typography>
              </Box>
            )}
            <SessionMode
              mode={editSession ? (mode ?? '') : (block?.sessionMode ?? '')}
              handleSessionModeChange={(e) =>
                handleSessionModeChange(e, block?.id)
              }
              sessions={{
                tile: t('CENTER_SESSION.MODE_OF_SESSION'),
                mode1: t('CENTER_SESSION.ONLINE'),
                mode2: t('CENTER_SESSION.OFFLINE'),
              }}
              cohortType={cohortType}
              disabled={editSession}
            />
          </Box>
          {(medium || grade || board) && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel
                  style={{ color: theme?.palette?.warning['A200'] }}
                  id="demo-simple-select-label"
                >
                  {t('CENTER_SESSION.COURSE_TYPE')}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label={t('CENTER_SESSION.COURSE_TYPE')}
                  style={{ borderRadius: '4px' }}
                  onChange={(event: any) =>
                    handleCourseTypeChange(block?.id, event)
                  }
                  value={
                    block?.courseType === selectedCourseType
                      ? block?.courseType
                      : editSession?.metadata?.courseType
                  }
                  disabled={!medium || !grade || !board}
                >
                  {courseTypes?.map((courseType: string) => (
                    <MenuItem key={courseType} value={courseType}>
                      {courseType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {(clickedBox === 'PLANNED_SESSION' || editSession) && (
            <>
              {(medium || grade || board) && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel
                      style={{ color: theme?.palette?.warning['A200'] }}
                      id="demo-simple-select-label"
                    >
                      {t('CENTER_SESSION.SUBJECT')}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t('CENTER_SESSION.SUBJECT')}
                      style={{ borderRadius: '4px' }}
                      onChange={(event: any) =>
                        handleSubjectChange(block?.id, event)
                      }
                      value={
                        block?.subject === selectedSubject
                          ? block?.subject
                          : editSession?.metadata?.subject ||
                            editSession?.subject
                      }
                      disabled={!(medium && grade && board)}
                    >
                      {(block?.subjectDropdown &&
                      block.subjectDropdown.length > 0
                        ? block.subjectDropdown
                        : subjectLists
                      )?.map((subject: string) => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                      {/* <MenuItem key="other" value="other">
                      {t('FORM.OTHER')}
                    </MenuItem> */}
                    </Select>
                  </FormControl>
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.SESSION_TITLE_OPTIONAL')}
                  variant="outlined"
                  value={block?.subjectTitle ?? shortDescription}
                  onChange={(e) => {
                    handleSubjectTitleChange(e, block?.id);
                  }}
                />
              </Box>
            </>
          )}

          {block?.sessionMode === sessionMode.ONLINE &&
            mode === sessionMode.ONLINE && (
              <>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    id="outlined-basic"
                    value={block?.meetingLink ?? link}
                    label={t('CENTER_SESSION.MEETING_LINK')}
                    variant="outlined"
                    error={!!linkError}
                    helperText={linkTouched && linkError ? linkError : ''}
                    onChange={(e) =>
                      handleLinkChange(
                        e as React.ChangeEvent<HTMLInputElement>,
                        block?.id
                      )
                    }
                    onBlur={handleLinkBlur}
                    required
                  />
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    id="outlined-basic"
                    label={t('CENTER_SESSION.MEETING_PASSCODE')}
                    variant="outlined"
                    onChange={(e: any) => handlePasscodeChange(block?.id, e)}
                    value={meetingPasscode ? meetingPasscode : null}
                  />
                </Box>
              </>
            )}
          {clickedBox === 'EXTRA_SESSION' && (
            <Box sx={{ mt: 2 }}>
              {(medium || grade || board) && (
                <Box>
                  <FormControl fullWidth>
                    <InputLabel
                      style={{
                        color: theme?.palette?.warning['A200'],
                        background: theme?.palette?.warning['A400'],
                        paddingLeft: '2px',
                        paddingRight: '2px',
                      }}
                      id="demo-simple-select-label"
                    >
                      {t('CENTER_SESSION.SUBJECT_OPTIONAL')}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t('CENTER_SESSION.SUBJECT_OPTIONAL')}
                      style={{ borderRadius: '4px' }}
                      onChange={(event: any) =>
                        handleSubjectChange(block?.id, event)
                      }
                      value={
                        block?.subject || editSession?.metadata?.subject || ''
                      }
                      disabled={!(medium && grade && board)}
                    >
                      {(block?.subjectDropdown &&
                      block.subjectDropdown.length > 0
                        ? block.subjectDropdown
                        : subjectLists
                      )?.map((subject: string) => (
                        <MenuItem key={subject} value={subject}>
                          {subject}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.SESSION_TITLE')}
                  variant="outlined"
                  value={block?.subjectTitle}
                  onChange={(e) => {
                    handleSubjectTitleChange(e, block?.id);
                  }}
                />
              </Box>
            </Box>
          )}

          {(clickedBox === 'EXTRA_SESSION' ||
            (editSession &&
              editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION'))) && (
            <>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mt: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <MobileDatePicker
                        label="Date"
                        value={
                          editSession
                            ? startDates[index]
                            : block?.sessionStartDate
                        }
                        onChange={(newValue) => {
                          handleChange(index, newValue, 'start', 'date');
                        }}
                        format="DD MMM, YYYY"
                        sx={{ borderRadius: '4px' }}
                      />
                    </Stack>
                  </LocalizationProvider>
                  {dateError && (
                    <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                      {dateError}
                    </Box>
                  )}
                  <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                    <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                      <Box sx={{ mt: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopTimePicker
                            label={t('CENTER_SESSION.START_TIME')}
                            value={
                              editSession
                                ? startTimes[index]
                                : block?.sessionStartTime
                            }
                            onChange={(newValue) =>
                              handleChange(index, newValue, 'start', 'time')
                            }
                            sx={{ borderRadius: '4px', fontSize: '2px' }}
                            slotProps={{
                              textField: { placeholder: 'HH:MM AM/PM' },
                            }}
                          />
                        </LocalizationProvider>
                        {startTimeError && (
                          <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                            {startTimeError}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                      <Box sx={{ mt: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopTimePicker
                            label={t('CENTER_SESSION.END_TIME')}
                            value={
                              editSession
                                ? endTimes[index]
                                : block?.sessionEndTime
                            }
                            onChange={(newValue) =>
                              handleChange(index, newValue, 'end', 'time')
                            }
                            sx={{ borderRadius: '4px' }}
                            slotProps={{
                              textField: { placeholder: 'HH:MM AM/PM' },
                            }}
                          />
                        </LocalizationProvider>
                        {endTimeError && (
                          <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                            {endTimeError}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </>
          )}

          {(clickedBox === 'PLANNED_SESSION' ||
            (editSession &&
              editSelection ===
                t('CENTER_SESSION.EDIT_FOLLOWING_SESSIONS'))) && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ overflow: 'none' }}>
                <Typography variant="h2" component="h2">
                  {t('COMMON.HELD_EVERY_WEEK_ON', {
                    // days:
                    //   block?.selectedWeekDays?.join(', ') ||
                    //   editSession?.recurrencePattern?.daysOfWeek,
                    days:
                      block?.selectedWeekDays?.join(', ') ??
                      (editSession?.recurrencePattern?.daysOfWeek)
                        .map(
                          (dayIndex: any) =>
                            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
                              dayIndex
                            ]
                        )
                        .join(', '),
                  })}
                </Typography>

                <WeekDays
                  // useAbbreviation={true}
                  multiselect={true}
                  selectedDays={
                    selectedDays?.length
                      ? editSession?.recurrencePattern?.daysOfWeek
                      : block?.selectedWeekDays
                  }
                  onSelectionChange={(newSelectedDays) => {
                    handleSelectionChange(block?.id, newSelectedDays);
                  }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid
                  sx={{ paddingTop: '0px !important', marginTop: '15px' }}
                  item
                  xs={6}
                >
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopTimePicker
                        label={t('CENTER_SESSION.START_TIME')}
                        value={
                          editSession
                            ? startTimes[index]
                            : block?.sessionStartTime
                        }
                        onChange={(newValue) =>
                          handleChange(index, newValue, 'start', 'time')
                        }
                        sx={{ borderRadius: '4px', fontSize: '2px' }}
                        slotProps={{
                          textField: { placeholder: 'HH:MM AM/PM' },
                        }}
                      />
                    </LocalizationProvider>
                    {startTimeError && (
                      <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                        {startTimeError}
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid
                  sx={{ paddingTop: '0px !important', marginTop: '15px' }}
                  item
                  xs={6}
                >
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopTimePicker
                        label={t('CENTER_SESSION.END_TIME')}
                        value={
                          editSession ? endTimes[index] : block?.sessionEndTime
                        }
                        onChange={(newValue) =>
                          handleChange(index, newValue, 'end', 'time')
                        }
                        sx={{ borderRadius: '4px' }}
                        slotProps={{
                          textField: { placeholder: 'HH:MM AM/PM' },
                        }}
                      />
                    </LocalizationProvider>
                    {endTimeError && (
                      <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                        {endTimeError}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid
                  sx={{ paddingTop: '0px !important', marginTop: '10px' }}
                  item
                  xs={6}
                >
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label={t('CENTER_SESSION.START_DATE')}
                          value={
                            editSession
                              ? startDates[index]
                              : block?.sessionStartDate
                          }
                          onChange={(newValue) =>
                            handleChange(index, newValue, 'start', 'date')
                          }
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                          disabled={
                            eventData
                              ? dayjs(startDates[index]).isBefore(
                                  dayjs(),
                                  'day'
                                )
                              : false
                          }
                        />
                      </Stack>
                    </LocalizationProvider>
                    {startDateError && (
                      <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                        {startDateError}
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid
                  sx={{ paddingTop: '0px !important', marginTop: '10px' }}
                  item
                  xs={6}
                >
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label={t('CENTER_SESSION.END_DATE')}
                          value={
                            editSession
                              ? endDates[index]
                              : block?.sessionEndDate
                          }
                          onChange={(newValue) =>
                            handleChange(index, newValue, 'end', 'date')
                          }
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                        />
                      </Stack>
                    </LocalizationProvider>
                    {endDateError && (
                      <Box sx={{ color: 'red', fontSize: '12px', mt: 1 }}>
                        {endDateError}
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {editSession && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '5px',
                  mt: 3,
                  mb: 2,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    fontSize: '14px',
                    color: theme?.palette?.secondary.main,
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenModel}
                >
                  {editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION')
                    ? t('CENTER_SESSION.DELETE_THIS_SESSION')
                    : t('CENTER_SESSION.DELETE_FOLLOWING_SESSION')}
                </Box>
                <DeleteOutlineIcon
                  sx={{ fontSize: '18px', color: theme?.palette?.error.main }}
                />
              </Box>
            </Box>
          )}

          {sessionBlocks.length > 1 && (
            <Box
              sx={{
                display: 'flex',
                gap: '5px',
                mt: 2,
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  fontSize: '14px',
                  color: theme?.palette?.secondary.main,
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
                onClick={() => handleRemoveSession(block.id)}
              >
                {t('CENTER_SESSION.REMOVE_THIS_SESSION')}
              </Box>
              <DeleteOutlineIcon
                sx={{ fontSize: '18px', color: theme?.palette?.error.main }}
              />
            </Box>
          )}

          {!editSession && (
            <>
              <Box sx={{ mt: 2 }}>
                <Divider />
              </Box>
              <Divider />
              <Box mt={2.5} mb={2}>
                <Button
                  sx={{
                    border: `1px solid ${theme.palette.error.contrastText}`,
                    borderRadius: '100px',
                    height: '40px',
                    width: '163px',
                    color: theme.palette.error.contrastText,
                  }}
                  className="text-1E"
                  endIcon={<AddIcon />}
                  onClick={handleAddSession}
                >
                  {t('CENTER_SESSION.ADD_SESSION')}
                </Button>
              </Box>
            </>
          )}
        </Box>
      ))}
      {editSession && (
        <ConfirmationModal
          message={
            editSelection === t('CENTER_SESSION.EDIT_THIS_SESSION')
              ? t('CENTER_SESSION.DELETE_SESSION_MSG')
              : t('CENTER_SESSION.DELETE_ALL_SESSION_MSG')
          }
          buttonNames={{
            primary: t('COMMON.YES'),
            secondary: t('COMMON.NO_GO_BACK'),
          }}
          handleCloseModal={handleCloseModal}
          handleAction={() => handelDeleteEvent(editSession, editSelection)}
          modalOpen={modalOpen}
        />
      )}
    </Box>
  );
};

export default PlannedSession;
