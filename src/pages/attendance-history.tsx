import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import Header from '../components/Header';
import { useTheme } from '@mui/material/styles';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import {
  attendanceInPercentageStatusList,
  // markAttendance,
} from '../services/AttendanceService';
import {
  AttendancePercentageProps,
  AttendanceParams,
  cohort,
} from '../utils/Interfaces';
import MarkAttendance from '../components/MarkAttendance';
import { useTranslation } from 'next-i18next';
import Loader from '../components/Loader';
import MonthCalender from '@/components/MonthCalender';
import { useRouter } from 'next/router';
import { formatToShowDateMonth, shortDateFormat } from '@/utils/Helper';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { cohortList } from '@/services/CohortServices';

const UserAttendanceHistory = () => {
  const theme = useTheme<any>();
  const { locale, locales, push } = useRouter();
  const { t } = useTranslation();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [presentDates, setPresentDates] = useState<string[]>([]);
  const [absentDates, setAbsentDates] = useState<string[]>([]);
  const [halfDayDates, setHalfDayDates] = useState<string[]>([]);
  const [notMarkedDates, setNotMarkedDates] = useState<string[]>([]);
  const [futureDates, setFutureDates] = useState<string[]>([]);
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState(null);
  const [percentageAttendance, setPercentageAttendance] =
    React.useState<any>(null);
  // const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
  //   const storedDate = localStorage.getItem('activeStartDate');
  //   return storedDate ? new Date(storedDate) : new Date();
  // });
  const [status, setStatus] = useState('');
  const [center, setCenter] = useState('');
  const [openMarkAttendance, setOpenMarkAttendance] = useState(false);
  const handleMarkAttendanceModal = () =>
    setOpenMarkAttendance(!openMarkAttendance);
  const [loading, setLoading] = React.useState(false);
  const [AttendanceMessage, setAttendanceMessage] = React.useState('');

  let userId: string;
  // =localStorage.getItem('userId') || '';
  // localStorage.getItem('parentCohortId') ||
  // '60d4f919-cfb1-45a2-8502-ccc9b326ef48';

  const handleBackEvent = () => {
    window.history.back();
  };

  // API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      setLoading(true);
      try {
        if (userId) {
          let limit = 0;
          let page = 0;
          let filters = { userId: userId };
          const resp = await cohortList({ limit, page, filters });
          const extractedNames = resp?.data?.cohortDetails;
          const filteredData = extractedNames
            ?.map((item: any) => ({
              cohortId: item?.cohortData?.cohortId,
              parentId: item?.cohortData?.parentId,
              name: item?.cohortData?.name,
            }))
            ?.filter(Boolean);
          setCohortsData(filteredData);
          setClassId(filteredData?.[0]?.cohortId);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        setLoading(false);
      }
    };
    fetchCohortList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (classId !== '') {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const lastDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          );

          const formattedFirstDay = formatDate(firstDayOfMonth);
          const formattedLastDay = formatDate(lastDayOfMonth);

          const attendanceData: AttendancePercentageProps = {
            page: 0,
            limit: 1,
            filters: {
              contextId: classId,
              fromDate: formattedFirstDay,
              toDate: formattedLastDay,
              scope: 'student',
            },
            facets: ['attendanceDate'],
          };

          const response =
            await attendanceInPercentageStatusList(attendanceData);
          console.log(response);
          setTimeout(() => {
            setPercentageAttendanceData(response?.data?.result?.attendanceDate);
          });

          const attendanceDates = response?.data?.result?.attendanceDate;
          const formattedAttendanceData: any = {};
          Object.keys(attendanceDates).forEach((date) => {
            const attendance = attendanceDates[date];
            formattedAttendanceData[date] = {
              date: date,
              present_percentage:
                parseFloat(attendance.present_percentage) ||
                100 - parseFloat(attendance.absent_percentage),
            };
            console.log('formattedAttendanceData', formattedAttendanceData);
            setPercentageAttendance(formattedAttendanceData);
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [classId]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  // useEffect(() => {
  //   localStorage.setItem('activeStartDate', activeStartDate.toISOString());
  // }, [activeStartDate]);

  useEffect(() => {
    handleSelectedDateChange(selectedDate);
  }, []);

  const handleActiveStartDateChange = (date: Date) => {
    // setActiveStartDate(date);
    console.log('date change called', date);
  };

  // updated function : it will handle null or undefiend data
  const formatDate = (date: Date | null | undefined) => {
    if (!date) {
      return '';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getAllDatesInRange = (startDate: string, endDate: string): string[] => {
    const datesArray: string[] = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      datesArray.push(shortDateFormat(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
  };

  const isWeekend = (date: string): boolean => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isFutureDate = (date: string): boolean => {
    return new Date(date) > new Date();
  };

  const handleSelectedDateChange = (date: Date) => {
    // setSelectedDate(date);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCenter(event.target.value as string);
  };

  const handleUpdate = async (date: string, status: string) => {
    const trimmedContextId = contextId.trim();
    if (userId && trimmedContextId) {
      const attendanceData: AttendanceParams = {
        attendanceDate: date,
        attendance: status,
        userId,
        contextId: trimmedContextId,
      };
      setLoading(true);
      // try {
      //   const response = await markAttendance(attendanceData);
      //   if (response) {
      //     setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY'));
      //     window.location.reload();
      //   }
      //   setLoading(false);
      // } catch (error) {
      //   setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_UNSUCCESSFULLY'));
      //   console.error('error', error);
      //   setLoading(false);
      // }
    }
  };

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
  };

  return (
    <Box minHeight="100vh" textAlign={'center'}>
      <Header />
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      <Box display={'flex'} justifyContent={'center'}>
        <Box
          sx={{
            width: '668px',
            '@media (max-width: 700px)': {
              width: '100%',
            },
          }}
        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'1rem'}
            padding={'1rem'}
            alignItems={'center'}
          >
            <Box
              display={'flex'}
              sx={{ color: theme.palette.warning['A200'] }}
              gap={'10px'}
              width={'100%'}
            >
              <Box onClick={handleBackEvent}>
                <Box>
                  <KeyboardBackspaceOutlinedIcon
                    cursor={'pointer'}
                    sx={{ color: theme.palette.warning['A200'] }}
                  />
                </Box>
              </Box>

              <Typography marginBottom={'0px'} fontSize={'25px'}>
                {t('ATTENDANCE.DAY_WISE_ATTENDANCE')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
            <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
              <Select
                value={classId}
                onChange={handleCohortSelection}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className="SelectLanguages fs-14 fw-500"
                style={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  marginBottom: '0rem',
                }}
              >
                {cohortsData?.length !== 0 ? (
                  cohortsData?.map((cohort) => (
                    <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                      {cohort.name}
                    </MenuItem>
                  ))
                ) : (
                  <Typography style={{ fontWeight: 'bold' }}>
                    {t('COMMON.NO_DATA_FOUND')}
                  </Typography>
                )}
              </Select>
            </FormControl>
          </Box>
          <Box
            pl={1}
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1000,
              backgroundColor: 'white',
            }}
          >
            <Box display={'flex'} gap={'10px'} width={'100%'} mb={3}>
              <Typography
                marginBottom={'0px'}
                fontSize={'16px'}
                fontWeight={'500'}
                color={'black'}
              >
                {formatToShowDateMonth(selectedDate)}
              </Typography>
            </Box>
            {/* <Box>
              {status && (
                <AttendanceStatus
                  status={status}
                  onUpdate={handleMarkAttendanceModal}
                />
              )}
            </Box> */}
          </Box>

          <MonthCalender
            formattedAttendanceData={percentageAttendance}
            onChange={handleActiveStartDateChange}
            onDateChange={handleSelectedDateChange}
          />

          <MarkAttendance
            isOpen={openMarkAttendance}
            isSelfAttendance={true}
            date={shortDateFormat(selectedDate)}
            currentStatus={status}
            handleClose={handleMarkAttendanceModal}
            handleSubmit={handleUpdate}
            message={AttendanceMessage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default UserAttendanceHistory;
