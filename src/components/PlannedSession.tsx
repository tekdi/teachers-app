import * as React from 'react';

import { getFormRead } from '@/services/CreateUserService';
import { createEvent, editEvent } from '@/services/EventService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { CreateEvent, PlannedModalProps } from '@/utils/Interfaces';
import {
  FormContext,
  FormContextType,
  Role,
  Status,
  sessionMode,
  sessionType,
} from '@/utils/app.constant';
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import ReactGA from 'react-ga4';
import {
  DaysOfWeek,
  eventDaysLimit,
  idealTimeForSession,
} from '../../app.config';
import SessionMode from './SessionMode';
import { showToastMessage } from './Toastify';
import WeekDays from './WeekDays';
import ConfirmationModal from './ConfirmationModal';

type mode = (typeof sessionMode)[keyof typeof sessionMode];
type type = (typeof sessionType)[keyof typeof sessionType];

interface Session {
  id?: number | string;
  sessionMode?: string;
  sessionType?: string;
  selectedWeekDays?: string[];
  DaysOfWeek?: number[];
  startDatetime?: string;
  endDatetime?: string;
  endDateValue?: string;
  subject?: string;
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
  cohortId,
  onCloseModal,
  editSession,
  onEventDeleted,
}) => {
  const [mode, setMode] = useState<mode>(sessionMode.OFFLINE);
  const [eventType, setEventType] = useState<type>(sessionType.REPEATING);
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>();
  const [selectedBlockId, setSelectedBlockId] = useState(0);
  const [editSelection, setEditSelection] = React.useState('EDIT_SESSION');
  const [subjects, setSubjects] = useState<string[]>();
  dayjs.extend(utc);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  const [sessionBlocks, setSessionBlocks] = useState<Session[]>([
    {
      id: 0,
      selectedWeekDays: [],
      DaysOfWeek: [],
      sessionMode: mode,
      sessionType: eventType,
      startDatetime: '',
      endDatetime: '',
      endDateValue: '',
      subject: '',
      subjectTitle: '',
      isRecurring: false,
      meetingLink: '',
      meetingPasscode: '',
      onlineProvider: '',
      sessionStartDate: startDate,
      sessionEndDate: endDate,
      sessionStartTime: startTime,
      sessionEndTime: endTime,
    },
  ]);
  const handleOpenModel = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEditSelection = (selection: string, eventData: any) => {
    setEditSelection(selection);
    console.log(eventData);
  };

  useEffect(() => {
    const initialStartDateTime = combineDateAndTime(startDate, startTime);
    const initialEndDateTime = combineDateAndTime(startDate, endTime);
    const sessionEndDate = combineDateAndTime(endDate, endTime);

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
              sessionStartDate: startDate,
              sessionEndDate: endDate,
              sessionStartTime: startTime,
              sessionEndTime: endTime,
            }
          : block
      )
    );
  }, [startDate, startTime, endDate, endTime, selectedBlockId]);

  const handleSessionModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string | number | undefined
  ) => {
    const updatedSessionBlocks = sessionBlocks.map((block) =>
      block.id === id
        ? { ...block, sessionMode: event.target.value.toLowerCase() }
        : block
    );
    setSessionBlocks(updatedSessionBlocks);
  };

  const handleSessionTypeChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string | number | undefined
  ) => {
    setEventType(event.target.value as type);
    const updatedSessionBlocks = sessionBlocks.map((block) =>
      block.id === id ? { ...block, sessionType: event.target.value } : block
    );
    setSessionBlocks(updatedSessionBlocks);
  };

  useEffect(() => {
    const getAddFacilitatorFormData = async () => {
      try {
        const response = await getFormRead(
          FormContext.USERS,
          FormContextType.TEACHER
        );

        console.log('sortedFields', response);
        if (response) {
          const subjectTeach = response?.fields
            .filter((field: any) => field?.label === 'SUBJECTS_I_TEACH')
            .flatMap((field: any) =>
              field?.options?.map((option: any) => t(`FORM.${option?.label}`))
            );

          const mainSubjects = response?.fields
            .filter((field: any) => field?.label === 'MY_MAIN_SUBJECTS')
            .flatMap((field: any) =>
              field?.options?.map((option: any) => t(`FORM.${option?.label}`))
            );

          const combinedSubjects = Array.from(
            new Set([...subjectTeach, ...mainSubjects])
          );

          setSubjects(combinedSubjects);

          console.log(combinedSubjects);
        }

        let centerOptionsList;
        if (typeof window !== 'undefined' && window.localStorage) {
          const CenterList = localStorage.getItem('CenterList');
          const centerOptions = CenterList ? JSON.parse(CenterList) : [];
          centerOptionsList = centerOptions.map(
            (center: { cohortId: string; cohortName: string }) => ({
              value: center.cohortId,
              label: center.cohortName,
            })
          );
          console.log(centerOptionsList);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    getAddFacilitatorFormData();
  }, []);

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

  const combineDateAndTime = (
    date: Dayjs | null,
    time: Dayjs | null
  ): Dayjs | null => {
    if (date && time) {
      return date.hour(time.hour()).minute(time.minute()).second(time.second());
    }
    return null;
  };

  const convertToUTC = (dateTime: Dayjs | null): string | null => {
    return dateTime ? dateTime.utc().format('YYYY-MM-DDTHH:mm:ss[Z]') : null;
  };

  const handleChange = (
    id: string | number | undefined,
    newValue: Dayjs | null,
    type: 'start' | 'end',
    field: 'date' | 'time'
  ) => {
    if (newValue) {
      if (type === 'start' && field === 'date') {
        setStartDate((prev) => {
          const combinedStartDateTime = combineDateAndTime(newValue, startTime);
          updateSessionBlock(id, combinedStartDateTime, endDate, endTime, type);
          return newValue;
        });
      } else if (type === 'start' && field === 'time') {
        setStartTime((prev) => {
          const combinedStartDateTime = combineDateAndTime(startDate, newValue);
          updateSessionBlock(id, combinedStartDateTime, endDate, endTime, type);
          return newValue;
        });
      } else if (type === 'end' && field === 'date') {
        setEndDate((prev) => {
          const combinedEndDateTime = combineDateAndTime(newValue, endTime);
          updateSessionBlock(id, startDate, combinedEndDateTime, endTime, type);
          return newValue;
        });
      } else if (type === 'end' && field === 'time') {
        setEndTime((prev) => {
          const combinedEndDateTime = combineDateAndTime(startDate, newValue);
          updateSessionBlock(id, startDate, combinedEndDateTime, endTime, type);
          return newValue;
        });
      }
    }
  };

  const updateSessionBlock = (
    id: string | number | undefined,
    combinedStartDateTime: Dayjs | null,
    combinedEndDateTime: Dayjs | null,
    combinedEndDateValue: Dayjs | null,
    type: 'start' | 'end'
  ) => {
    // const EndDateTime = combineDateAndTime(startDate, endTime);
    const startDatetime = convertToUTC(combinedStartDateTime);
    const endDatetime = convertToUTC(combinedEndDateTime);
    const endDateValue =
      eventType && eventType === t('CENTER_SESSION.JUST_ONCE')
        ? endDatetime
        : convertToUTC(combinedEndDateValue);

    if (startDatetime && endDatetime && endDateValue) {
      let isRecurringEvent = endDatetime !== endDateValue ? true : false;
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === id
            ? {
                ...block,
                startDatetime: startDatetime,
                endDatetime: endDatetime,
                endDateValue: endDateValue,
                isRecurring: isRecurringEvent,
                sessionStartDate: startDate,
                sessionEndDate: endDate,
                sessionStartTime: startTime,
                sessionEndTime: endTime,
              }
            : block
        )
      );
    }
  };

  useEffect(() => {
    const combinedStartDateTime = combineDateAndTime(startDate, startTime);
    const combinedEndDateTime = combineDateAndTime(startDate, endTime);
    const combinedEndDateValue = combineDateAndTime(endDate, endTime);

    const startDatetime = convertToUTC(combinedStartDateTime);
    const endDatetime = convertToUTC(combinedEndDateTime);
    const endDateValue =
      eventType && eventType === t('CENTER_SESSION.JUST_ONCE')
        ? endDatetime
        : convertToUTC(combinedEndDateValue);

    if (startDatetime && endDatetime && endDateValue) {
      let isRecurringEvent = endDatetime !== endDateValue ? true : false;
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === selectedBlockId
            ? {
                ...block,
                startDatetime: startDatetime,
                endDatetime: endDatetime,
                endDateValue: endDateValue,
                isRecurring: isRecurringEvent,
                sessionStartDate: startDate,
                sessionEndDate: endDate,
                sessionStartTime: startTime,
                sessionEndTime: endTime,
              }
            : block
        )
      );
    }
  }, [startDate, endDate, startTime, endTime, selectedBlockId]);

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

    const zoomLinkPattern = /^(https?:\/\/)?(www\.)?zoom\.us\/j\/\d+$/;
    const googleMeetLinkPattern =
      /^(https?:\/\/)?(meet\.google\.com\/[a-zA-Z0-9-]+)$/;

    let onlineProvider: string;
    if (zoomLinkPattern.test(value)) {
      setLinkError('');
      onlineProvider = t('CENTER_SESSION.ZOOM');
    } else if (googleMeetLinkPattern.test(value)) {
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

  const handlePasscodeChange = (
    event: any,
    id: string | number | undefined
  ) => {
    const value = event?.target?.value;

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

  const { t } = useTranslation();
  const theme = useTheme<any>();

  const handleSelectionChange = (
    id: string | number | undefined,
    newSelectedDays: string[]
  ) => {
    const mappedSelectedDays = newSelectedDays?.map(
      (day) => DaysOfWeek[day as keyof typeof DaysOfWeek]
    );

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

  const handleAddSession = () => {
    const newSessionId = sessionBlocks.length;

    setSessionBlocks([
      ...sessionBlocks,
      {
        id: newSessionId,
        selectedWeekDays: [],
        DaysOfWeek: [],
        sessionMode: '',
        sessionType: '',
        startDatetime: '',
        endDatetime: '',
        subject: '',
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
    console.log(sessionBlocks);
  };

  const handleRemoveSession = (id: any) => {
    setSessionBlocks(sessionBlocks.filter((block) => block?.id !== id));
  };

  console.log(sessionBlocks);

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
          eventType === t('CENTER_SESSION.JUST') &&
          mode === t('CENTER_SESSION.ONLINE')
            ? t('CENTER_SESSION.NON_RECURRING_ONLINE')
            : eventType === t('CENTER_SESSION.REAPEATING') &&
                mode === t('CENTER_SESSION.ONLINE')
              ? t('CENTER_SESSION.ONLINE')
              : eventType === t('CENTER_SESSION.JUST') &&
                  mode === t('CENTER_SESSION.OFFLINE')
                ? t('CENTER_SESSION.NON_RECURRING_OFFLINE')
                : t('CENTER_SESSION.RECURRING_ONLINE');
      }

      // Create API bodies
      const apiBodies: CreateEvent[] = sessionBlocks.map((block) => {
        const baseBody: CreateEvent = {
          title,
          shortDescription: '',
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
            framework: {
              board: '',
              medium: '',
              grade: '',
              subject: block?.subject || '',
              topic: '',
              subTopic: '',
              teacherName: userName,
            },
            eventType: clickedBox || '',
            doId: '',
            cohortId: cohortId || '',
            cycleId: '',
            tenant: '',
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
          };
        }

        // Add meetingDetails only if sessionMode is 'online'
        if (block?.sessionMode === t('CENTER_SESSION.ONLINE')) {
          (baseBody.onlineProvider = block?.onlineProvider || ''),
            (baseBody.isMeetingNew = false),
            (baseBody.meetingDetails = {
              url: block?.meetingLink || '',
              password: block?.meetingPasscode || '7674534',
              id: '123-456-789',
            });
        }

        return baseBody;
      });

      await Promise.all(
        apiBodies.map(async (apiBody) => {
          try {
            const response = await createEvent(apiBody);
            console.log(response);
            if (response?.responseCode === 'Created') {
              showToastMessage(
                t('COMMON.SESSION_SCHEDULED_SUCCESSFULLY'),
                'success'
              );
              ReactGA.event('event-created-successfully', {
                creatorId: userId,
              });
              if (onCloseModal) {
                onCloseModal();
              }
            } else {
              showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            }
          } catch (error) {
            console.error('Error creating event:', error);
            if (onCloseModal) {
              onCloseModal();
            }
          }
        })
      );
    } catch (error) {
      console.error('Error scheduling new event:', error);
      ReactGA.event('event-creation-fail', {
        error: error,
      });
    }
  };

  useEffect(() => {
    scheduleNewEvent();
  }, [scheduleEvent, cohortId]);

  const handleEditSession = (event: any) => {
    setMode(event.target.value);
  };

  const handelDeleteEvent = async (eventData: any, deleteSelection: string) => {
    try {
      const isMainEvent =
        !eventData?.isRecurring || deleteSelection !== 'EDIT_SESSION';

      const eventRepetitionId = eventData?.eventRepetitionId;

      const apiBody = {
        isMainEvent: isMainEvent,
        status: 'archived',
      };
      const response = await editEvent(eventRepetitionId, apiBody);
      if (response?.responseCode === 'OK') {
        showToastMessage(t('COMMON.SESSION_DELETED_SUCCESSFULLY'), 'success');
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
                value={mode}
                onChange={handleEditSession}
              >
                <FormControlLabel
                  value={t('CENTER_SESSION.EDIT_THIS_SESSION')}
                  onClick={() =>
                    handleEditSelection?.('EDIT_SESSION', editSession)
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
                    handleEditSelection?.('FOLLOWING_SESSION', editSession)
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
            <SessionMode
              mode={block?.sessionMode || mode}
              handleSessionModeChange={(e) =>
                handleSessionModeChange(e, block?.id)
              }
              sessions={{
                tile: t('CENTER_SESSION.MODE_OF_SESSION'),
                mode1: t('CENTER_SESSION.ONLINE'),
                mode2: t('CENTER_SESSION.OFFLINE'),
              }}
            />
          </Box>
          {clickedBox === 'PLANNED_SESSION' && (
            <>
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
                    onChange={(event: any) => handleSubjectChange(block?.id, event)}
                    value={selectedSubject}
                  >
                    {subjects?.map((subject: string) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                    <MenuItem key="other" value="other">
                    {t('FORM.OTHER')}
                    </MenuItem>
                  </Select>

                </FormControl>
              </Box>

              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.SESSION_TITLE_OPTIONAL')}
                  variant="outlined"
                  value={block?.subjectTitle}
                  onChange={(e) => {
                    handleSubjectTitleChange(e, block?.id);
                  }}
                />
              </Box>

            </>
          )}

          {block?.sessionMode === sessionMode.ONLINE && (
            <>


              {/* <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['300'],
                  mt: 1.5,
                }}
              >
                {t('CENTER_SESSION.SET_UP')}
              </Box> */}


              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  value={link}
                  label={t('CENTER_SESSION.MEETING_LINK')}
                  variant="outlined"
                  error={!!linkError}
                  helperText={linkError}
                  onChange={(e) =>
                    handleLinkChange(
                      e as React.ChangeEvent<HTMLInputElement>,
                      block?.id
                    )
                  }
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.MEETING_PASSCODE')}
                  variant="outlined"
                  onChange={(e: any) => handlePasscodeChange(block?.id, e)}
                />
              </Box>
            </>
          )}
          {clickedBox === 'EXTRA_SESSION' && (
            <Box sx={{ mt: 2 }}>
              {/* <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['300'],
                }}
              >
                {t('CENTER_SESSION.SESSION_DETAILS')}
              </Box> */}
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
                    value={selectedSubject}
                  >
                    {subjects?.map((subject: string) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
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

          {clickedBox === 'EXTRA_SESSION' && (
            <>
              <Box sx={{ mt: 2 }}>
                {/* <SessionMode
                  mode={block?.sessionType || eventType}
                  handleSessionModeChange={(e) =>
                    handleSessionTypeChange(e, block?.id)
                  }
                  sessions={{
                    tile: t('CENTER_SESSION.TYPE_OF_SESSION'),
                    mode1: t('CENTER_SESSION.REPEATING'),
                    mode2: t('CENTER_SESSION.JUST_ONCE'),
                  }}
                /> */}
                {/* {block?.sessionType === sessionType.JUST && (
                   )} */}
                <Box sx={{ mt: 3 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={3}>
                      <MobileDatePicker
                        label="Date"
                        value={block?.sessionStartDate || startDate}
                        onChange={(newValue) =>
                          handleChange(block?.id, newValue, 'start', 'date')
                        }
                        format="DD MMM, YYYY"
                        sx={{ borderRadius: '4px' }}
                      />
                    </Stack>
                  </LocalizationProvider>

                  <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                    <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                      <Box sx={{ mt: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <CustomTimePicker
                            label={t('CENTER_SESSION.START_TIME')}
                            value={block?.sessionStartTime || startTime}
                            onChange={(newValue) =>
                              handleChange(
                                block?.id,
                                newValue,
                                'start',
                                'time'
                              )
                            }
                            sx={{ borderRadius: '4px', fontSize: '2px' }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                      <Box sx={{ mt: 3 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <CustomTimePicker
                            label={t('CENTER_SESSION.END_TIME')}
                            value={block?.sessionEndTime || endTime}
                            onChange={(newValue) =>
                              handleChange(block?.id, newValue, 'end', 'time')
                            }
                            sx={{ borderRadius: '4px' }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

              </Box>
            </>
          )}
          {clickedBox !== 'EXTRA_SESSION' && (

            <Box sx={{ mt: 2 }}>
              <Box sx={{ overflow: 'none' }}>
                <Typography variant="h2" component="h2">
                  {t('COMMON.HELD_EVERY_WEEK_ON', {
                    days: block?.selectedWeekDays?.join(', '),
                  })}
                </Typography>

                <WeekDays
                  useAbbreviation={true}
                  selectedDays={block?.selectedWeekDays}
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
                      <CustomTimePicker
                        label={t('CENTER_SESSION.START_TIME')}
                        value={block?.sessionStartTime || startTime}
                        onChange={(newValue) =>
                          handleChange(block?.id, newValue, 'start', 'time')
                        }
                        sx={{ borderRadius: '4px', fontSize: '2px' }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Grid>
                <Grid
                  sx={{ paddingTop: '0px !important', marginTop: '15px' }}
                  item
                  xs={6}
                >
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomTimePicker
                        label={t('CENTER_SESSION.END_TIME')}
                        value={block?.sessionEndTime || endTime}
                        onChange={(newValue) =>
                          handleChange(block?.id, newValue, 'end', 'time')
                        }
                        sx={{ borderRadius: '4px' }}
                      />
                    </LocalizationProvider>
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
                          value={block?.sessionStartDate || startDate}
                          onChange={(newValue) =>
                            handleChange(block?.id, newValue, 'start', 'date')
                          }
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                        />
                      </Stack>
                    </LocalizationProvider>
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
                          value={block?.sessionEndDate || endDate}
                          onChange={(newValue) =>
                            handleChange(block?.id, newValue, 'end', 'date')
                          }
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Box>
                </Grid>
              </Grid>
            </Box>

          )
          }


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
                  {

                    editSelection === 'EDIT_SESSION' ? t('CENTER_SESSION.DELETE_THIS_SESSION') : t('CENTER_SESSION.DELETE_FOLLOWING_SESSION')
                  }
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
            editSelection === 'EDIT_SESSION'
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
