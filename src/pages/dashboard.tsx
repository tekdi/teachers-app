'use client';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { format, isAfter, isValid, parse, startOfDay } from 'date-fns';
import React, { ComponentType, useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import {
  classesMissedAttendancePercentList,
  getAllCenterAttendance,
  getCohortAttendance,
} from '../services/AttendanceService';
import {
  formatSelectedDate,
  getAfterDate,
  getBeforeDate,
  getLatestEntries,
  getTodayDate,
  shortDateFormat,
  sortSessions,
  toPascalCase,
} from '../utils/Helper';
import {
  AttendancePercentageProps,
  CohortAttendancePercentParam,
  CohortMemberList,
  CustomField,
  ICohort,
  Session,
} from '../utils/Interfaces';
import {
  AttendanceAPILimit,
  accessControl,
  dashboardDaysLimit,
  eventDaysLimit,
  lowLearnerAttendanceLimit,
} from './../../app.config';

import AttendanceComparison from '@/components/AttendanceComparison';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import GuideTour from '@/components/GuideTour';
import MarkBulkAttendance from '@/components/MarkBulkAttendance';
import OverviewCard from '@/components/OverviewCard';
import { showToastMessage } from '@/components/Toastify';
import WeekCalender from '@/components/WeekCalender';
import { getEventList } from '@/services/EventService';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import {
  QueryKeys,
  Role,
  Status,
  Telemetry,
  sessionType
} from '@/utils/app.constant';
import { calculatePercentage } from '@/utils/attendanceStats';
import { logEvent } from '@/utils/googleAnalytics';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { telemetryFactory } from '@/utils/telemetry';
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

import { fetchAttendanceDetails } from '@/components/AttendanceDetails';
import CentralizedModal from '@/components/CentralizedModal';
import { getCohortDetails, getCohortList } from '@/services/CohortServices';
import { getUserDetails } from '@/services/ProfileService';
import taxonomyStore from '@/store/taxonomyStore';
import { updateStoreFromCohorts } from '@/utils/Helper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useQueryClient } from '@tanstack/react-query';
import { useDirection } from '../hooks/useDirection';

import useStore from '@/store/store';
import dynamic from 'next/dynamic';
import { isEliminatedFromBuild } from '../../featureEliminationUtil';
import useEventDates from './../hooks/useEventDates';

let SessionCardFooter: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCardFooter', 'component')) {
  SessionCardFooter = dynamic(() => import('@/components/SessionCardFooter'), {
    ssr: false,
  });
}
let SessionCard: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCard', 'component')) {
  SessionCard = dynamic(() => import('@/components/SessionCard'), {
    ssr: false,
  });
}

interface DashboardProps { }
const Dashboard: React.FC<DashboardProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { isRTL } = useDirection();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;

  const [open, setOpen] = React.useState(false);
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const [classId, setClassId] = React.useState('');
  const [showDetails, setShowDetails] = React.useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);
  const [selectedDate, setSelectedDate] =
    React.useState<string>(getTodayDate());
  const [timeTableDate, setTimeTableDate] =
    React.useState<string>(getTodayDate());
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState<any>(null);
  const [attendanceStats, setAttendanceStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [cohortPresentPercentage, setCohortPresentPercentage] =
    React.useState<string>(t('ATTENDANCE.NO_ATTENDANCE'));
  const [lowAttendanceLearnerList, setLowAttendanceLearnerList] =
    React.useState<any>(t('ATTENDANCE.NO_LEARNER_WITH_LOW_ATTENDANCE'));
  const [startDateRange, setStartDateRange] = React.useState<Date | string>('');
  const [endDateRange, setEndDateRange] = React.useState<Date | string>('');
  const [dateRange, setDateRange] = React.useState<Date | string>('');
  const [allCenterAttendanceData, setAllCenterAttendanceData] =
    React.useState<any>(cohortsData);
  const router = useRouter();
  const theme = useTheme<any>();
  const determinePathColor = useDeterminePathColor();
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - modifyAttendanceLimit);
  const formattedSevenDaysAgo = shortDateFormat(sevenDaysAgo);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [blockName, setBlockName] = React.useState<string>('');
  const [role, setRole] = React.useState<any>('');
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const [sessions, setSessions] = React.useState<Session[]>();
  const [extraSessions, setExtraSessions] = React.useState<Session[]>();
  const [myCohortList, setMyCohortList] = React.useState<any>();
  const [centralizedModal, setCentralizedModal] = useState(false);
  const [showCentralisedModal, setShowCentralisedModal] = useState(false);
  const [cohortType, setCohortType] = React.useState<string>();
  const [medium, setMedium] = React.useState<string>();
  const [grade, setGrade] = React.useState<string>();
  const [board, setBoard] = React.useState<string>();
  const [state, setState] = React.useState<string>();
  const [eventDeleted, setEventDeleted] = React.useState(false);
  const [eventUpdated, setEventUpdated] = React.useState(false);
  const setType = taxonomyStore((state) => state.setType);
  const [attendanceData, setAttendanceData] = useState({
    cohortMemberList: [],
    presentCount: 0,
    absentCount: 0,
    numberOfCohortMembers: 0,
    dropoutMemberList: [],
    dropoutCount: 0,
    bulkAttendanceStatus: '',
  });

  const handleAttendanceDataUpdate = (data: any) => {
    setAttendanceData(data);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
    if (showCentralisedModal && !newOpen) {
      setCentralizedModal(true);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const skipResetPassword = localStorage.getItem('skipResetPassword');
      const temporaryPassword = localStorage.getItem('temporaryPassword');
      setType('');

      if (temporaryPassword === 'true' && skipResetPassword !== 'true') {
        setShowCentralisedModal(true);
      }
    }

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
    if (cohortsData[0]?.cohortId) {
      localStorage.setItem('classId', cohortsData[0]?.cohortId);
      localStorage.removeItem('overallCommonSubjects');
    } else {
      localStorage.setItem('classId', '');
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setRole(role);
      const storedUserId = localStorage.getItem('userId');
      setClassId(localStorage.getItem('classId') ?? '');
      if (token) {
        setIsAuthenticated(true);
        setUserId(storedUserId);

        if (!isActiveYear) {
          router.push('/centers');
        }
      } else {
        router.push('/login');
      }
    }
  }, [cohortsData]);

  useEffect(() => {
    const getMyCohortList = async () => {
      const myCohortList = await queryClient.fetchQuery({
        queryKey: [QueryKeys.MY_COHORTS, userId],
        queryFn: () => getCohortList(userId as string, { customField: 'true' }),
      });
      let response;
      if (userId) {
        response = await getUserDetails(userId, true);
      }
      const blockObject = response?.result?.userData?.customFields?.find(
        (item: any) => item?.label === 'BLOCKS'
      );
      const cohortData = response?.result?.userData?.customFields;

      const state = cohortData?.find(
        (item: CustomField) => item.label === 'STATES'
      );
      setState(state?.value);

      const typeOfCohort = cohortData?.find(
        (item: CustomField) => item.label === 'TYPE_OF_COHORT'
      );
      setCohortType(typeOfCohort?.value);

      const isCustomFields = true;
      const result = await getCohortList(
        userId as string,
        { customField: 'true' },
        isCustomFields
      );
      const activeCohorts = result?.filter(
        (cohort: any) => cohort.cohortMemberStatus === Status.ACTIVE
      );
      updateStoreFromCohorts(activeCohorts, blockObject);

      setMyCohortList(myCohortList);
    };
    if (userId) {
      getMyCohortList();
    }
  }, [userId]);

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
            includeArchived: true,
          });
          const resp = response?.result?.userDetails;
          if (resp) {
            const nameUserIdArray = resp
              ?.map((entry: any) => ({
                userId: entry.userId,
                name: toPascalCase(entry.firstName),
                memberStatus: entry.status,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt,
                userName: entry.username,
              }))
              .filter(
                (member: {
                  createdAt: string | number | Date;
                  updatedAt: string | number | Date;
                  memberStatus: string;
                }) => {
                  const createdAt = new Date(member.createdAt);
                  createdAt.setHours(0, 0, 0, 0);
                  const updatedAt = new Date(member.updatedAt);
                  updatedAt.setHours(0, 0, 0, 0);
                  const currentDate = new Date(selectedDate);
                  currentDate.setHours(0, 0, 0, 0);
                  if (
                    member.memberStatus === Status.ARCHIVED &&
                    updatedAt <= currentDate
                  ) {
                    return false;
                  }
                  return createdAt <= new Date(selectedDate);
                }
              );

            // Filter latest entries
            const filteredEntries = getLatestEntries(nameUserIdArray, selectedDate);
            if (filteredEntries) {
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
                    const user = filteredEntries.find(
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

            if (filteredEntries && selectedDate && classId) {
              fetchAttendanceDetails(
                filteredEntries,
                selectedDate,
                classId,
                handleAttendanceDataUpdate
              );
            }
          } else {
            setAttendanceData({
              cohortMemberList: [],
              presentCount: 0,
              absentCount: 0,
              numberOfCohortMembers: 0,
              dropoutMemberList: [],
              dropoutCount: 0,
              bulkAttendanceStatus: '',
            });
          }
          if (classId) {
            const cohortAttendancePercent = async () => {
              const cohortAttendanceData: CohortAttendancePercentParam = {
                limit: AttendanceAPILimit,
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
                setCohortPresentPercentage(t('ATTENDANCE.NO_ATTENDANCE'));
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
    setSelectedDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };
  const showTimeTableDetailsHandle = (dayStr: string) => {
    setTimeTableDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const handleModalToggle = () => {
    setOpen(!open);
    ReactGA.event('mark/modify-attendance-button-clicked-dashboard', {
      teacherId: userId,
    });

    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'dashboard',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'dashboard',
      },
    };
    telemetryFactory.interact(telemetryInteract);
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
          includeArchived: true,
        };
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const diffToMonday =
          currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStartDate = new Date(currentDate.setDate(diffToMonday));
        const startDate = new Date(
          currentDate.setDate(currentDate.getDate() - dashboardDaysLimit)
        );
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(weekStartDate);
        endDate.setDate(weekStartDate.getDate() + modifyAttendanceLimit);
        endDate.setHours(23, 59, 59, 999);
        const fromDateFormatted = shortDateFormat(startDate);
        const toDateFormatted = shortDateFormat(new Date());
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
      }
    };
    getAttendanceStats();
  }, [classId && classId !== 'all', selectedDate, handleSaveHasRun]);

  const viewAttendanceHistory = () => {
    if (classId !== 'all') {
      router.push('/attendance-history');
      ReactGA.event('month-name-clicked', { selectedCohortID: classId });
    }
    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'dashboard',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'dashboard',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const viewTimeTable = () => {
    if (classId !== 'all') {
      router.push(
        `centers/${classId}/events/${getMonthName(timeTableDate)?.toLowerCase()}?showAll=1`
      );
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

  useEffect(() => {
    const getCohortData = async () => {
      const response = await getCohortDetails(classId);

      let cohortData = null;

      if (response?.cohortData?.length) {
        cohortData = response?.cohortData[0];

        if (cohortData?.customField?.length) {
          const district = cohortData.customField.find(
            (item: CustomField) => item.label === 'DISTRICTS'
          );
          const state = cohortData.customField.find(
            (item: CustomField) => item.label === 'STATES'
          );
          setState(state?.value);

          const address = `${toPascalCase(district?.value)}, ${toPascalCase(state?.value)}`;
          cohortData.address = address || '';

          const typeOfCohort = cohortData.customField.find(
            (item: CustomField) => item.label === 'TYPE_OF_COHORT'
          );
          setCohortType(typeOfCohort?.value);

          const medium = cohortData.customField.find(
            (item: CustomField) => item.label === 'MEDIUM'
          );
          setMedium(medium?.value);

          const grade = cohortData.customField.find(
            (item: CustomField) => item.label === 'GRADE'
          );
          setGrade(grade?.value);

          const board = cohortData.customField.find(
            (item: CustomField) => item.label === 'BOARD'
          );
          setBoard(board?.value);
        }
      }
    };

    if (classId) {
      getCohortData();
    }
  }, [classId]);

  useEffect(() => {
    const getSessionsData = async () => {
      try {
        if (userId !== '' && userId !== null) {
          const afterDate = getAfterDate(timeTableDate);
          const beforeDate = getBeforeDate(timeTableDate);
          const limit = 0;
          const offset = 0;
          const filters = {
            date: {
              after: afterDate,
              before: beforeDate,
            },
            // cohortId: classId,
            createdBy: userId,
            status: ['live'],
          };

          const response = await getEventList({ limit, offset, filters });
          const sessionArray: any[] = [];
          const extraSessionArray: any[] = [];
          if (response?.events?.length > 0) {
            response?.events.forEach((event: any) => {
              if (event?.metadata?.type === sessionType.PLANNED) {
                sessionArray.push(event);
              }
              if (event?.metadata?.type === sessionType.EXTRA) {
                extraSessionArray.push(event);
              }
            });
          }
          const eventList = sortSessions(sessionArray);
          setSessions(eventList);
          const ExtraEventList = sortSessions(extraSessionArray);
          setExtraSessions(ExtraEventList);
        }
        setEventUpdated(false);
        setEventDeleted(false);
      } catch (error) {
        setSessions([]);
      }
    };

    if (userId && myCohortList) {
      getSessionsData();
    }
  }, [
    timeTableDate,
    userId,
    myCohortList,
    classId,
    eventUpdated,
    eventDeleted,
  ]);

  const eventDates = useEventDates(
    userId,
    'userId',
    modifyAttendanceLimit,
    timeTableDate,
    eventUpdated,
    eventDeleted
  );
  useEffect(() => {
    console.log(eventDates);
  }, [eventDates]);

  const handleEventDeleted = () => {
    setEventDeleted(true);
  };

  const handleEventUpdated = () => {
    setEventUpdated(true);
  };

  const handlePrimaryButton = () => {
    router.push(`/create-password`);
  };

  const handleSkipButton = () => {
    localStorage.setItem('skipResetPassword', 'true');
  };
  const darkMode =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('mui-mode')
      : null;

  return (
    <>
      {
        (
          <>
            <GuideTour toggleDrawer={toggleDrawer} />
            <>
              {!isAuthenticated && (
                <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
              )}

              {isAuthenticated && (
                <Box minHeight="100vh">
                  <Box>
                    <Header toggleDrawer={toggleDrawer} openDrawer={openDrawer} />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                      display={'flex'}
                      width={'100%'}
                      sx={{ backgroundColor: theme.palette.warning['A400'] }}
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
                      sx={{
                        background:
                          darkMode === 'dark'
                            ? 'linear-gradient(180deg, #2e2e2e 0%, #1b1b1b 100%)'
                            : 'linear-gradient(180deg, #fffdf7 0%, #f8efda 100%)',
                      }}
                      className="br-md-8"
                    >
                      <Box className="joyride-step-2">
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
                                color={theme.palette.warning['300']}
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
                                manipulatedCohortData={manipulatedCohortData}
                                setManipulatedCohortData={
                                  setManipulatedCohortData
                                }
                                blockName={blockName}
                                setBlockName={setBlockName}
                                handleSaveHasRun={handleSaveHasRun}
                                setHandleSaveHasRun={setHandleSaveHasRun}
                                isCustomFieldRequired={false}
                              />
                            </Box>

                            <Box
                              className="calenderTitle flex-center joyride-step-3 ps-md-ab"
                              display={'flex'}
                              sx={{
                                cursor: 'pointer',
                                color: theme.palette.secondary.main,
                                gap: '4px',
                                opacity: classId === 'all' ? 0.5 : 1,
                                '@media (max-width: 900px)': {
                                  top:
                                    role === Role.TEAM_LEADER ? '210px' : '185px',
                                  right: '20px',
                                },
                              }}
                              onClick={viewAttendanceHistory}
                            >
                              <Typography
                                marginBottom={'0'}
                                style={{ fontWeight: '500' }}
                              >
                                {getMonthName(selectedDate)}
                              </Typography>
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
                                newWidth={'1840px'}
                              />
                            </Box>
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
                                            backgroundColor:
                                              theme.palette.warning['A400'],
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
                                                attendanceData?.numberOfCohortMembers &&
                                                  attendanceData.numberOfCohortMembers !==
                                                  0
                                                  ? (
                                                    (attendanceData.presentCount /
                                                      attendanceData.numberOfCohortMembers) *
                                                    100
                                                  ).toFixed(2)
                                                  : '0',
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
                                                attendanceData.presentCount,
                                              total_students:
                                                attendanceData.numberOfCohortMembers,
                                            })}
                                          </Typography>
                                        </Box>
                                      </>
                                    )}
                                  {currentAttendance === 'notMarked' &&
                                    currentAttendance !== 'futureDate' && (
                                      <Typography
                                        sx={{
                                          color: theme.palette.warning['A400'],
                                        }}
                                        fontSize={'0.8rem'}
                                      // variant="h6"
                                      // className="word-break"
                                      >
                                        {t('DASHBOARD.NOT_MARKED')}
                                      </Typography>
                                    )}
                                  {currentAttendance === 'futureDate' && (
                                    <Typography
                                      sx={{
                                        color: theme.palette.warning['300'],
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
                                  className="btn-mark-width"
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
                                    currentAttendance === 'futureDate' ||
                                    classId === 'all' ||
                                    formattedSevenDaysAgo > selectedDate
                                  }
                                >
                                  {currentAttendance === 'notMarked' ||
                                    currentAttendance === 'futureDate'
                                    ? t('COMMON.MARK')
                                    : t('COMMON.MODIFY')}
                                </Button>
                              </Stack>
                            </Box>
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
                                memberList={attendanceData?.cohortMemberList}
                                presentCount={attendanceData?.presentCount}
                                absentCount={attendanceData?.absentCount}
                                numberOfCohortMembers={
                                  attendanceData?.numberOfCohortMembers
                                }
                                dropoutMemberList={
                                  attendanceData?.dropoutMemberList
                                }
                                dropoutCount={attendanceData?.dropoutCount}
                                bulkStatus={attendanceData?.bulkAttendanceStatus}
                              />
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ padding: '0 20px' }}>
                          <Divider sx={{ borderBottomWidth: '0.1rem' }} />
                        </Box>
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
                                  className="flex-center fs-14 text-decoration joyride-step-4"
                                  href={'/attendance-overview'}
                                  style={{
                                    color: theme.palette.secondary.main,
                                    fontWeight: '500',
                                  }}
                                  onClick={handleMoreDetailsClicked}
                                >
                                  {t('DASHBOARD.MORE_DETAILS')}
                                  <ArrowForwardSharpIcon
                                    sx={{
                                      height: '18px',
                                      transform: isRTL
                                        ? ' rotate(180deg)'
                                        : 'unset',
                                    }}
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
                        {/*loading && (
                        <Loader
                          showBackdrop={true}
                          loadingText={t('COMMON.LOADING')}
                        />
                      )*/}
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
                            <Grid item xs={4}>
                              <OverviewCard
                                label={t('ATTENDANCE.CENTER_ATTENDANCE')}
                                value={
                                  cohortPresentPercentage ===
                                    t('ATTENDANCE.NO_ATTENDANCE')
                                    ? cohortPresentPercentage
                                    : `${cohortPresentPercentage} %`
                                }
                              />
                            </Grid>
                            <Grid item xs={8}>
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
                                    lowAttendanceLearnerList.length > 0
                                    ? lowAttendanceLearnerList
                                      .slice(0, 2)
                                      .join(', ')
                                    : t(
                                      'ATTENDANCE.NO_LEARNER_WITH_LOW_ATTENDANCE'
                                    )
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
                  {!isEliminatedFromBuild('SessionCardFooter', 'component') &&
                    SessionCardFooter &&
                    SessionCard && (
                      <>
                        <Box mt={3} px="18px">
                          <Box
                            sx={{
                              background: theme.palette.warning['A400'],
                              padding: '5px',
                            }}
                            display={'flex'}
                            justifyContent={'space-between'}
                          >
                            <Typography
                              textAlign={'left'}
                              fontSize={'0.8rem'}
                              pt={'1rem'}
                              variant="h2"
                              sx={{ fontSize: '14px' }}
                              color={theme.palette.warning['300']}
                              fontWeight={'500'}
                            >
                              {t('DASHBOARD.MY_TIMETABLE')}
                            </Typography>
                            <Box
                              display={'flex'}
                              sx={{
                                cursor: 'pointer',
                                color: theme.palette.secondary.main,
                                gap: '4px',
                                opacity: classId === 'all' ? 0.5 : 1,
                                alignItems: 'center',
                              }}
                              onClick={viewTimeTable}
                            >
                              <Typography
                                marginBottom={'0'}
                                style={{ fontWeight: '500' }}
                              >
                                {getMonthName(selectedDate)}
                              </Typography>
                              <CalendarMonthIcon sx={{ fontSize: '18px' }} />
                            </Box>
                          </Box>
                          <WeekCalender
                            showDetailsHandle={showTimeTableDetailsHandle}
                            disableDays={classId === 'all'}
                            classId={classId}
                            showFromToday={true}
                            newWidth={'100%'}
                            eventData={eventDates}
                          />
                        </Box>

                        <Box mt={2} px="18px">
                          <Grid container spacing={2}>
                            {sessions?.map((item) => (
                              <Grid xs={12} sm={6} md={4} key={item.id} item>
                                {SessionCard && (
                                  <SessionCard
                                    data={item}
                                    showCenterName={true}
                                    isEventDeleted={handleEventDeleted}
                                    isEventUpdated={handleEventUpdated}
                                    StateName={state}
                                    board={board}
                                    medium={medium}
                                    grade={grade}
                                  >
                                    {SessionCardFooter && (
                                      <SessionCardFooter
                                        item={item}
                                        isTopicSubTopicAdded={handleEventUpdated}
                                        state={state}
                                        board={board}
                                        medium={medium}
                                        grade={grade}
                                        cohortId={classId}
                                      />
                                    )}
                                  </SessionCard>
                                )}
                              </Grid>
                            ))}
                            {sessions && sessions?.length === 0 && (
                              <Box
                                className="fs-12 fw-400 italic"
                                sx={{
                                  color: theme.palette.warning['300'],
                                  paddingLeft: '18px',
                                }}
                              >
                                {t('COMMON.NO_SESSIONS_SCHEDULED')}
                              </Box>
                            )}
                          </Grid>
                        </Box>

                        <Box mt={3} px="18px" gap={'15px'}>
                          <Box
                            className="fs-14 fw-500"
                            sx={{ color: theme.palette.warning['300'] }}
                          >
                            {t('CENTER_SESSION.EXTRA_SESSION', {
                              days: eventDaysLimit,
                            })}
                          </Box>
                          <Box sx={{ mt: 1.5, mb: 2 }}>
                            <Grid container spacing={2}>
                              {extraSessions?.map((item) => (
                                <Grid xs={12} sm={6} md={4} key={item.id} item>
                                  {SessionCard && (
                                    <SessionCard
                                      data={item}
                                      showCenterName={true}
                                      isEventDeleted={handleEventDeleted}
                                      isEventUpdated={handleEventUpdated}
                                      StateName={state}
                                      board={board}
                                      medium={medium}
                                      grade={grade}
                                    >
                                      {SessionCardFooter && (
                                        <SessionCardFooter
                                          item={item}
                                          isTopicSubTopicAdded={
                                            handleEventUpdated
                                          }
                                          state={state}
                                          board={board}
                                          medium={medium}
                                          grade={grade}
                                          cohortId={classId}
                                        />
                                      )}
                                    </SessionCard>
                                  )}
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                          {extraSessions && extraSessions?.length === 0 && (
                            <Box
                              className="fs-12 fw-400 italic"
                              sx={{
                                color: theme.palette.warning['300'],
                                marginBottom: '12px',
                              }}
                            >
                              {t('COMMON.NO_SESSIONS_SCHEDULED')}
                            </Box>
                          )}
                        </Box>
                      </>
                    )}
                </Box>
              )}
            </>
          </>
        )}

      {centralizedModal && (
        <CentralizedModal
          title={t('LOGIN_PAGE.WELCOME')}
          subTitle={t('LOGIN_PAGE.PLEASE_RESET_YOUR_PASSWORD')}
          secondary={t('LOGIN_PAGE.DO_IT_LATER')}
          primary={t('LOGIN_PAGE.RESET_PASSWORD')}
          modalOpen={centralizedModal}
          handlePrimaryButton={handlePrimaryButton}
          handleSkipButton={handleSkipButton}
        />)}
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
