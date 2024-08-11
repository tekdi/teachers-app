import * as React from 'react';

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
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
import { ChangeEvent, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  FormContext,
  FormContextType,
  Role,
  Status,
  sessionMode,
  sessionType,
} from '@/utils/app.constant';
import utc from 'dayjs/plugin/utc';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import {
  PlannedModalProps,
  CohortMemberList,
  CreateEvent,
} from '@/utils/Interfaces';
import SessionMode from './SessionMode';
import Stack from '@mui/material/Stack';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import WeekDays from './WeekDays';
import { getFormRead } from '@/services/CreateUserService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { DaysOfWeek } from '../../app.config';
import { createEvent } from '@/services/EventService';
import { showToastMessage } from './Toastify';

type mode = (typeof sessionMode)[keyof typeof sessionMode];
type type = (typeof sessionType)[keyof typeof sessionType];

interface Session {
  id?: number | string;
  sessionMode?: string;
  selectedWeekDays?: string[];
  DaysOfWeek?: number[];
  startDatetime?: string;
  endDatetime?: string;
  endDateValue?: string;
  subject?: string;
  isRecurring?: boolean;
  meetingLink?: string;
  meetingPasscode?: string;
  onlineProvider?: string;
}

const PlannedSession: React.FC<PlannedModalProps> = ({
  removeModal,
  clickedBox,
  scheduleEvent,
  cohortName,
  cohortId,
  onCloseModal,
}) => {
  const [mode, setMode] = useState<mode>(sessionMode.OFFLINE);
  const [type, setType] = useState<type>(sessionType.REPEATING);
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>();
  const [selectedSubject, setSelectedSubject] = useState<string>();
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
      startDatetime: '',
      endDatetime: '',
      endDateValue: '',
      subject: '',
      isRecurring: false,
      meetingLink: '',
      meetingPasscode: '',
      onlineProvider: '',
    },
  ]);

  useEffect(() => {
    const initialStartDateTime = combineDateAndTime(startDate, startTime);
    const initialEndDateTime = combineDateAndTime(startDate, endTime);
    const sessionEndDate = combineDateAndTime(endDate, endTime);

    const startDatetime = convertToUTC(initialStartDateTime);
    const endDatetime = convertToUTC(initialEndDateTime);
    const endDateValue = convertToUTC(sessionEndDate);

    setSessionBlocks((blocks) =>
      blocks.map((block) =>
        block.id === 0
          ? {
              ...block,
              startDatetime: startDatetime || '',
              endDatetime: endDatetime || '',
              endDateValue: endDateValue || '',
            }
          : block
      )
    );
  }, [startDate, startTime, endDate, endTime]);

  const handleSessionModeChange = (
    event: ChangeEvent<HTMLInputElement>,
    id: string | number | undefined
  ) => {
    setMode(event.target.value.toLowerCase() as mode);
    const updatedSessionBlocks = sessionBlocks.map((block) =>
      block.id === id
        ? { ...block, sessionMode: event.target.value.toLowerCase() }
        : block
    );
    setSessionBlocks(updatedSessionBlocks);
  };

  const handleSessionTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value as type);
    console.log(event.target.value);
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
              field?.options?.map((option: any) => option?.label)
            );

          const mainSubjects = response?.fields
            .filter((field: any) => field?.label === 'MY_MAIN_SUBJECTS')
            .flatMap((field: any) =>
              field?.options?.map((option: any) => option?.label)
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
      console.log(newValue);
      if (type === 'start' && field === 'date') {
        setStartDate(newValue);
      } else if (type === 'start' && field === 'time') {
        setStartTime(newValue);
      } else if (type === 'end' && field === 'date') {
        setEndDate(newValue);
      } else if (type === 'end' && field === 'time') {
        setEndTime(newValue);
      }
    }

    const combinedStartDateTime = combineDateAndTime(startDate, startTime);
    const combinedEndDateTime = combineDateAndTime(startDate, endTime);
    const combinedEndDateValue = combineDateAndTime(endDate, endTime);

    const startDatetime = convertToUTC(combinedStartDateTime);
    const endDatetime = convertToUTC(combinedEndDateTime);
    const endDateValue = convertToUTC(combinedEndDateValue);

    if (startDatetime && endDatetime && endDateValue) {
      let isRecurringEvent: boolean;
      if (startDate !== endDate) {
        isRecurringEvent = true;
      } else {
        isRecurringEvent = false;
      }
      setSessionBlocks(
        sessionBlocks.map((block) =>
          block?.id === id
            ? {
                ...block,
                startDatetime: startDatetime,
                endDatetime: endDatetime,
                endDateValue: endDateValue,
                isRecurring: isRecurringEvent,
              }
            : block
        )
      );
    }
    console.log(sessionBlocks);
  };

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
      onlineProvider = 'Zoom';
      console.log('Valid Zoom link:', value);
    } else if (googleMeetLinkPattern.test(value)) {
      setLinkError('');
      onlineProvider = 'GoogleMeet';
      console.log('Valid Google Meet link:', value);
    } else {
      setLinkError('Please enter a valid Zoom or Google Meet link.');
      console.log('Invalid link');
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

  const handleAddSession = () => {
    setSessionBlocks([
      ...sessionBlocks,
      {
        id: sessionBlocks.length,
        selectedWeekDays: [],
        DaysOfWeek: [],
        sessionMode: '',
        startDatetime: '',
        endDatetime: '',
        subject: '',
        meetingLink: '',
        meetingPasscode: '',
        onlineProvider: '',
      },
    ]);
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
          limit: 300,
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
        title = mode === 'online' ? 'Recurring Online' : 'Recurring Offline';
      } else if (clickedBox === 'EXTRA_SESSION') {
        title = 'Extra Session';
      }

      // Create API bodies
      const apiBodies: CreateEvent[] = sessionBlocks.map((block) => {
        const baseBody: CreateEvent = {
          title,
          shortDescription: '',
          description: '',
          eventType: block?.sessionMode || '',
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
          idealTime: '120',
          isRecurring: block?.isRecurring || false,
          startDatetime: block?.startDatetime || '',
          endDatetime: block?.endDatetime || '',
          registrationStartDate: '',
          registrationEndDate: '',
          recurrencePattern: {
            frequency:
              block?.selectedWeekDays?.length === 7 ? 'daily' : 'weekly',
            interval: 1,
            daysOfWeek: block?.DaysOfWeek || [],
            endCondition: {
              type: 'endDate',
              value: block?.endDateValue || '',
            },
          },
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

        // Add meetingDetails only if sessionMode is 'online'
        if (block?.sessionMode === 'online') {
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
            if (response) {
              showToastMessage(
                t('COMMON.SESSION_SCHEDULED_SUCCESSFULLY'),
                'sucess'
              );
              if (onCloseModal) {
                onCloseModal();
              }
            }
          } catch (error) {
            console.error('Error creating event:', error);
            showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            if (onCloseModal) {
              onCloseModal();
            }
          }
        })
      );
    } catch (error) {
      console.error('Error scheduling new event:', error);
    }
  };

  useEffect(() => {
    scheduleNewEvent();
  }, [scheduleEvent, cohortId]);

  return (
    <Box overflow={'auto'}>
      {sessionBlocks.map((block, index) => (
        <Box sx={{ padding: '10px 16px' }}>
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
          )}

          {block?.sessionMode === sessionMode.ONLINE && (
            <>
              {clickedBox === 'EXTRA_SESSION' && (
                <>
                  <Box
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme?.palette?.warning['300'],
                      mt: 1.5,
                    }}
                  >
                    {t('CENTER_SESSION.SET_UP')}
                  </Box>
                </>
              )}
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
              <Box
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: theme?.palette?.warning['300'],
                }}
              >
                {t('CENTER_SESSION.SESSION_DETAILS')}
              </Box>
              <Box sx={{ mt: 2 }}>
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
                  >
                    {/* <MenuItem value={'Mathematics'}>Mathematics</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  id="outlined-basic"
                  label={t('CENTER_SESSION.SESSION_TITLE')}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}

          {clickedBox === 'EXTRA_SESSION' && (
            <>
              <Box sx={{ mt: 2 }}>
                <SessionMode
                  mode={type}
                  handleSessionModeChange={handleSessionTypeChange}
                  sessions={{
                    tile: t('CENTER_SESSION.TYPE_OF_SESSION'),
                    mode1: t('CENTER_SESSION.REPEATING'),
                    mode2: t('CENTER_SESSION.JUST_ONCE'),
                  }}
                />
                {type === sessionType.JUST && (
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label="Date"
                          value={startDate}
                          onChange={(newValue) =>
                            handleChange(block?.id, newValue, 'start', 'date')
                          }
                          format="DD MMM, YYYY"
                          sx={{ borderRadius: '4px' }}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Box>
                )}
              </Box>
            </>
          )}

          {type !== sessionType.JUST && (
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
                <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomTimePicker
                        label={t('CENTER_SESSION.START_TIME')}
                        value={startTime}
                        onChange={(newValue) =>
                          handleChange(block?.id, newValue, 'start', 'time')
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
                        value={endTime}
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
                <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label={t('CENTER_SESSION.START_DATE')}
                          value={startDate}
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
                <Grid sx={{ paddingTop: '0px !important' }} item xs={6}>
                  <Box sx={{ mt: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack spacing={3}>
                        <MobileDatePicker
                          label={t('CENTER_SESSION.END_DATE')}
                          value={endDate}
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
        </Box>
      ))}
    </Box>
  );
};

export default PlannedSession;
