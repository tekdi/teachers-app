'use client';

import {
  AttendanceParams,
  AttendanceStatusListProps,
  TeacherAttendanceByDateParams,
} from '../utils/Interfaces';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import { bulkAttendance, markAttendance } from '../services/AttendanceService';
import { formatDate, getMonthName, getTodayDate } from '../utils/Helper';

import { ATTENDANCE_ENUM } from '../utils/Helper';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import AttendanceStatusListView from '../components/AttendanceStatusListView';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import ExtraSessionsCard from '@/components/ExtraSessionsCard';
import Fade from '@mui/material/Fade';
import Header from '../components/Header';
import Link from 'next/link';
import Loader from '../components/Loader';
import MarkAttendance from '../components/MarkAttendance';
import Modal from '@mui/material/Modal';
import OverviewCard from '@/components/OverviewCard';
import TimeTableCard from '@/components/TimeTableCard';
import TodayIcon from '@mui/icons-material/Today';
import WeekDays from '@/components/WeekDays';
import { cohortList } from '../services/CohortServices';
import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import { getTeacherAttendanceByDate, attendanceStatusList } from '../services/AttendanceService';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { text } from 'stream/consumers';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

interface DashboardProps {
  //   buttonText: string;
}

interface user {
  key: string;
}

interface cohort {
  cohortId: string;
  name: string;
  value: string;
}
// let userId = localStorage.getItem('userId');
let contextId: string = '';

const Dashboard: React.FC<DashboardProps> = () => {
  const [open, setOpen] = React.useState(false);
  // const [selfAttendanceDetails, setSelfAttendanceDetails] = React.useState(null);
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [classId, setClassId] = React.useState('');
  const [userType, setUserType] = React.useState('Students');
  const [cohortId, setCohortId] = React.useState(null);
  const [openMarkAttendance, setOpenMarkAttendance] = React.useState(false);
  const [openMarkUpdateAttendance, setOpenMarkUpdateAttendance] =
    React.useState(false);
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<user>>(
    []
  );
  const [numberOfCohortMembers, setNumberOfCohortMembers] = React.useState(0);
  const [currentDate, setCurrentDate] = React.useState(getTodayDate);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [AttendanceMessage, setAttendanceMessage] = React.useState('');
  const [attendanceStatus, setAttendanceStatus] = React.useState('');
  const [isAllAttendanceMarked, setIsAllAttendanceMarked] =
    React.useState(false);
  const [showUpdateButton, setShowUpdateButton] = React.useState(false);
  const [state, setState] = React.useState<State>({
    openModal: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, openModal } = state;

  const { t } = useTranslation();
  const router = useRouter();
  const limit = 100;
  const page = 0;
  // const userAttendance = [{ userId: localStorage.getItem('userId'), attendance: 'present' }];
  const attendanceDate = currentDate;
  let contextId = classId;
  //  const [TeachercontextId, setTeacherContextId] = React.useState("");
  const userTypeData = ['Students', 'Self'];
  const report = false;
  const offset = 0;
  const theme = useTheme<any>();
  ``;
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

  //API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      // const userId = localStorage.getItem('userId');
      const userId = '6d58d9c3-863f-484b-a81a-76901e9a6c9e'; //Hard Coded for testing purpose. TODO: replace by dynamic userId
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
          //  setTeacherContextId(extractedNames[0].cohortData.parentId)

          const filteredData = extractedNames
            ?.map((item: any) => ({
              cohortId: item.cohortData.cohortId,
              parentId: item.cohortData.parentId,
              name: item.cohortData.name,
            }))
            ?.filter(Boolean);
          setCohortsData(filteredData);
          setClassId(filteredData?.[0].cohortId);
          setShowUpdateButton(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        setLoading(false);
      }
    };
    // if (classesId != '') {
    fetchCohortList();
    // }
  }, []);

  //API for getting student list
  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      // const parentCohortId = localStorage.getItem('parentCohortId');
      // const formattedDate: string = currentDate;
      try {
        if (classId) {
          //userId && parentCohortId
          let limit = '100';
          let page = 0;
          let filters = { cohortId: classId }; //Hard coded for testing replace it with classId
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.data?.userDetails;
          console.log(`classlist`, resp)

          if (resp[0]?.userDetails) {
            const nameUserIdArray = resp[0].userDetails.map(
              ({ userId, name }: any) => ({
                userId,
                name,
              })
            );
            if (nameUserIdArray && contextId) {
              const userAttendanceStatusList = async () => {
                const attendanceStatusData: AttendanceStatusListProps = {
                  limit: 150,
                  page: 10,
                  filters: {
                    contextId: contextId,
                    scope: "student",
                  },
                };
                const response2 =
                  await attendanceStatusList(attendanceStatusData);
                console.log('res22222222', response2)
                if (response?.data?.length === 0) {
                  setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
                } else {
                  setAttendanceStatus(response2?.data?.[0]?.attendance);
                }
                

                //Add logic to merge response2 and nameUserIdArray
                setCohortMemberList(nameUserIdArray);
                setNumberOfCohortMembers(nameUserIdArray?.length);
                setLoading(false);
              };
              userAttendanceStatusList()
            }
          }
          // const TeachercontextId = parentCohortId.replace(/\n/g, '');

          // const attendanceData: TeacherAttendanceByDateParams = {
          //   fromDate: formattedDate,
          //   toDate: formattedDate,
          //   filters: {
          //     userId,
          //     contextId: TeachercontextId,
          //   },
          // };
          // const response2 = await getTeacherAttendanceByDate(attendanceData);
          // if (response?.data?.length === 0) {
          //   setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
          // } else {
          //   setAttendanceStatus(response2.data[0].attendance);
          // }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (classId.length) {
      getCohortMemberList();
    }
  }, [classId]);

  const handleModalToggle = () => setOpen(!open);
  const handleMarkAttendanceModal = () =>
    setOpenMarkAttendance(!openMarkAttendance);
  const handleMarkUpdateAttendanceModal = () =>
    setOpenMarkUpdateAttendance(!openMarkUpdateAttendance);

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
  };

  const handleUserTypeChange = (event: SelectChangeEvent) => {
    setUserType(event.target.value as string);
  };

  const submitAttendance = async (date: string, status: string) => {
    const parentCohortId = localStorage.getItem('parentCohortId');

    const formattedDate: string = currentDate;
    //console.log(date, status);
    // if (userId && parentCohortId) {
    //   const TeachercontextId = parentCohortId.replace(/\n/g, '');

    //   const attendanceData: AttendanceParams = {
    //     attendanceDate: date,
    //     attendance: status,
    //     userId,
    //     contextId: TeachercontextId,
    //   };
    //   setLoading(true);
    //   try {
    //     const response = await markAttendance(attendanceData);
    //     if (response) {
    //       setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY'));

    //       //  const TeachercontextId = parentCohortId.replace(/\n/g, '');

    //       const attendanceData: TeacherAttendanceByDateParams = {
    //         fromDate: formattedDate,
    //         toDate: formattedDate,
    //         filters: {
    //           userId,
    //           contextId: TeachercontextId,
    //         },
    //       };
    //       const response = await getTeacherAttendanceByDate(attendanceData);
    //       if (response?.data?.length === 0) {
    //         setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
    //       } else {
    //         setAttendanceStatus(response.data[0].attendance);
    //       }
    //     }
    //     setLoading(false);
    //   } catch (error) {
    //     setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_UNSUCCESSFULLY'));
    //     console.error('error', error);
    //     setLoading(false);
    //   }
    // }
  };

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
    router.push('/user-attendance-history'); //Check Route
  };

  const handleSave = () => {
    const userAttendance = cohortMemberList?.map((user: any) => {
      return {
        userId: user.userId,
        attendance: user.attendance,
      };
    });
    if (userAttendance) {
      const data = {
        attendanceDate: currentDate,
        contextId,
        userAttendance
      };
      const markBulkAttendance = async () => {
        setLoading(true);
        try {
          const response = await bulkAttendance(data);
          // console.log(`response bulkAttendance`, response?.responses);
          // const resp = response?.data;
          // console.log(`data`, data);
          setShowUpdateButton(true);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching  cohort list:', error);
          setLoading(false);
        }
        handleClick({ vertical: 'bottom', horizontal: 'center' })();
      };
      markBulkAttendance();
    }
  };
  console.log('att', attendanceStatus);

  useEffect(() => {
    let userId = '70861cf2-d00c-475a-a909-d58d0062c880'; //Hard coded for testing purpose: TODO: Remove it later and add dynamic userId
    //setContextId('17a82258-8b11-4c71-8b93-b0cac11826e3') // this one is for testing purpose
    const fetchUserDetails = async () => {
      try {
        const parentCohortId = localStorage.getItem('parentCohortId');

        const today: Date = new Date();
        const year: number = today.getFullYear();
        let month: number | string = today.getMonth() + 1; // Month is zero-based, so we add 1
        let day: number | string = today.getDate();

        // Pad single-digit months and days with a leading zero
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        const formattedDate: string = `${year}-${month}-${day}`;

        if (userId && parentCohortId) {
          const TeachercontextId = parentCohortId.replace(/\n/g, '');

          const attendanceData: TeacherAttendanceByDateParams = {
            fromDate: formattedDate,
            toDate: formattedDate,
            filters: {
              userId,
              contextId: TeachercontextId,
            },
          };
          const response = await getTeacherAttendanceByDate(attendanceData);
          if (response?.data?.length === 0) {
            setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
          } 
          // else {
          //   setAttendanceStatus(response?.data[0]?.attendance);
          // }
        }
      } catch (Error) {
        console.error(Error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, openModal: true });
  };
  const handleClose = () => {
    setState({ ...state, openModal: false });
  };

  return (
    <Box minHeight="100vh">
      <Header />
      <Typography textAlign={'left'} fontSize={'1.5rem'} m={'1rem'}>
        {t('DASHBOARD.DASHBOARD')}
      </Typography>
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <Box
        sx={{ bgcolor: theme.palette.warning['A900'], paddingBottom: '20px' }}
      >
        <Box display={'flex'} flexDirection={'column'} padding={'1rem'}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant="h2">
              {t('DASHBOARD.DAY_WISE_ATTENDANCE')}
            </Typography>
            <Box
              display={'flex'}
              sx={{ color: theme.palette.warning['A200'], cursor: 'pointer' }}
              onClick={viewAttendanceHistory}
            >
              <Typography marginBottom={'0px'}>{getMonthName()}</Typography>
              <TodayIcon />
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ minWidth: 120 }} display={'flex'}>
              <FormControl sx={{ m: 1, width: '40%' }}>
                <Select
                  value={userType}
                  onChange={handleUserTypeChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {userTypeData?.length !== 0 ? (
                    userTypeData?.map((user) => (
                      <MenuItem key={user} value={user}>
                        {user}
                      </MenuItem>
                    ))
                  ) : (
                    <Typography style={{ fontWeight: 'bold' }}>
                      {t('COMMON.NO_DATA_FOUND')}
                    </Typography>
                  )}
                </Select>
              </FormControl>
              {userType == 'Students' ? (
                <FormControl sx={{ m: 1, width: '60%' }}>
                  <Select
                    value={classId}
                    onChange={handleCohortSelection}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
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
              ) : null}
            </Box>
          </Box>
          <Box
            border={'1px solid black'}
            height={'auto'}
            width={'auto'}
            padding={'1rem'}
            borderRadius={'1rem'}
            bgcolor={theme.palette.warning['A200']}
            textAlign={'left'}
          >
            <Stack
              direction="row"
              spacing={1}
              marginTop={1}
              justifyContent={'space-between'}
            >
              {userType == 'Students' ? (
                <Box>
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}}>{t('DASHBOARD.NOT_MARKED')}</Typography> */}
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}} fontSize={'0.8rem'}>{t('DASHBOARD.FUTURE_DATE_CANT_MARK')}</Typography>
                   */}
                  <Typography
                    sx={{ color: theme.palette.warning['A400'] }}
                    variant="h6"
                    className="word-break"
                  >
                    {t('DASHBOARD.PERCENT_ATTENDANCE')}
                  </Typography>
                  <Typography
                    sx={{ color: theme.palette.warning['A400'] }}
                    variant="h6"
                    className="word-break"
                  >
                    {t('DASHBOARD.PRESENT_STUDENTS')}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}}>{t('DASHBOARD.NOT_MARKED')}</Typography> */}
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}} fontSize={'0.8rem'}>{t('DASHBOARD.FUTURE_DATE_CANT_MARK')}</Typography>
                   */}
                  {/* <Typography
                sx={{ color: theme.palette.warning['A400'] }}
                variant="h6"
              >
                {t('ATTENDANCE.PRESENT')}
              </Typography> */}
                  <Typography
                    sx={{ color: theme.palette.warning['A400'] }}
                    variant="h6"
                    className="word-break"
                  >
                    {t('ATTENDANCE.ON_LEAVE')}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{
                  minWidth: '33%',
                  height: '2.5rem',
                  padding: theme.spacing(1),
                }}
                onClick={
                  userType == 'Students'
                    ? handleModalToggle
                    : handleMarkAttendanceModal
                }
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
          >
            <Fade in={open}>
              <Box
                sx={{
                  ...modalContainer,
                  borderColor: theme.palette.warning['A400'],
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
                        fontWeight={'bold'}
                      >
                        {t('COMMON.MARK_STUDENT_ATTENDANCE')}
                      </Typography>
                      <Typography variant="h2" component="h2">
                        {formatDate(currentDate)}
                      </Typography>
                    </Box>
                    <Box onClick={() => handleModalToggle()}>
                      <CloseIcon sx={{ cursor: 'pointer' }} />
                    </Box>
                  </Box>
                  <Divider sx={{ borderBottomWidth: '0.15rem' }} />
                  {loading && (
                    <Loader
                      showBackdrop={true}
                      loadingText={t('COMMON.LOADING')}
                    />
                  )}

                  <Typography>
                    {t('ATTENDANCE.TOTAL_STUDENTS', {
                      count: numberOfCohortMembers,
                    })}
                  </Typography>
                  {cohortMemberList && cohortMemberList?.length != 0 ? (
                    <Box height={'58%'} sx={{ overflowY: 'scroll' }}>
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
                                attendance:user.attendance,
                                attendanceDate: currentDate,
                                name: user.name,
                              }}
                              isEdit={true}
                              bulkAttendanceStatus={bulkAttendanceStatus}
                              handleBulkAction={submitBulkAttendanceAction}
                            />
                          )
                        )}
                      </Box>
                      <Box
                        position={'absolute'}
                        bottom="30px"
                        display={'flex'}
                        gap={'20px'}
                        flexDirection={'row'}
                        justifyContent={'space-evenly'}
                        marginBottom={0}
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

        {/* Self Attendance Component */}
        <MarkAttendance
          isOpen={openMarkAttendance}
          isSelfAttendance={true}
          date={currentDate}
          currentStatus={attendanceStatus}
          handleClose={handleMarkAttendanceModal}
          handleSubmit={submitAttendance}
          message={AttendanceMessage}
        />
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
              <Typography variant="h2">{t('DASHBOARD.OVERVIEW')}</Typography>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{ color: theme.palette.secondary.main }}
            >
              <Link href={'/'}>
                {t('DASHBOARD.MORE_DETAILS')} <ArrowForwardSharpIcon />
              </Link>
            </Box>
          </Stack>
          {loading && (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          )}
        </Box>
        {userType == 'Students' ? (
          <Box display={'flex'}>
            <OverviewCard label="Centre Attendance" value="71%" />
            <OverviewCard
              label="Low Attendance Students"
              value="Bharat Kumar, Ankita Kulkarni, +3 more"
            />
          </Box>
        ) : (
          <OverviewCard label="My Overall Attendance" value="85%" />
        )}
      </Box>
      <Box>
        <Typography textAlign={'left'} fontSize={'0.8rem'} m={'1rem'}>
          {t('DASHBOARD.MY_TIMETABLE')}
        </Typography>
        <WeekDays useAbbreviation={false} />
        <TimeTableCard
          subject={'Science'}
          instructor={'Upendra Kulkarni'}
          time={'07-may-2024'}
        />
        <Typography textAlign={'left'} fontSize={'0.8rem'} m={'1rem'}>
          {t('DASHBOARD.UPCOMING_EXTRA_SESSION')}
        </Typography>
        <ExtraSessionsCard
          subject={'Science'}
          instructor={'Upendra Kulkarni'}
          dateAndTime={'07-may-2024'}
          meetingURL={
            'https://meet.google.com/fqz-ftoh-dynfqz-ftoh-dynfqz-ftoh-dyn'
          }
          onEditClick={() => {
            console.log('edit');
          }}
          onCopyClick={() => {
            console.log('copy');
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;
