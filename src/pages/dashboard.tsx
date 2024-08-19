'use client';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format, isAfter, isValid, parse, startOfDay } from 'date-fns';
import React, { useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
  bulkAttendance,
  classesMissedAttendancePercentList,
  getAllCenterAttendance,
  getAttendanceStatus,
  getCohortAttendance,
  markAttendance,
} from '../services/AttendanceService';
import {
  capitalizeEachWord,
  firstLetterInUpperCase,
  formatSelectedDate,
  getDayMonthYearFormat,
  getTodayDate,
  shortDateFormat,
  toPascalCase,
} from '../utils/Helper';
import {
  AttendancePercentageProps,
  CohortAttendancePercentParam,
  ICohort,
  CohortMemberList,
} from '../utils/Interfaces';
import {
  ShowSelfAttendance,
  accessControl,
  dropoutReasons,
  lowLearnerAttendanceLimit,
} from './../../app.config';

import AttendanceComparison from '@/components/AttendanceComparison';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import GuideTour from '@/components/GuideTour';
import MarkBulkAttendance from '@/components/MarkBulkAttendance';
import OverviewCard from '@/components/OverviewCard';
import { showToastMessage } from '@/components/Toastify';
import WeekCalender from '@/components/WeekCalender';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { calculatePercentage } from '@/utils/attendanceStats';
import { logEvent } from '@/utils/googleAnalytics';
import withAccessControl from '@/utils/hoc/withAccessControl';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactGA from 'react-ga4';
import { modifyAttendanceLimit } from '../../app.config';
import calendar from '../assets/images/calendar.svg';
import Header from '../components/Header';
import Loader from '../components/Loader';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
import { Role, attendanceType } from '@/utils/app.constant';
import SelfAttendanceModal from '@/components/SelfAttendanceModal';
import CustomModal from '@/components/CustomModal';
import LocationModal from '@/components/LocationModal';
import { getCohortList } from '@/services/CohortServices';
import CancelIcon from '@mui/icons-material/Cancel'; //absent
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SimpleModal from '@/components/SimpleModal';

interface AttendanceParams {
  allowed: number;
  allow_late_marking: number;
  attendance_ends_at: string;
  can_be_updated?: number;
  capture_geoLocation: number;
  attendance_starts_at: string;
  back_dated_attendance: number;
  restrict_attendance_timings: number;
  back_dated_attendance_allowed_days: number;
}
interface AttendanceData {
  self: AttendanceParams;
  student: AttendanceParams;
}
interface DashboardProps {}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date().setHours(hours, minutes, 0, 0);
};

const formatTimeToHHMM = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const isWithinAttendanceTimeUpdated = (
  attendanceTimes: {
    allow_late_marking?: number;
    restrict_attendance_timings?: number;
    attendance_starts_at?: string | null;
    attendance_ends_at?: string | null;
    can_be_updated?: number;
    back_dated_attendance_allowed_days?: number;
    back_dated_attendance?: number;
  },
  selectedDate?: any,
  attendanceData?: any
) => {
  const now = new Date();

  console.log('attendanceDataUpdated', attendanceData);

  if (
    attendanceData?.[0]?.attendanceId &&
    attendanceTimes?.can_be_updated !== 1
  ) {
    return false;
  }

  const date1 = new Date(now);
  const date2 = new Date(selectedDate);

  const differenceInDays = calculateDateDifference(date1, date2);

  let currentDate = formatSelectedDate(now);
  let currentTimeFormatted = formatTimeToHHMM(now);
  if (currentDate !== selectedDate) {
    if (attendanceTimes?.back_dated_attendance !== 1) {
      return false;
    } else if (
      attendanceTimes?.back_dated_attendance_allowed_days &&
      differenceInDays > attendanceTimes?.back_dated_attendance_allowed_days
    ) {
      return false;
    } else {
      return true;
    }
  } else if (currentDate === selectedDate) {
    if (
      attendanceTimes.restrict_attendance_timings === 1 &&
      (attendanceTimes.attendance_starts_at ||
        attendanceTimes.attendance_ends_at)
    ) {
      if (
        attendanceTimes.attendance_starts_at &&
        currentTimeFormatted < attendanceTimes.attendance_starts_at
      ) {
        return false;
      } else if (
        attendanceTimes.attendance_ends_at &&
        currentTimeFormatted > attendanceTimes.attendance_ends_at &&
        attendanceTimes.allow_late_marking !== 1
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
};

const calculateDateDifference = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays - 1;
};

const checkIsAllowedToShow = (attendanceData: { allowed: number }) => {
  // check role of user is teacher or not

  if (attendanceData) {
    return attendanceData?.allowed === 1;
  }
};

const Dashboard: React.FC<DashboardProps> = () => {
  const { t } = useTranslation();
  const attendacne = [
    { value: attendanceType.PRESENT, label: t('ATTENDANCE.PRESENT') },
    { value: attendanceType.ABSENT, label: t('ATTENDANCE.ABSENT') },
  ];

  const [open, setOpen] = React.useState(false);
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [selectedCohortData, setSelectedCohortData] = React.useState<
    Array<ICohort>
  >([]);

  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const [classId, setClassId] = React.useState('');
  const [showDetails, setShowDetails] = React.useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);
  const [selectedDate, setSelectedDate] =
    React.useState<string>(getTodayDate());
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState<any>(null);
  const [attendanceStats, setAttendanceStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [cohortPresentPercentage, setCohortPresentPercentage] =
    React.useState<string>(t('ATTENDANCE.N/A'));
  const [lowAttendanceLearnerList, setLowAttendanceLearnerList] =
    React.useState<any>(t('ATTENDANCE.N/A'));
  const [startDateRange, setStartDateRange] = React.useState<Date | string>('');
  const [endDateRange, setEndDateRange] = React.useState<Date | string>('');
  const [dateRange, setDateRange] = React.useState<Date | string>('');
  const [allCenterAttendanceData, setAllCenterAttendanceData] =
    React.useState<any>(cohortsData);
  const [isClient, setIsClient] = React.useState(false);
  const router = useRouter();
  const theme = useTheme<any>();
  const determinePathColor = useDeterminePathColor();
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - modifyAttendanceLimit);
  const formattedSevenDaysAgo = shortDateFormat(sevenDaysAgo);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [blockName, setBlockName] = React.useState<string>('');
  const [attendanceData, setAttendanceData] = React.useState<any>([]);
  const [attendanceModelOpen, setIsAttendanceModalOpen] =
    React.useState<boolean>(false);
  const [confirmButtonDisable, setConfirmButtonDisable] =
    React.useState<boolean>(true);
  const [selectedAttendance, setSelectedAttendance] =
    React.useState<string>('');
  const [isLocationModalOpen, setLocationModalOpen] = React.useState(false);
  const [attendanceLocation, setAttendanceLocation] =
    React.useState<GeolocationPosition | null>(null);
  const [data, setData] = React.useState<AttendanceData | null>(null);
  const [role, setRole] = React.useState<any>('');

  const [canMarkAttendanceLerners, setCanMarkAttendanceLerners] =
    React.useState<any>(false);
  const [isAllowedToMarkLearners, setIsAllowedToMarkLearners] =
    React.useState<any>(false);

  const [canMarkAttendanceSelf, setCanMarkAttendanceSelf] =
    React.useState<any>(false);

  const [isAllowedToMarkSelf, setIsAllowedToMarkSelf] =
    React.useState<any>(false);
  // condition for mark attendance for student and self

  const [reasonOfAbsent, setReasonOfAbsent] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setReasonOfAbsent(event.target.value);
  };

  const onCloseEditMOdel = () => {
    setIsAttendanceModalOpen(false);
    setSelectedAttendance('');
    setConfirmButtonDisable(true);
  };
  const handleRadioChange = (value: string) => {
    if (value !== attendanceType.ABSENT) {
      setReasonOfAbsent('');
    }
    setSelectedAttendance(value);
    if (value) {
      setConfirmButtonDisable(false);
    }
  };

  const handleMarkAttendance = (location: GeolocationPosition) => {
    console.log('Marking attendance with:', location);

    if (location) {
      setAttendanceLocation(location);
      setIsAttendanceModalOpen(true);
    }
  };

  const attendanceConfiguration = (selectedDate: any) => {
    const mycohortID = localStorage.getItem('classId');

    console.log('selectedCohortData', selectedCohortData);

    // Find the cohort data that matches the mycohortID
    const selectedCohort = selectedCohortData?.find(
      (cohort) => cohort.cohortId === mycohortID
    );
    if (selectedCohort) {
      const getData = selectedCohort.params;
      if (getData) {
        console.log('getData', getData);

        setData(getData);
      } else {
        setData(null);
      }

      //-----------------set learner data configuration -------------
      const attendanceTimesLearners = getData?.student;
      const canMarkAttendanceLerners1 = attendanceTimesLearners
        ? isWithinAttendanceTimeUpdated(
            attendanceTimesLearners,
            selectedDate,
            attendanceData
          )
        : false;

      setCanMarkAttendanceLerners(canMarkAttendanceLerners1);
      const isAllowedToMarkLearners1 = attendanceTimesLearners
        ? checkIsAllowedToShow(attendanceTimesLearners)
        : false;
      setIsAllowedToMarkLearners(isAllowedToMarkLearners1);

      //---------------set self attendance configuration-------------------------
      const attendanceTimesSelf = getData?.self;
      const canMarkAttendanceSelf1 = attendanceTimesSelf
        ? isWithinAttendanceTimeUpdated(
            attendanceTimesSelf,
            selectedDate,
            attendanceData
          )
        : // && attendanceTimesSelf?.can_be_updated === 1
          false;
      setCanMarkAttendanceSelf(canMarkAttendanceSelf1);

      //check is user role is teacher or not
      const isTeacherRole = role === Role.TEACHER;

      const isAllowedToMarkSelf1 = attendanceTimesSelf
        ? checkIsAllowedToShow(attendanceTimesSelf) && isTeacherRole
        : false;
      setIsAllowedToMarkSelf(isAllowedToMarkSelf1);
    }
  };

  useEffect(() => {
    const getSelectedDate = selectedDate;
    attendanceConfiguration(getSelectedDate);
  }, [selectedCohortData]);

  // handle self attendance
  const handleUpdateAction = async () => {
    setLoading(true);
    // setLocationModalOpen(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showToastMessage(t('COMMON.USER_ID_NOT_FOUND'), 'error');
      return;
    }

    // Prepare data object
    const currentDate = new Date();
    const dateForAttendance = formatSelectedDate(currentDate);

    console.log('attendanceLocation?', attendanceLocation);
    const data = {
      userId: userId,
      attendance: selectedAttendance,
      attendanceDate: selectedDate,
      contextId: classId,
      scope: 'self',
      attendanceLocation,
      absentReason:
        selectedAttendance === attendanceType.ABSENT ? reasonOfAbsent : '',
    };

    try {
      // Call the API to mark attendance
      const response = await markAttendance(data);

      if (response?.statusCode === 201 || response?.statusCode === 200) {
        const { message } = response;
        showToastMessage(message, 'success');
      } else if (response?.response?.data?.statusCode === 400) {
        showToastMessage(response?.response?.data?.errorMessage, 'error');
      } else {
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        console.log('erro');
      }
    } catch (error) {
      console.log('error', error);
      console.error('Error updating attendance:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
      onCloseEditMOdel();
      setSelectedAttendance('');
      fetchData(selectedDate);
      setConfirmButtonDisable(true);
      setSelectedAttendance('');
      setReasonOfAbsent('');
    }
  };
  const fetchData = async (selectedDate: string) => {
    const currentDate = new Date();
    const currentDateForAttendance = formatSelectedDate(currentDate);
    const userId = localStorage.getItem('userId');
    const contextId = localStorage.getItem('classId');
    const limit = 300;
    const page = 0;
    const filters = {
      contextId: contextId,
      userId: userId,
      scope: 'self',
      toDate: selectedDate,
      fromDate: selectedDate,
    };

    try {
      // Await the response from getAttendanceStatus
      const response = await getAttendanceStatus({ limit, page, filters });
      if (response.statusCode === 200) {
        // Update state with attendance data
        setAttendanceData(response?.data?.attendanceList);
      } else {
        // Handle unexpected response status code
        console.error('Unexpected response status:', response.statusCode);
      }
    } catch (error) {
      // Handle any errors that might occur during the fetch
      console.error('Error fetching attendance status:', error);
    }
  };

  useEffect(() => {
    fetchData(selectedDate); // Call the async function
  }, [classId]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchCohorts = async () => {
        try {
          const response = await getCohortList(userId, {
            customField: 'true',
          });

          const getSelectedCohortDetails = response?.find(
            (item: any) => item?.cohortId === classId
          );
          console.log('ResponseCohortDetails:', getSelectedCohortDetails);
          console.log('classId', classId);
        } catch (error) {
          console.log(error);
        }
      };
      fetchCohorts();
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    const calculateDateRange = () => {
      const endRangeDate = new Date();
      endRangeDate.setHours(23, 59, 59, 999);
      const startRangeDate = new Date(endRangeDate);
      startRangeDate.setDate(startRangeDate.getDate() - 6);
      startRangeDate.setHours(0, 0, 0, 0);
      const startDay = startRangeDate.getDate();
      const startDayMonth = startRangeDate.toLocaleString('default', {
        month: 'long',
      });
      const endDay = endRangeDate.getDate();
      const endDayMonth = endRangeDate.toLocaleString('default', {
        month: 'long',
      });
      if (startDayMonth == endDayMonth) {
        setDateRange(`(${startDay}-${endDay} ${endDayMonth})`);
      } else {
        setDateRange(`(${startDay} ${startDayMonth}-${endDay} ${endDayMonth})`);
      }

      setStartDateRange(shortDateFormat(startRangeDate));
      setEndDateRange(shortDateFormat(endRangeDate));
    };

    calculateDateRange();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setRole(role);
      const storedUserId = localStorage.getItem('userId');
      setClassId(localStorage.getItem('classId') ?? '');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setUserId(storedUserId);
    }
  }, []);

  //API for getting student list
  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (classId && classId !== 'all') {
          const limit = 300;
          const page = 0;
          const filters = { cohortId: classId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.userDetails;
          if (resp) {
            const nameUserIdArray = resp?.map((entry: any) => ({
              userId: entry.userId,
              name: toPascalCase(entry.name),
            }));
            if (nameUserIdArray) {
              //Logic to call class missed api
              const fromDate = startDateRange;
              const toDate = endDateRange;
              const filters = {
                contextId: classId,
                fromDate,
                toDate,
                scope: 'student',
              };
              const response = await classesMissedAttendancePercentList({
                filters,
                facets: ['userId'],
                sort: ['absent_percentage', 'asc'],
              });
              const resp = response?.data?.result?.userId;
              if (resp) {
                const filteredData = Object.keys(resp).map((userId) => ({
                  userId,
                  absent: resp[userId].absent,
                  present_percent: resp[userId].present_percentage,
                }));
                if (filteredData) {
                  let mergedArray = filteredData.map((attendance) => {
                    const user = nameUserIdArray.find(
                      (user: { userId: string }) =>
                        user.userId === attendance.userId
                    );
                    return Object.assign({}, attendance, {
                      name: user ? user.name : 'Unknown',
                    });
                  });
                  mergedArray = mergedArray.filter(
                    (item) => item.name !== 'Unknown'
                  );
                  const studentsWithLowestAttendance = mergedArray.filter(
                    (user) =>
                      user.absent &&
                      (user.present_percent < lowLearnerAttendanceLimit ||
                        user.present_percent === undefined)
                  );

                  // Extract names of these students
                  if (studentsWithLowestAttendance.length) {
                    const namesOfLowestAttendance: any[] =
                      studentsWithLowestAttendance.map(
                        (student) => student.name
                      );
                    setLowAttendanceLearnerList(namesOfLowestAttendance);
                  } else {
                    setLowAttendanceLearnerList([]);
                  }
                }
              }
            }
          }
          if (classId) {
            const cohortAttendancePercent = async () => {
              const cohortAttendanceData: CohortAttendancePercentParam = {
                limit: 0,
                page: 0,
                filters: {
                  scope: 'student',
                  fromDate: startDateRange,
                  toDate: endDateRange,
                  contextId: classId,
                },
                facets: ['contextId'],
                sort: ['present_percentage', 'asc'],
              };
              const res = await getCohortAttendance(cohortAttendanceData);
              const response = res?.data?.result;
              const contextData = response?.contextId?.[classId];
              if (contextData?.present_percentage) {
                const presentPercent = contextData?.present_percentage;
                setCohortPresentPercentage(presentPercent);
              } else if (contextData?.absent_percentage) {
                setCohortPresentPercentage('0');
              } else {
                setCohortPresentPercentage(t('ATTENDANCE.N/A'));
              }
            };
            cohortAttendancePercent();
          }
        } else if (classId && classId === 'all' && cohortsData) {
          const cohortIds = cohortsData.map((cohort) => cohort.cohortId);
          const limit = 300;
          const page = 0;
          const facets = ['contextId'];

          const fetchAttendanceData = async (cohortIds: any[]) => {
            const fetchPromises = cohortIds.map(async (cohortId) => {
              const filters = {
                fromDate: startDateRange,
                toDate: endDateRange,
                scope: 'student',
                contextId: cohortId,
              };
              // console.log('Filters:', filters);

              try {
                const response = await getAllCenterAttendance({
                  limit,
                  page,
                  filters,
                  facets,
                });
                return { cohortId, data: response?.data?.result };
              } catch (error) {
                console.error(
                  `Error fetching data for cohortId ${cohortId}:`,
                  error
                );
                showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
                return { cohortId, error };
              }
            });

            try {
              const results = await Promise.all(fetchPromises);
              console.log('Fetched data:', results);

              const nameIDAttendanceArray = results
                .filter((result) => !result?.error && result?.data?.contextId)
                .map((result) => {
                  const cohortId = result?.cohortId;
                  const contextData = result?.data?.contextId[cohortId] || {};
                  const presentPercentage =
                    contextData.present_percentage || null;
                  const absentPercentage = contextData?.absent_percentage
                    ? 100 - contextData?.absent_percentage
                    : null;
                  const percentage = presentPercentage || absentPercentage;

                  const cohortItem = cohortsData.find(
                    (cohort) => cohort?.cohortId === cohortId
                  );

                  return {
                    userId: cohortId,
                    name: cohortItem ? cohortItem.name : null,
                    presentPercentage: percentage,
                  };
                })
                .filter((item) => item.presentPercentage !== null); // Filter out items with no valid percentage

              // console.log('Filtered and merged data:', nameIDAttendanceArray);
              setAllCenterAttendanceData(nameIDAttendanceArray);
            } catch (error) {
              console.error('Error fetching attendance data:', error);
              showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
            }
          };

          fetchAttendanceData(cohortIds);
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
  }, [classId, selectedDate, handleSaveHasRun]);

  const showDetailsHandle = (dayStr: string) => {
    fetchData(formatSelectedDate(dayStr));
    setSelectedDate(formatSelectedDate(dayStr));
    attendanceConfiguration(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const handleModalToggle = () => {
    setOpen(!open);
    logEvent({
      action: 'mark/modify-attendance-button-clicked-dashboard',
      category: 'Dashboard Page',
      label: 'Mark/ Modify Attendance',
    });
  };

  const getMonthName = (dateString: string) => {
    try {
      const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        throw new Error('Invalid Date');
      }
      localStorage.setItem('selectedMonth', parsedDate.toISOString());
      return format(parsedDate, 'MMMM');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const getAttendanceStats = async () => {
      if (classId !== '' && classId !== 'all') {
        const cohortMemberRequest: CohortMemberList = {
          limit: 300,
          page: 0,
          filters: {
            cohortId: classId,
            role: 'Student',
          },
        };
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const diffToMonday =
          currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStartDate = new Date(currentDate.setDate(diffToMonday));
        const startDate = new Date(
          currentDate.setDate(currentDate.getDate() - 30)
        );
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(weekStartDate);
        endDate.setDate(weekStartDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        const fromDateFormatted = shortDateFormat(startDate);
        const toDateFormatted = shortDateFormat(endDate);
        const attendanceRequest: AttendancePercentageProps = {
          limit: 300,
          page: 0,
          filters: {
            contextId: classId,
            fromDate: fromDateFormatted,
            toDate: toDateFormatted,
            scope: 'student',
          },
          facets: ['attendanceDate'],
        };
        const attendanceStats = await calculatePercentage(
          cohortMemberRequest,
          attendanceRequest,
          selectedDate
        );
        setPercentageAttendanceData(attendanceStats);

        setAttendanceStats(attendanceStats);
        console.log('attendanceStats', attendanceStats);
      }
    };
    getAttendanceStats();
  }, [classId && classId !== 'all', selectedDate, handleSaveHasRun]);

  const viewAttendanceHistory = () => {
    if (classId !== 'all') {
      router.push('/attendance-history');
      ReactGA.event('month-name-clicked', { selectedCohortID: classId });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const todayDate = getTodayDate();

  let currentAttendance = attendanceStats?.[todayDate] || 'notMarked';
  const isFutureDateWithoutTime = (date: Date | string) => {
    const today = startOfDay(new Date());
    date = startOfDay(new Date(date));
    return isAfter(date, today);
  };

  if (selectedDate) {
    if (isFutureDateWithoutTime(selectedDate)) {
      currentAttendance = 'futureDate';
    } else {
      currentAttendance = attendanceStats?.[selectedDate] || 'notMarked';
    }
  }
  const presentPercentage = parseFloat(currentAttendance?.present_percentage);
  const pathColor = determinePathColor(presentPercentage);

  const handleMoreDetailsClicked = () => {
    logEvent({
      action: 'more-details-button-clicked',
      category: 'Dashboard Page',
      label: 'More Details Link Clicked',
    });
  };
  let hasSeenTutorial = false;
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedValue = localStorage.getItem('hasSeenTutorial');
    if (storedValue !== null) {
      hasSeenTutorial = storedValue === 'true'; // Convert string 'true' or 'false' to boolean
    }
  }
  return (
    <>
      {isClient && (
        <>
          <GuideTour />
          <>
            {!isAuthenticated && (
              <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
            )}

            {isAuthenticated && (
              <Box minHeight="100vh">
                <Box>
                  <Header />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    display={'flex'}
                    width={'100%'}
                    sx={{ backgroundColor: 'white' }}
                  >
                    <Typography
                      textAlign={'left'}
                      fontSize={'22px'}
                      m={'1.5rem 1.2rem 0.8rem'}
                      color={theme?.palette?.warning['300']}
                      className="joyride-step-1"
                    >
                      {t('DASHBOARD.DASHBOARD')}
                    </Typography>
                  </Box>
                </Box>
                {loading && (
                  <Loader
                    showBackdrop={true}
                    loadingText={t('COMMON.LOADING')}
                  />
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    paddingBottom={'25px'}
                    width={'100%'}
                    className="linerGradient br-md-8"
                  >
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      padding={'1.5rem 1.2rem 1rem'}
                    >
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Box className="d-md-flex flex-basis-md-90 min-align-md-center space-md-between w-100">
                          <Typography
                            variant="h2"
                            sx={{ fontSize: '14px' }}
                            color={'black'}
                            fontWeight={'500'}
                          >
                            {t('DASHBOARD.DAY_WISE_ATTENDANCE')}
                          </Typography>
                          <CohortSelectionSection
                            classId={classId}
                            setClassId={setClassId}
                            userId={userId}
                            setUserId={setUserId}
                            isAuthenticated={isAuthenticated}
                            setIsAuthenticated={setIsAuthenticated}
                            loading={loading}
                            setLoading={setLoading}
                            cohortsData={cohortsData}
                            setCohortsData={setCohortsData}
                            // selectedCohortsData={selectedCohortData}
                            setSelectedCohortsData={setSelectedCohortData}
                            manipulatedCohortData={manipulatedCohortData}
                            setManipulatedCohortData={setManipulatedCohortData}
                            blockName={blockName}
                            setBlockName={setBlockName}
                            handleSaveHasRun={handleSaveHasRun}
                            setHandleSaveHasRun={setHandleSaveHasRun}
                            isCustomFieldRequired={false}
                          />
                        </Box>

                        <Box
                          // mb={4}
                          className="calenderTitle flex-center joyride-step-2 ps-md-ab right-md-20"
                          display={'flex'}
                          sx={{
                            cursor: 'pointer',
                            color: theme.palette.secondary.main,
                            gap: '4px',
                            opacity: classId === 'all' ? 0.5 : 1,
                          }}
                          onClick={viewAttendanceHistory}
                        >
                          <Typography
                            marginBottom={'0'}
                            style={{ fontWeight: '500' }}
                          >
                            {getMonthName(selectedDate)}
                          </Typography>
                          {/* <CalendarMonthIcon /> */}
                          <Image
                            height={18}
                            width={18}
                            src={calendar}
                            alt="logo"
                            style={{ cursor: 'pointer' }}
                          />
                        </Box>
                      </Box>

                      {/* Logic to disable this block on all select */}
                      <Box className="flex-basis-md-10">
                        <Box sx={{ mt: 1.5, position: 'relative' }}>
                          <WeekCalender
                            showDetailsHandle={showDetailsHandle}
                            data={percentageAttendanceData}
                            disableDays={classId === 'all'}
                            classId={classId}
                          />
                        </Box>
                        <Grid container spacing={1}>
                          {isAllowedToMarkLearners && (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              // sx={{
                              //   opacity: classId === 'all' ? 0.5 : 1,
                              // }}
                            >
                              <Box
                                height={'auto'}
                                width={'auto'}
                                padding={'1rem'}
                                borderRadius={'1rem'}
                                bgcolor={'#4A4640'}
                                textAlign={'left'}
                                margin={'15px 0 15px 0 '}
                                sx={{ opacity: classId === 'all' ? 0.5 : 1 }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  // marginTop={1}
                                  justifyContent={'space-between'}
                                  alignItems={'center'}
                                >
                                  <Box
                                    display={'flex'}
                                    gap={'5px'}
                                    alignItems={'center'}
                                    className="joyride-step-3"
                                  >
                                    {currentAttendance !== 'notMarked' &&
                                      currentAttendance !== 'futureDate' && (
                                        <>
                                          <CircularProgressbar
                                            value={
                                              currentAttendance?.present_percentage
                                            }
                                            background
                                            backgroundPadding={8}
                                            styles={buildStyles({
                                              textColor: pathColor,
                                              pathColor: pathColor,
                                              trailColor: '#E6E6E6',
                                              strokeLinecap: 'round',
                                              backgroundColor: '#ffffff',
                                            })}
                                            className="fs-24 htw-24"
                                            strokeWidth={20}
                                          />
                                          <Box>
                                            <Typography
                                              // sx={{ color: theme.palette.warning['A400'] }}
                                              sx={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#F4F4F4',
                                              }}
                                              variant="h6"
                                              className="word-break"
                                            >
                                              {t(
                                                'DASHBOARD.PERCENT_ATTENDANCE',
                                                {
                                                  percent_students:
                                                    currentAttendance?.present_percentage,
                                                }
                                              )}
                                            </Typography>
                                            <Typography
                                              // sx={{ color: theme.palette.warning['A400'] }}
                                              sx={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#F4F4F4',
                                              }}
                                              variant="h6"
                                              className="word-break"
                                            >
                                              {t('DASHBOARD.PRESENT_STUDENTS', {
                                                present_students:
                                                  currentAttendance?.present_students,
                                                total_students:
                                                  currentAttendance?.totalcount,
                                              })}
                                            </Typography>
                                          </Box>
                                        </>
                                      )}
                                    {currentAttendance === 'notMarked' &&
                                      currentAttendance !== 'futureDate' && (
                                        <Typography
                                          sx={{
                                            color:
                                              theme.palette.warning['A400'],
                                          }}
                                          fontSize={'0.8rem'}
                                          // variant="h6"
                                          // className="word-break"
                                        >
                                          {t('DASHBOARD.NOT_MARKED_STUDENT')}
                                        </Typography>
                                      )}
                                    {currentAttendance === 'futureDate' && (
                                      <Typography
                                        sx={{
                                          color: theme.palette.warning['A400'],
                                        }}
                                        fontSize={'0.8rem'}
                                        fontStyle={'italic'}
                                        fontWeight={'500'}
                                      >
                                        {t('DASHBOARD.FUTURE_DATE_CANT_MARK')}
                                      </Typography>
                                    )}
                                  </Box>
                                  <Button
                                    className="joyride-step-4 btn-mark-width"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      '&.Mui-disabled': {
                                        backgroundColor:
                                          theme?.palette?.primary?.main, // Custom disabled text color
                                      },
                                      minWidth: '84px',
                                      height: '2.5rem',
                                      padding: theme.spacing(1),
                                      fontWeight: '500',
                                      '@media (min-width: 500px)': {
                                        width: '20%',
                                      },
                                      '@media (min-width: 700px)': {
                                        width: '15%',
                                      },
                                    }}
                                    onClick={handleModalToggle}
                                    disabled={
                                      !canMarkAttendanceLerners
                                      // ||
                                      // currentAttendance === 'futureDate' ||
                                      // classId === 'all' ||
                                      // formattedSevenDaysAgo > selectedDate
                                    }
                                  >
                                    {currentAttendance === 'notMarked' ||
                                    currentAttendance === 'futureDate'
                                      ? t('COMMON.MARK_TO_LEARNER')
                                      : t('COMMON.MODIFY_FOR_LEARNER')}
                                  </Button>
                                </Stack>
                              </Box>
                            </Grid>
                          )}
                          {ShowSelfAttendance && isAllowedToMarkSelf && (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={6}
                              // sx={{
                              //   opacity: classId === 'all' ? 0.5 : 1,
                              // }}
                            >
                              <Box
                                height={'auto'}
                                width={'auto'}
                                padding={'1rem'}
                                borderRadius={'1rem'}
                                bgcolor={'#4A4640'}
                                textAlign={'left'}
                                margin={'15px 0 15px 0 '}
                                sx={{ opacity: classId === 'all' ? 0.5 : 1 }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  // marginTop={1}
                                  justifyContent={'space-between'}
                                  alignItems={'center'}
                                >
                                  <Box
                                    display={'flex'}
                                    gap={'5px'}
                                    alignItems={'center'}
                                    className="joyride-step-3"
                                  >
                                    {attendanceData?.length > 0 ? (
                                      <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                      >
                                        <Typography
                                          sx={{
                                            color:
                                              theme.palette.warning['A400'],
                                          }}
                                          fontSize={'0.9rem'}
                                          // variant="h6"
                                          // className="word-break"
                                        >
                                          {firstLetterInUpperCase(
                                            attendanceData?.[0]?.attendance
                                          )}
                                        </Typography>
                                        {attendanceData?.[0]?.attendance ===
                                        attendanceType.PRESENT ? (
                                          <CheckCircleIcon
                                            fontSize="small"
                                            color="success"
                                            style={{
                                              fill: theme.palette.success.main,
                                              marginLeft: '4px',
                                            }}
                                          />
                                        ) : (
                                          <CancelIcon
                                            fontSize="small"
                                            // color="error"
                                            style={{
                                              fill: theme.palette.error.main,
                                              marginLeft: '4px',
                                            }}
                                          />
                                        )}
                                      </Box>
                                    ) : (
                                      <Typography
                                        sx={{
                                          color: theme.palette.warning['A400'],
                                        }}
                                        fontSize={'0.8rem'}
                                        // variant="h6"
                                        // className="word-break"
                                      >
                                        {t('DASHBOARD.NOT_MARKED_SELF')}
                                      </Typography>
                                    )}
                                    {/* {currentAttendance !== 'notMarked' &&
                                  currentAttendance !== 'futureDate' && (
                                    <>
                                      <CircularProgressbar
                                        value={
                                          currentAttendance?.present_percentage
                                        }
                                        background
                                        backgroundPadding={8}
                                        styles={buildStyles({
                                          textColor: pathColor,
                                          pathColor: pathColor,
                                          trailColor: '#E6E6E6',
                                          strokeLinecap: 'round',
                                          backgroundColor: '#ffffff',
                                        })}
                                        className="fs-24 htw-24"
                                        strokeWidth={20}
                                      />
                                      <Box>
                                        <Typography
                                          // sx={{ color: theme.palette.warning['A400'] }}
                                          sx={{
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#F4F4F4',
                                          }}
                                          variant="h6"
                                          className="word-break"
                                        >
                                          {t('DASHBOARD.PERCENT_ATTENDANCE', {
                                            percent_students:
                                              currentAttendance?.present_percentage,
                                          })}
                                        </Typography>
                                        <Typography
                                          // sx={{ color: theme.palette.warning['A400'] }}
                                          sx={{
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#F4F4F4',
                                          }}
                                          variant="h6"
                                          className="word-break"
                                        >
                                          {t('DASHBOARD.PRESENT_STUDENTS', {
                                            present_students:
                                              currentAttendance?.present_students,
                                            total_students:
                                              currentAttendance?.totalcount,
                                          })}
                                        </Typography>
                                      </Box>
                                    </>
                                  )} */}
                                    {/* {currentAttendance === 'notMarked' &&
                                  currentAttendance !== 'futureDate' && (
                                    <Typography
                                      sx={{
                                        color: theme.palette.warning['A400'],
                                      }}
                                      fontSize={'0.8rem'}
                                      // variant="h6"
                                      // className="word-break"
                                    >
                                      {t('DASHBOARD.NOT_MARKED_SELF')}
                                    </Typography>
                                  )}
                                {currentAttendance === 'futureDate' && (
                                  <Typography
                                    sx={{
                                      color: theme.palette.warning['A400'],
                                    }}
                                    fontSize={'0.8rem'}
                                    fontStyle={'italic'}
                                    fontWeight={'500'}
                                  >
                                    {t('DASHBOARD.FUTURE_DATE_CANT_MARK')}
                                  </Typography>
                                )} */}
                                  </Box>
                                  <Button
                                    className="joyride-step-4 btn-mark-width"
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                      '&.Mui-disabled': {
                                        backgroundColor:
                                          theme?.palette?.primary?.main, // Custom disabled text color
                                      },
                                      minWidth: '84px',
                                      height: '2.5rem',
                                      padding: theme.spacing(1),
                                      fontWeight: '500',
                                      '@media (min-width: 500px)': {
                                        width: '20%',
                                      },
                                      '@media (min-width: 700px)': {
                                        width: '15%',
                                      },
                                    }}
                                    onClick={() => {
                                      if (attendanceLocation) {
                                        handleMarkAttendance(
                                          attendanceLocation
                                        );
                                      } else {
                                        setLocationModalOpen(true);
                                      }
                                    }}
                                    disabled={
                                      !canMarkAttendanceSelf
                                      // ||
                                      // currentAttendance === 'futureDate' ||
                                      // classId === 'all' ||
                                      // formattedSevenDaysAgo > selectedDate
                                    }
                                  >
                                    {attendanceData?.[0]?.attendance ===
                                      attendanceType.PRESENT ||
                                    attendanceData?.[0]?.attendance ===
                                      attendanceType.ABSENT
                                      ? t('COMMON.MODIFY_FOR_SELF')
                                      : t('COMMON.MARK_TO_SELF')}
                                    {/* {currentAttendance === 'notMarked' ||
                                currentAttendance === 'futureDate'
                                  ? t('COMMON.MARK_TO_SELF')
                                  : t('COMMON.MODIFY_FOR_SELF')} */}
                                  </Button>
                                </Stack>
                              </Box>
                            </Grid>
                          )}
                          {open && (
                            <MarkBulkAttendance
                              open={open}
                              onClose={handleClose}
                              classId={classId}
                              selectedDate={new Date(selectedDate)}
                              onSaveSuccess={(isModified) => {
                                if (isModified) {
                                  showToastMessage(
                                    t(
                                      'ATTENDANCE.ATTENDANCE_MODIFIED_SUCCESSFULLY'
                                    ),
                                    'success'
                                  );
                                } else {
                                  showToastMessage(
                                    t(
                                      'ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY'
                                    ),
                                    'success'
                                  );
                                }
                                setHandleSaveHasRun(!handleSaveHasRun);
                              }}
                            />
                          )}
                          <SimpleModal
                            open={attendanceModelOpen}
                            onClose={onCloseEditMOdel}
                            showFooter={true}
                            modalTitle={t('COMMON.ATTENDANCE')}
                            // primaryText={'Cancel'}
                            primaryText={'Mark'}
                            // primaryActionHandler={onCloseEditMOdel}
                            primaryBtnDisabled={confirmButtonDisable}
                            primaryActionHandler={handleUpdateAction}
                            subtitle={getDayMonthYearFormat(
                              shortDateFormat(new Date(selectedDate))
                            )}
                          >
                            <Box padding={'0 1rem'}>
                              {attendacne?.map((option) => (
                                <React.Fragment key={option.value}>
                                  <Box
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                  >
                                    <Typography
                                      variant="h2"
                                      sx={{
                                        color: theme.palette.warning['A200'],
                                        fontSize: '14px',
                                      }}
                                      component="h2"
                                    >
                                      {option.label}
                                    </Typography>

                                    <Radio
                                      sx={{ pb: '20px' }}
                                      onChange={() =>
                                        handleRadioChange(option.value)
                                      }
                                      value={option.value}
                                      checked={
                                        selectedAttendance === option.value
                                      }
                                    />
                                  </Box>
                                </React.Fragment>
                              ))}
                              {selectedAttendance === attendanceType.ABSENT && (
                                <Box sx={{ padding: '10px 18px' }}>
                                  <FormControl sx={{ mt: 1, width: '100%' }}>
                                    <InputLabel
                                      sx={{
                                        fontSize: '16px',
                                        color: theme.palette.warning['300'],
                                      }}
                                      id="demo-multiple-name-label"
                                    >
                                      {t('COMMON.REASON_FOR_DROPOUT')}
                                    </InputLabel>
                                    <Select
                                      labelId="demo-multiple-name-label"
                                      id="demo-multiple-name"
                                      input={
                                        <OutlinedInput label="Reason for Dropout" />
                                      }
                                      onChange={handleChange}
                                    >
                                      {dropoutReasons?.map((reason) => (
                                        <MenuItem
                                          key={reason.value}
                                          value={reason.value}
                                          sx={{
                                            fontSize: '16px',
                                            color: theme.palette.warning['300'],
                                          }}
                                        >
                                          {reason.label
                                            .replace(/_/g, ' ')
                                            .toLowerCase()
                                            .replace(/^\w/, (c) =>
                                              c.toUpperCase()
                                            )}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Box>
                              )}
                            </Box>
                          </SimpleModal>

                          {/* <CustomModal
                            open={attendanceModelOpen}
                            handleClose={onCloseEditMOdel}
                            title={t('COMMON.ATTENDANCE')}
                            subtitle={getDayMonthYearFormat(
                              shortDateFormat(new Date(selectedDate))
                            )}
                            primaryBtnText={t('COMMON.SELF_ATTENDANCE')}
                            secondaryBtnText="Cancel"
                            primaryBtnClick={handleUpdateAction}
                            primaryBtnDisabled={confirmButtonDisable}
                            secondaryBtnClick={onCloseEditMOdel}
                          >
                            <Box padding={'0 1rem'}>
                              {attendacne?.map((option) => (
                                <React.Fragment key={option.value}>
                                  <Box
                                    display={'flex'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                  >
                                    <Typography
                                      variant="h2"
                                      sx={{
                                        color: theme.palette.warning['A200'],
                                        fontSize: '14px',
                                      }}
                                      component="h2"
                                    >
                                      {option.label}
                                    </Typography>

                                    <Radio
                                      sx={{ pb: '20px' }}
                                      onChange={() =>
                                        handleRadioChange(option.value)
                                      }
                                      value={option.value}
                                      checked={
                                        selectedAttendance === option.value
                                      }
                                    />
                                  </Box>
                                  <Divider />
                                </React.Fragment>
                              ))}
                            </Box>
                          </CustomModal> */}

                          <LocationModal
                            isOpen={isLocationModalOpen}
                            onClose={() => setLocationModalOpen(false)}
                            onConfirm={(location: any) => {
                              handleMarkAttendance(location);
                              setLocationModalOpen(false);
                            }}
                          />
                          {/* <ConfirmationModal
                            message={t('COMMON.SURE_REMOVE')}
                            handleAction={handleAction}
                            buttonNames={{
                              primary: t('COMMON.YES'),
                              secondary: t('COMMON.NO_GO_BACK'),
                            }}
                            handleCloseModal={handleCloseModal}
                            modalOpen={confirmationModalOpen}
                          /> */}
                        </Grid>
                      </Box>
                    </Box>
                    <Box sx={{ padding: '0 20px' }}>
                      <Divider sx={{ borderBottomWidth: '0.1rem' }} />
                    </Box>

                    {/* Overview Card Section */}
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      gap={'1rem'}
                      padding={'1rem 1.2rem'}
                    >
                      <Stack
                        direction={'row'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        padding={'2px'}
                      >
                        <Box width="100%">
                          <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            width="100%"
                          >
                            <Typography
                              variant="h2"
                              sx={{
                                color: theme.palette.warning['300'],
                                fontSize: '14px',
                                fontWeight: '500',
                              }}
                            >
                              {t('DASHBOARD.OVERVIEW')}
                            </Typography>
                            <Box
                              display={'flex'}
                              justifyContent={'center'}
                              alignItems={'center'}
                              sx={{ color: theme.palette.secondary.main }}
                            >
                              <Link
                                className="flex-center fs-14 text-decoration"
                                href={'/attendance-overview'}
                                style={{
                                  color: theme.palette.secondary.main,
                                  fontWeight: '500',
                                }}
                                onClick={handleMoreDetailsClicked}
                              >
                                {t('DASHBOARD.MORE_DETAILS')}
                                <ArrowForwardSharpIcon
                                  sx={{ height: '18px' }}
                                />
                              </Link>
                            </Box>
                          </Box>
                          <Typography
                            sx={{
                              color: theme.palette.warning['400'],
                              fontSize: '12px !important',
                              fontWeight: '500',
                            }}
                            variant="h2"
                          >
                            {t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
                              date_range: dateRange,
                            })}
                          </Typography>
                        </Box>
                      </Stack>
                      {loading && (
                        <Loader
                          showBackdrop={true}
                          loadingText={t('COMMON.LOADING')}
                        />
                      )}
                    </Box>
                    <Box
                      display={'flex'}
                      className="card_overview"
                      mx={'1.2rem'}
                    >
                      {classId &&
                      classId !== 'all' &&
                      cohortsData &&
                      lowAttendanceLearnerList ? (
                        <Grid container spacing={2}>
                          <Grid item xs={4} className={'joyride-step-5'}>
                            <OverviewCard
                              label={t('ATTENDANCE.CENTER_ATTENDANCE')}
                              value={
                                cohortPresentPercentage === t('ATTENDANCE.N/A')
                                  ? cohortPresentPercentage
                                  : `${cohortPresentPercentage} %`
                              }
                            />
                          </Grid>
                          <Grid item xs={8} className={'joyride-step-6'}>
                            <OverviewCard
                              label={t('ATTENDANCE.LOW_ATTENDANCE_STUDENTS')}
                              {...(loading && (
                                <Loader
                                  loadingText={t('COMMON.LOADING')}
                                  showBackdrop={false}
                                />
                              ))}
                              valuePartOne={
                                Array.isArray(lowAttendanceLearnerList) &&
                                lowAttendanceLearnerList.length > 2
                                  ? `${lowAttendanceLearnerList[0]}, ${lowAttendanceLearnerList[1]}`
                                  : lowAttendanceLearnerList.length === 2
                                    ? `${lowAttendanceLearnerList[0]}, ${lowAttendanceLearnerList[1]}`
                                    : lowAttendanceLearnerList.length === 1
                                      ? `${lowAttendanceLearnerList[0]}`
                                      : Array.isArray(
                                            lowAttendanceLearnerList
                                          ) &&
                                          lowAttendanceLearnerList.length === 0
                                        ? t(
                                            'ATTENDANCE.NO_LEARNER_WITH_LOW_ATTENDANCE'
                                          )
                                        : t('ATTENDANCE.N/A')
                              }
                              valuePartTwo={
                                Array.isArray(lowAttendanceLearnerList) &&
                                lowAttendanceLearnerList.length > 2
                                  ? `${t('COMMON.AND')} ${lowAttendanceLearnerList.length - 2} ${t('COMMON.MORE')}`
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={2}>
                          {allCenterAttendanceData.map(
                            (item: {
                              cohortId: React.Key | null | undefined;
                              name: string;
                              presentPercentage: number;
                            }) => (
                              <Grid item xs={6} key={item.cohortId}>
                                <OverviewCard
                                  label={item.name}
                                  value={`${item.presentPercentage} %`}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}
                    </Box>
                  </Box>
                </Box>
                {role === Role.TEAM_LEADER && (
                  <Box p={2}>
                    <AttendanceComparison blockName={blockName} />
                  </Box>
                )}
                {/* <Box sx={{ background: '#fff' }}>
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
          </Box> */}
              </Box>
            )}
          </>
        </>
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

export default withAccessControl('accessDashboard', accessControl)(Dashboard);
