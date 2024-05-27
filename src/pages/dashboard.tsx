'use client';

import {
  AttendancePercentageProps,
  AttendanceStatusListProps,
  cohort,
} from '../utils/Interfaces';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import React, { useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import {
  attendanceInPercentageStatusList,
  attendanceStatusList,
  bulkAttendance,
} from '../services/AttendanceService';
import {
  formatDate,
  formatSelectedDate,
  getMonthName,
  getTodayDate,
  shortDateFormat,
  toPascalCase,
} from '../utils/Helper';

import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import AttendanceStatusListView from '../components/AttendanceStatusListView';
import Backdrop from '@mui/material/Backdrop';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import ExtraSessionsCard from '@/components/ExtraSessionsCard';
import Fade from '@mui/material/Fade';
import Header from '../components/Header';
import Link from 'next/link';
import Loader from '../components/Loader';
import Modal from '@mui/material/Modal';
import OverviewCard from '@/components/OverviewCard';
import TimeTableCard from '@/components/TimeTableCard';
import WeekCalender from '@/components/WeekCalender';
import WeekDays from '@/components/WeekDays';
import { cohortList } from '../services/CohortServices';
import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import MarkBulkAttendance from '@/components/MarkBulkAttendance';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

interface DashboardProps {
  //   buttonText: string;
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [open, setOpen] = React.useState(false);
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [classId, setClassId] = React.useState('');
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<{}>>([]);
  const [showDetails, setShowDetails] = React.useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState(null);
  const [numberOfCohortMembers, setNumberOfCohortMembers] = React.useState(0);
  const [percentageAttendance, setPercentageAttendance] =
    React.useState<any>(null);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isAllAttendanceMarked, setIsAllAttendanceMarked] =
    React.useState(false);
  const [showUpdateButton, setShowUpdateButton] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [state, setState] = React.useState<State>({
    openModal: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, openModal } = state;
  const { t } = useTranslation();
  const router = useRouter();
  const currentDate = getTodayDate();
  const contextId = classId;
  const theme = useTheme<any>();
  const determinePathColor = useDeterminePathColor();
  const modalContainer = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: theme.palette.warning['A400'],
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    }
  }, []);

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
          localStorage.setItem(
            'parentCohortId',
            extractedNames?.[0].cohortData.parentId
          );

          const filteredData = extractedNames
            ?.map((item: any) => ({
              cohortId: item?.cohortData?.cohortId,
              parentId: item?.cohortData?.parentId,
              name: item?.cohortData?.name,
            }))
            ?.filter(Boolean);
          setCohortsData(filteredData);
          setClassId(filteredData?.[0]?.cohortId);
          setShowUpdateButton(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        setLoading(false);
      }
    };
    fetchCohortList();
  }, []);

  //API for getting student list
  useEffect(() => {
    submitBulkAttendanceAction(true, '', '');
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (classId) {
          let limit = 0;
          let page = 0;
          let filters = { cohortId: classId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.data?.userDetails;

          if (resp) {
            const nameUserIdArray = resp?.map((entry: any) => ({
              userId: entry.userId,
              name: toPascalCase(entry.name),
            }));
            console.log('name..........', nameUserIdArray);
            if (nameUserIdArray && (selectedDate || currentDate)) {
              const userAttendanceStatusList = async () => {
                const attendanceStatusData: AttendanceStatusListProps = {
                  limit: 0,
                  page: 0,
                  filters: {
                    fromDate: selectedDate || currentDate,
                    toDate: selectedDate || currentDate,
                    contextId: classId,
                  },
                };
                const res = await attendanceStatusList(attendanceStatusData);
                const response = res?.data?.attendanceList;
                console.log('attendanceStatusList', response);
                if (nameUserIdArray && response) {
                  const getUserAttendanceStatus = (
                    nameUserIdArray: any[],
                    response: any[]
                  ) => {
                    const userAttendanceArray: {
                      userId: any;
                      attendance: any;
                    }[] = [];

                    nameUserIdArray.forEach((user) => {
                      const userId = user.userId;
                      const attendance = response.find(
                        (status) => status.userId === userId
                      );
                      userAttendanceArray.push({
                        userId,
                        attendance: attendance?.attendance
                          ? attendance.attendance
                          : '',
                      });
                    });
                    return userAttendanceArray;
                  };
                  const userAttendanceArray = getUserAttendanceStatus(
                    nameUserIdArray,
                    response
                  );
                  console.log('userAttendanceArray', userAttendanceArray);

                  if (nameUserIdArray && userAttendanceArray) {
                    const mergeArrays = (
                      nameUserIdArray: { userId: string; name: string }[],
                      userAttendanceArray: {
                        userId: string;
                        attendance: string;
                      }[]
                    ): {
                      userId: string;
                      name: string;
                      attendance: string;
                    }[] => {
                      let newArray: {
                        userId: string;
                        name: string;
                        attendance: string;
                      }[] = [];
                      nameUserIdArray.forEach((user) => {
                        const userId = user.userId;
                        const attendanceEntry = userAttendanceArray.find(
                          (entry) => entry.userId === userId
                        );
                        if (attendanceEntry) {
                          newArray.push({
                            userId,
                            name: user.name,
                            attendance: attendanceEntry.attendance,
                          });
                        }
                      });
                      if (newArray.length != 0) {
                        // newArray = newArray.filter(item => item.name);
                        setCohortMemberList(newArray);
                        setNumberOfCohortMembers(newArray?.length);
                      } else {
                        setCohortMemberList(nameUserIdArray);
                        setNumberOfCohortMembers(nameUserIdArray?.length);
                      }
                      return newArray;
                    };
                    mergeArrays(nameUserIdArray, userAttendanceArray);
                  }
                }
                setLoading(false);
              };
              userAttendanceStatusList();
            }
          }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (classId?.length) {
      getCohortMemberList();
    }
  }, [classId, selectedDate]);

  const showDetailsHandle = (dayStr: string) => {
    setSelectedDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const handleModalToggle = () => setOpen(!open);

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
    setHandleSaveHasRun(!handleSaveHasRun);
  };

  useEffect(() => {
    const getAttendaceData = async () => {
      try {
        if (contextId !== '') {
          const currentDate = new Date();
          const dayOfWeek = currentDate.getDay();
          const diffToMonday =
            currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          const startDate = new Date(currentDate.setDate(diffToMonday));
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          const fromDateFormatted = shortDateFormat(startDate);
          const toDateFormatted = shortDateFormat(endDate);
          const attendanceRequest: AttendancePercentageProps = {
            limit: 2,
            page: 1,
            filters: {
              contextId: classId,
              fromDate: fromDateFormatted,
              toDate: toDateFormatted,
              scope: 'student',
            },
            facets: ['attendanceDate'],
          };
          const response =
            await attendanceInPercentageStatusList(attendanceRequest);
          console.log('response', response?.data?.result?.attendanceDate);
          setTimeout(() => {
            setPercentageAttendanceData(response?.data?.result?.attendanceDate);
          });

          const attendanceDates = response?.data?.result?.attendanceDate;
          const formattedAttendanceData: any = {};
          Object.keys(attendanceDates).forEach((date) => {
            const attendance = attendanceDates[date];
            const present = attendance.present || 0;
            const absent = attendance.absent || 0;
            const totalStudents =
              attendance.present_percentage === '100.00'
                ? present
                : present + absent;

            formattedAttendanceData[date] = {
              date: date,
              present_students: present,
              total_students: totalStudents,
              present_percentage:
                parseFloat(attendance.present_percentage) ||
                100 - parseFloat(attendance.absent_percentage),
              absent_percentage:
                parseFloat(attendance.absent_percentage) ||
                100 - parseFloat(attendance.present_percentage),
            };
            console.log('formattedAttendanceData', formattedAttendanceData);
            setPercentageAttendance(formattedAttendanceData);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAttendaceData();
  }, [classId, handleSaveHasRun]);

  const submitBulkAttendanceAction = (
    isBulkAction: boolean,
    status: string,
    id?: string | undefined
  ) => {
    const updatedAttendanceList = cohortMemberList?.map((user: any) => {
      if (isBulkAction) {
        user.attendance = status;
        setBulkAttendanceStatus(status);
      } else {
        setBulkAttendanceStatus('');
        if (user.userId === id) {
          user.attendance = status;
        }
      }
      return user;
    });
    setCohortMemberList(updatedAttendanceList);
    const hasEmptyAttendance = () => {
      const allAttendance = updatedAttendanceList.some(
        (user) => user.attendance === ''
      );
      setIsAllAttendanceMarked(!allAttendance);
      if (!allAttendance) {
        setShowUpdateButton(true);
      }
    };
    hasEmptyAttendance();
  };

  const viewAttendanceHistory = () => {
    router.push('/attendance-history');
  };

  const handleSave = () => {
    handleModalToggle();
    const userAttendance = cohortMemberList?.map((user: any) => {
      return {
        userId: user.userId,
        attendance: user.attendance,
      };
    });
    if (userAttendance) {
      const data = {
        attendanceDate: selectedDate || currentDate,
        contextId,
        userAttendance,
      };
      const markBulkAttendance = async () => {
        setLoading(true);
        try {
          const response = await bulkAttendance(data);
          // console.log(`response bulkAttendance`, response?.responses);
          // const resp = response?.data;
          // console.log(`data`, data);
          setShowUpdateButton(true);
          handleModalToggle();
          setLoading(false);
          setHandleSaveHasRun(true);
        } catch (error) {
          console.error('Error fetching  cohort list:', error);
          setLoading(false);
        }
        handleClick({ vertical: 'bottom', horizontal: 'center' })();
      };
      markBulkAttendance();
    }
  };

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, openModal: true });
  };
  const handleClose = () => {
    setState({ ...state, openModal: false });
  };

  const todayDate = new Date().toISOString().split('T')[0];
  let currentAttendance = percentageAttendance?.[todayDate] || 'Not Marked';

  if (selectedDate) {
    const selectedDateTime = new Date(selectedDate).getTime();
    const todayDateTime = new Date(todayDate).getTime();
    if (selectedDateTime > todayDateTime) {
      currentAttendance = 'futureDate';
    } else {
      currentAttendance = percentageAttendance?.[selectedDate] || 'Not Marked';
    }
  }
  const presentPercentage = parseFloat(currentAttendance?.present_percentage);

  const pathColor = determinePathColor(presentPercentage);

  return (
    <>
      {!isAuthenticated && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}

      {isAuthenticated && (
        <Box minHeight="100vh" className="linerGradient">
          <Header />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box width={'100%'}>
              <Typography
                textAlign={'left'}
                fontSize={'22px'}
                m={'1rem'}
                color={'black'}
              >
                {t('DASHBOARD.DASHBOARD')}
              </Typography>
            </Box>
          </Box>
          {loading && (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              bgcolor={theme.palette.warning['A900']}
              paddingBottom={'20px'}
              width={'100%'}
            >
              <Box display={'flex'} flexDirection={'column'} padding={'1rem'}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography
                    variant="h2"
                    sx={{ fontSize: '14px' }}
                    color={'black'}
                    fontWeight={'500'}
                  >
                    {t('DASHBOARD.DAY_WISE_ATTENDANCE')}
                  </Typography>
                  <Box
                    className="calenderTitle flex-center"
                    display={'flex'}
                    sx={{
                      cursor: 'pointer',
                      color: theme.palette.secondary.main,
                      gap: '2px',
                    }}
                    onClick={viewAttendanceHistory}
                  >
                    <Typography marginBottom={'0px'}>
                      {getMonthName()}
                    </Typography>
                    <CalendarMonthIcon />
                  </Box>
                </Box>

                <Box sx={{ mt: 0.6 }}>
                  <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                    <FormControl
                      className="drawer-select"
                      sx={{ m: 0, width: '100%' }}
                    >
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
                            <MenuItem
                              key={cohort.cohortId}
                              value={cohort.cohortId}
                            >
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
                </Box>
                <WeekCalender
                  showDetailsHandle={showDetailsHandle}
                  data={percentageAttendanceData}
                />
                <Box
                  border={'1px solid black'}
                  height={'auto'}
                  width={'auto'}
                  padding={'1rem'}
                  borderRadius={'1rem'}
                  bgcolor={theme.palette.warning['A200']}
                  textAlign={'left'}
                  margin={'15px 0 0 0 '}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    marginTop={1}
                    justifyContent={'space-between'}
                  >
                    <Box display={'flex'}>
                      {currentAttendance !== 'Not Marked' &&
                        currentAttendance !== 'futureDate' && (
                          <>
                            <Box
                              width={'25px'}
                              height={'2rem'}
                              marginTop={'0.25rem'}
                              margin={'5px'}
                            >
                              <CircularProgressbar
                                value={currentAttendance?.present_percentage}
                                background
                                backgroundPadding={6}
                                styles={buildStyles({
                                  textColor: pathColor,
                                  pathColor: pathColor,
                                  trailColor: '#E6E6E6',
                                  strokeLinecap: 'round',
                                  backgroundColor: '#ffffff',
                                })}
                                strokeWidth={15}
                              />
                            </Box>
                            <Box>
                              <Typography
                                sx={{ color: theme.palette.warning['A400'] }}
                                variant="h6"
                                className="word-break"
                              >
                                {t('DASHBOARD.PERCENT_ATTENDANCE', {
                                  percent_students:
                                    currentAttendance?.present_percentage,
                                })}
                              </Typography>
                              <Typography
                                sx={{ color: theme.palette.warning['A400'] }}
                                variant="h6"
                                className="word-break"
                              >
                                {t('DASHBOARD.PRESENT_STUDENTS', {
                                  present_students:
                                    currentAttendance?.present_students,
                                  total_students:
                                    currentAttendance?.total_students,
                                })}
                              </Typography>
                            </Box>
                          </>
                        )}
                      {currentAttendance === 'Not Marked' &&
                        currentAttendance !== 'futureDate' && (
                          <Typography
                            sx={{ color: theme.palette.warning['A400'] }}
                            fontSize={'0.8rem'}
                            // variant="h6"
                            // className="word-break"
                          >
                            {t('DASHBOARD.NOT_MARKED')}
                          </Typography>
                        )}
                      {currentAttendance === 'futureDate' && (
                        <Typography
                          sx={{ color: theme.palette.warning['A400'] }}
                          fontSize={'0.8rem'}
                        >
                          {t('DASHBOARD.FUTURE_DATE_CANT_MARK')}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        minWidth: '33%',
                        height: '2.5rem',
                        padding: theme.spacing(1),
                      }}
                      onClick={handleModalToggle}
                      disabled={currentAttendance === 'futureDate'}
                    >
                      {t('COMMON.MARK')}
                    </Button>
                  </Stack>
                </Box>

                {/* Student Attendance Modal */}
                <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleModalToggle}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                  className="modal_mark"
                >
                  <Fade in={open}>
                    <Box
                      sx={{
                        ...modalContainer,
                        borderColor: theme.palette.warning['A400'],
                        padding: '15px 10px 0 10px',
                      }}
                      borderRadius={'1rem'}
                      height={'80%'}
                    >
                      <Box height={'100%'} width={'100%'}>
                        <Box display={'flex'} justifyContent={'space-between'}>
                          <Box marginBottom={'0px'}>
                            <Typography
                              variant="h2"
                              component="h2"
                              marginBottom={'0px'}
                              fontWeight={'500'}
                              fontSize={'16px'}
                              sx={{ color: theme.palette.warning['A200'] }}
                            >
                              {t('COMMON.MARK_CENTER_ATTENDANCE')}
                            </Typography>
                            <Typography
                              variant="h2"
                              sx={{
                                paddingBottom: '10px',
                                color: theme.palette.warning['A200'],
                                fontSize: '14px',
                              }}
                              component="h2"
                            >
                              {formatDate(selectedDate || currentDate)}
                            </Typography>
                          </Box>
                          <Box onClick={() => handleModalToggle()}>
                            <CloseIcon
                              sx={{
                                cursor: 'pointer',
                                color: theme.palette.warning['A200'],
                              }}
                            />
                          </Box>
                        </Box>
                        <Box
                          sx={{ height: '1px', background: '#D0C5B4' }}
                        ></Box>
                        {loading && (
                          <Loader
                            showBackdrop={true}
                            loadingText={t('COMMON.LOADING')}
                          />
                        )}

                        <Typography
                          sx={{
                            marginTop: '10px',
                            fontSize: '12px',
                            color: theme.palette.warning['A200'],
                          }}
                        >
                          {t('ATTENDANCE.TOTAL_STUDENTS', {
                            count: numberOfCohortMembers,
                          })}
                        </Typography>
                        {cohortMemberList && cohortMemberList?.length != 0 ? (
                          <Box
                            height={'56vh'}
                            sx={{ overflowY: 'scroll', marginTop: '10px' }}
                          >
                            <Box>
                              <AttendanceStatusListView
                                isEdit={true}
                                isBulkAction={true}
                                bulkAttendanceStatus={bulkAttendanceStatus}
                                handleBulkAction={submitBulkAttendanceAction}
                              />
                              {cohortMemberList?.map(
                                (
                                  user: any //cohort member list should have userId, attendance, name
                                ) => (
                                  <AttendanceStatusListView
                                    key={user.userId}
                                    userData={{
                                      userId: user.userId,
                                      attendance: user.attendance,
                                      attendanceDate:
                                        selectedDate || currentDate,
                                      name: user.name,
                                    }}
                                    isEdit={true}
                                    bulkAttendanceStatus={bulkAttendanceStatus}
                                    handleBulkAction={
                                      submitBulkAttendanceAction
                                    }
                                  />
                                )
                              )}
                            </Box>
                            <Box
                              position={'absolute'}
                              bottom="0px"
                              display={'flex'}
                              gap={'20px'}
                              flexDirection={'row'}
                              justifyContent={'space-evenly'}
                              marginBottom={0}
                              sx={{
                                background: '#fff',
                                padding: '15px 0 15px 0',
                              }}
                            >
                              <Button
                                variant="outlined"
                                style={{ width: '8rem' }}
                                disabled={isAllAttendanceMarked ? false : true}
                                onClick={() =>
                                  submitBulkAttendanceAction(true, '', '')
                                }
                              >
                                {' '}
                                {t('COMMON.CLEAR_ALL')}
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                style={{ width: '8rem' }}
                                disabled={isAllAttendanceMarked ? false : true}
                                onClick={handleSave}
                              >
                                {showUpdateButton
                                  ? t('COMMON.UPDATE')
                                  : t('COMMON.SAVE')}
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <Typography
                            style={{ fontWeight: 'bold', marginLeft: '1rem' }}
                          >
                            {t('COMMON.NO_DATA_FOUND')}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Fade>
                </Modal>
              </Box>

              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={openModal}
                onClose={handleClose}
                className="sample"
                autoHideDuration={5000}
                key={vertical + horizontal}
                message={t('ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY')}
                // action={action}
              />

              <Divider sx={{ borderBottomWidth: '0.1rem' }} />

              {/* Overview Card Section */}
              <Box
                display={'flex'}
                flexDirection={'column'}
                gap={'1rem'}
                padding={'1rem'}
              >
                <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  padding={'2px'}
                >
                  <Box>
                    <Typography className="fs-14" variant="h2">
                      {t('DASHBOARD.OVERVIEW')}
                    </Typography>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ color: theme.palette.secondary.main }}
                  >
                    <Link
                      className="flex-center fs-14 text-decoration"
                      href={'/attendance-overview'}
                    >
                      {t('DASHBOARD.MORE_DETAILS')}{' '}
                      <ArrowForwardSharpIcon sx={{ height: '18px' }} />
                    </Link>
                  </Box>
                </Stack>
                {loading && (
                  <Loader
                    showBackdrop={true}
                    loadingText={t('COMMON.LOADING')}
                  />
                )}
              </Box>
              <Box display={'flex'} className="card_overview">
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <OverviewCard label="Centre Attendance" value="71%" />
                  </Grid>
                  <Grid item xs={7}>
                    <OverviewCard
                      label="Low Attendance Learners"
                      value="Bharat Kumar, Ankita Kulkarni, +3 more"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box sx={{ background: '#fff' }}>
            <Typography
              textAlign={'left'}
              fontSize={'0.8rem'}
              pl={'1rem'}
              pt={'1rem'}
              color={'black'}
              fontWeight={'600'}
            >
              {t('DASHBOARD.MY_TIMETABLE')}
            </Typography>
            <WeekDays useAbbreviation={false} />
          </Box>
          <Box
            sx={{
              background: '#fff',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box width={'100%'}>
              <TimeTableCard
                subject={'Science'}
                instructor={'Khapari Dharmu'}
                time={'10 am - 1 pm'}
              />
              <TimeTableCard
                subject={'Home Science'}
                instructor={'Khapari Dharmu'}
                time={'2 pm - 5 pm'}
              />
              <Typography
                textAlign={'left'}
                fontSize={'0.8rem'}
                ml={'1rem'}
                color={'black'}
                fontWeight={'600'}
              >
                {t('DASHBOARD.UPCOMING_EXTRA_SESSION')}
              </Typography>
              <ExtraSessionsCard
                subject={'Science'}
                instructor={'Upendra Kulkarni'}
                dateAndTime={'27 May, 11am - 12pm'}
                meetingURL={
                  'https://meet.google.com/fqz-ftoh-dynfqz-ftoh-dynfqz-ftoh-dyn'
                }
                onEditClick={() => {
                  console.log('edit');
                }}
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
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

export default Dashboard;
