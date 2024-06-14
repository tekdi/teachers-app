'use client';

import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';
import {
  classesMissedAttendancePercentList,
  getAllCenterAttendance,
  getCohortAttendance,
} from '@/services/AttendanceService';
import { cohort, cohortAttendancePercentParam } from '@/utils/Interfaces';
import {
  debounce,
  formatSelectedDate,
  getTodayDate,
  toPascalCase,
} from '@/utils/Helper';

import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import ClearIcon from '@mui/icons-material/Clear';
import CohortAttendanceListView from '@/components/CohortAttendanceListView';
import DateRangePopup from '@/components/DateRangePopup';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import LearnerListHeader from '@/components/LearnerListHeader';
import Loader from '@/components/Loader';
import OverviewCard from '@/components/OverviewCard';
import SearchIcon from '@mui/icons-material/Search';
import SortingModal from '@/components/SortingModal';
import StudentsStatsList from '@/components/LearnerAttendanceStatsListView';
import UpDownButton from '@/components/UpDownButton';
import { cohortList } from '@/services/CohortServices';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { lowLearnerAttendanceLimit } from './../../app.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { logEvent } from '@/utils/googleAnalytics';
import { showToastMessage } from '@/components/Toastify';

interface AttendanceOverviewProps {
  //   buttonText: string;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { push } = useRouter();
  const today = new Date();
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<cohort>>(cohortsData);
  const [allCenterAttendanceData, setAllCenterAttendanceData] =
    React.useState<any>(cohortsData);

  const [loading, setLoading] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [learnerData, setLearnerData] = React.useState<Array<any>>([]);
  const [isFromDate, setIsFromDate] = useState(formatSelectedDate(
    new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
  ));
  const [isToDate, setIsToDate] = useState(getTodayDate());
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<any>
  >([]);
  const [currentDayMonth, setCurrentDayMonth] = React.useState<string>('');
  const [userId, setUserId] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState<any>('');
  const [presentPercentage, setPresentPercentage] = React.useState<
    string | number
  >('');
  const [lowAttendanceLearnerList, setLowAttendanceLearnerList] =
    React.useState<any>([]);
  const [numberOfDaysAttendanceMarked, setNumberOfDaysAttendanceMarked] =
    useState(0);
  const [dateRange, setDateRange] = React.useState<Date | string>('');

  const theme = useTheme<any>();
  const pathname = usePathname();

  const menuItems = [
    t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
      date_range: dateRange,
    }),
    t('DASHBOARD.AS_OF_TODAY_DATE', {
      day_date: currentDayMonth,
    }),
    t('COMMON.LAST_MONTH'),
    t('COMMON.LAST_SIX_MONTHS'),
    t('COMMON.CUSTOM_RANGE'),
  ];

  useEffect(() => {
    setSelectedValue(currentDayMonth);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setClassId(localStorage.getItem('classId') || '');
      const class_Id = localStorage.getItem('classId') || '';
      localStorage.setItem('cohortId', class_Id);

      setLoading(false);
      if (token) {
        push('/attendance-overview');
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  useEffect(() => {
    const getAttendanceMarkedDays = async () => {
      // const today = new Date();
      const todayFormattedDate = formatSelectedDate(new Date());
      const lastSeventhDayDate = new Date(
        today.getTime() - 6 * 24 * 60 * 60 * 1000
      );
      const lastSeventhDayFormattedDate = formatSelectedDate(
        new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
      );

      const endDay = today.getDate();
      const endDayMonth = today.toLocaleString('default', { month: 'long' });
      setCurrentDayMonth(`(${endDay} ${endDayMonth})`);
      const startDay = lastSeventhDayDate.getDate();
      const startDayMonth = lastSeventhDayDate.toLocaleString('default', {
        month: 'long',
      });
      if (startDayMonth === endDayMonth) {
        setDateRange(`(${startDay}-${endDay} ${endDayMonth})`);
      } else {
        setDateRange(`(${startDay} ${startDayMonth}-${endDay} ${endDayMonth})`);
      }
      const cohortAttendanceData: cohortAttendancePercentParam = {
        limit: 0,
        page: 0,
        filters: {
          scope: 'student',
          fromDate: lastSeventhDayFormattedDate,
          toDate: todayFormattedDate,
          contextId: classId,
        },
        facets: ['attendanceDate'],
        sort: ['present_percentage', 'asc']
      };
      const res = await getCohortAttendance(cohortAttendanceData);
      const response = res?.data?.result?.attendanceDate;
      if (response) {
        setNumberOfDaysAttendanceMarked(Object.keys(response)?.length);
      } else {
        setNumberOfDaysAttendanceMarked(0);
      }
    };
    if (classId) {
      getAttendanceMarkedDays();
    }
  }, [classId, selectedValue === t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
    date_range: dateRange,
  })]);

  // API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setUserId(userId);
      }
      setLoading(true);
      try {
        if (userId) {
          let limit = 0;
          let page = 0;
          let filters = { userId: userId };
          const resp = await cohortList({ limit, page, filters });
          const response = resp?.results;
          const cohortDetails = response?.cohortDetails || [];

          const filteredData = cohortDetails?.map((item: any) => {
            const stateNameField = item?.cohortData?.customFields.find(
              (field: any) => field.label === 'State Name'
            );
            const stateName = stateNameField ? stateNameField.value : '';

            return {
              cohortId: item?.cohortData?.cohortId,
              name: toPascalCase(item?.cohortData?.name),
              state: stateName,
            };
          });

          setCohortsData(filteredData);

          if (filteredData.length > 0) {
            // setClassId(filteredData[0].cohortId);

            // add state name to localstorage
            if (
              cohortDetails?.length > 0 &&
              cohortDetails?.[0].cohortData.customFields
            ) {
              const customFields = cohortDetails?.[0].cohortData.customFields;
              const stateNameField = customFields?.find(
                (field: any) => field.label === 'State Name'
              );
              if (stateNameField) {
                const state_name = stateNameField.value;
                if (state_name) {
                  localStorage.setItem('stateName', state_name);
                } else {
                  localStorage.setItem('stateName', '');
                  console.log('No State Name');
                }
              }
            }
            setManipulatedCohortData(
              filteredData.concat({ cohortId: 'all', name: 'All Centers' })
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      }
    };
    fetchCohortList();
  }, []);

  const handleDateRangeSelected = ({ fromDate, toDate }: any) => {
    console.log('Date Range Selected:', { fromDate, toDate });
    setIsFromDate(fromDate);
    setIsToDate(toDate);
    // Handle the date range values as needed
  };
  //API for getting student list
  const getCohortMemberList = async () => {
    setLoading(true);
    try {
      if (classId && classId != 'all') {
        let limit = 300;
        let page = 0;
        let filters = { cohortId: classId };
        const response = await getMyCohortMemberList({
          limit,
          page,
          filters,
        });
        const resp = response?.result?.results?.userDetails;
        if (resp) {
          const nameUserIdArray = resp?.map((entry: any) => ({
            userId: entry.userId,
            name: toPascalCase(entry.name),
          }));
          // console.log('name..........', nameUserIdArray);
          if (nameUserIdArray) {
            //Write logic to call class missed api
            let fromDate = isFromDate;
            let toDate = isToDate;
            let filters = {
              contextId: classId,
              fromDate,
              toDate,
              scope: 'student',
            };
            const response = await classesMissedAttendancePercentList({
              filters,
              facets: ['userId'],
              sort: ['present_percentage', 'asc'],
            });
            let resp = response?.data?.result?.userId;
            if (resp) {
              const filteredData = Object.keys(resp).map((userId) => ({
                userId,
                absent: resp[userId]?.absent || '0',
                present: resp[userId]?.present || '0',
                present_percent: resp[userId]?.present_percentage || '0',
                absent_percent: resp[userId]?.absent_percentage || '0',
              }));
              if (nameUserIdArray && filteredData) {
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
                // console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!`, mergedArray);
                setLearnerData(mergedArray);
                setDisplayStudentList(mergedArray);

                const studentsWithLowestAttendance = mergedArray.filter(
                  (user) =>
                    user.absent &&
                    (user.present_percent < lowLearnerAttendanceLimit ||
                      user.present_percent === undefined) //TODO: Modify here condition to show low attendance learners
                );

                // Extract names of these students
                if (studentsWithLowestAttendance.length) {
                  const namesOfLowestAttendance: any[] =
                    studentsWithLowestAttendance.map((student) => student.name);
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
            const cohortAttendanceData: cohortAttendancePercentParam = {
              limit: 0,
              page: 0,
              filters: {
                scope: 'student',
                fromDate: isFromDate,
                toDate: isToDate,
                contextId: classId,
              },
              facets: ['contextId'],
              sort: ['present_percentage', 'asc']
            };
            const res = await getCohortAttendance(cohortAttendanceData);
            const response = res?.data?.result;
            const contextData =
              response?.contextId && response?.contextId[classId];
            if (contextData?.present_percentage) {
              const presentPercentage = contextData?.present_percentage;
              setPresentPercentage(presentPercentage);
            } else if (contextData?.absent_percentage) {
              setPresentPercentage(0);
            } else {
              setPresentPercentage(t('ATTENDANCE.N/A'));
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
              fromDate: isFromDate,
              toDate: isToDate,
              scope: 'student',
              contextId: cohortId,
            };
            console.log('Filters:', filters); // Log filters to ensure contextId is set

            try {
              const response = await getAllCenterAttendance({
                limit,
                page,
                filters,
                facets,
              });
              console.log(`Response for cohortId ${cohortId}:`, response); // Log the response
              return { cohortId, data: response?.data?.result };
            } catch (error) {
              console.error(
                `Error fetching data for cohortId ${cohortId}:`,
                error
              );
              return { cohortId, error };
            }
          });

          try {
            const results = await Promise.all(fetchPromises);
            console.log('Fetched data:', results);

            const nameIDAttendanceArray = results
              .filter(
                (result) =>
                  !result.error && result.data && result.data.contextId
              )
              .map((result) => {
                const cohortId = result.cohortId;
                const contextData = result.data.contextId[cohortId] || {};
                const presentPercentage =
                  contextData.present_percentage || null;
                const absentPercentage = contextData.absent_percentage
                  ? 100 - contextData.absent_percentage
                  : null;
                const percentage = presentPercentage || absentPercentage;

                const cohortItem = cohortsData.find(
                  (cohort) => cohort.cohortId === cohortId
                );

                return {
                  userId: cohortId,
                  name: cohortItem ? cohortItem.name : null,
                  presentPercentage: percentage,
                };
              })
              .filter((item) => item.presentPercentage !== null); // Filter out items with no valid percentage

            console.log('Filtered and merged data:', nameIDAttendanceArray);
            setAllCenterAttendanceData(nameIDAttendanceArray);
          } catch (error) {
            console.error('Error fetching attendance data:', error);
          }
        };

        fetchAttendanceData(cohortIds);
      }
    } catch (error) {
      console.error('Error fetching cohort list:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCohortMemberList();
  }, [classId, isToDate, isFromDate]);

  // useEffect(()=>{
  //   setDisplayStudentList(learnerData);
  // },[searchWord == ""])

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
    ReactGA.event("cohort-selection-attendance-overview-page", { selectedCohortID: event.target.value });

    // ---------- set cohortId and stateName-----------
    const cohort_id = event.target.value;
    localStorage.setItem('cohortId', cohort_id);

    const get_state_name: string | null = getStateByCohortId(cohort_id);
    if (get_state_name) {
      localStorage.setItem('stateName', get_state_name);
    } else {
      localStorage.setItem('stateName', '');
      console.log('NO State For Selected Cohort');
    }
  };

  function getStateByCohortId(cohortId: any) {
    const cohort = cohortsData?.find((item) => item.cohortId === cohortId);
    return cohort ? cohort?.state : null;
  }

  const handleSearchClear = () => {
    setSearchWord('');
    setDisplayStudentList(learnerData);
  };

  // debounce use for searching time period is 2 sec
  const debouncedSearch = debounce((value: string) => {
    let filteredList = learnerData?.filter((user: any) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayStudentList(filteredList);
  }, 2);

  // handle search student data
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
    if (event.target.value.length >= 1) {
      debouncedSearch(event.target.value);
      ReactGA.event("search-by-keyword-attendance-overview-page", { keyword: event.target.value});
    } else {
      setDisplayStudentList(learnerData);
    }
  };

  const handleSearchSubmit = () => {
    let filteredList = learnerData?.filter((user: any) =>
      user.name.toLowerCase().includes(searchWord.toLowerCase())
    );
    setDisplayStudentList(filteredList);
  };

  // open modal of sort
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // close modal of sort
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //handel sorting
  const handleSorting = (
    sortByName: string,
    sortByAttendance: string,
    sortByClassesMissed: string,
    sortByAttendanceNumber: string
  ) => {
    handleCloseModal();
    let sortedData = [...learnerData];

    // Sorting by name
    switch (sortByName) {
      case 'asc':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'desc':
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    // Sorting by attendance
    switch (sortByAttendanceNumber) {
      case 'high':
        sortedData.sort((a, b) => {
          const aPercent = parseFloat(a.present_percent);
          const bPercent = parseFloat(b.present_percent);
          if (isNaN(aPercent) && isNaN(bPercent)) return 0;
          if (isNaN(aPercent)) return 1;
          if (isNaN(bPercent)) return -1;
          return bPercent - aPercent;
        });
        break;
      case 'low':
        sortedData.sort((a, b) => {
          const aPercent = parseFloat(a.present_percent);
          const bPercent = parseFloat(b.present_percent);
          if (isNaN(aPercent) && isNaN(bPercent)) return 0;
          if (isNaN(aPercent)) return 1;
          if (isNaN(bPercent)) return -1;
          return aPercent - bPercent;
        });
        break;
    }

    // Sorting by classesMissed
    switch (sortByClassesMissed) {
      case 'more':
        sortedData.sort((a, b) => {
          const aClassMissed = parseFloat(a.absent);
          const bClassMissed = parseFloat(b.absent);
          if (isNaN(aClassMissed) && isNaN(bClassMissed)) return 0;
          if (isNaN(aClassMissed)) return 1;
          if (isNaN(bClassMissed)) return -1;
          return bClassMissed - aClassMissed;
        });
        break;
      case 'less':
        sortedData.sort((a, b) => {
          const aClassMissed = parseFloat(a.absent);
          const bClassMissed = parseFloat(b.absent);
          if (isNaN(aClassMissed) && isNaN(bClassMissed)) return 0;
          if (isNaN(aClassMissed)) return 1;
          if (isNaN(bClassMissed)) return -1;
          return aClassMissed - bClassMissed;
        });
        break;
    }

    setDisplayStudentList(sortedData);
  };
  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Attendance Overview Page',
      label: 'Back Button Clicked',
    });
  };
  const truncate = (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 70, behavior: 'smooth' });
    }
  };

  return (
    <Box>
      {displayStudentList.length ? <UpDownButton /> : null}
      <Header />
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            color: '#4D4639',
            padding: '15px 20px 5px',
          }}
          width={'100%'}
          onClick={handleBackEvent}
        >
          <KeyboardBackspaceOutlinedIcon
            cursor={'pointer'}
            sx={{ color: theme.palette.warning['A200'] }}
          />
          <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
            {t('ATTENDANCE.ATTENDANCE_OVERVIEW')}
          </Typography>
        </Box>

        <Box sx={{ px: '16px', width: '100%', gap: '15px' }} display={'flex'}>
          {cohortsData?.length > 1 ? (
            <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
              <Select
                value={classId}
                onChange={handleCohortSelection}
                displayEmpty
                // disabled={cohortsData?.length <= 1 ? true : false}
                inputProps={{ 'aria-label': 'Without label' }}
                className="SelectLanguages fs-14 fw-500 bg-white"
                style={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  marginBottom: '0rem',
                  fontSize: '16px',
                }}
              >
                {cohortsData?.length !== 0 ? (
                  manipulatedCohortData?.map((cohort) => (
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
          ) : (
            <Typography
              color={theme.palette.warning['300']}
              pl={1}
              variant="h1"
            >
              {cohortsData[0]?.name}
            </Typography>
          )}
        </Box>

        <Box className="linerGradient" sx={{ padding: '10px 20px' }}>
          <DateRangePopup
            menuItems={menuItems}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            onDateRangeSelected={handleDateRangeSelected}
            dateRange={dateRange}
          />
          {(selectedValue ===
          t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
            date_range: dateRange,
          }) || selectedValue === "") ? (
            <Typography
              color={theme.palette.warning['400']}
              fontSize={'0.75rem'}
              fontWeight={'500'}
              pt={'1rem'}
            >
              {t('ATTENDANCE.ATTENDANCE_MARKED_OUT_OF_DAYS', {
                count: numberOfDaysAttendanceMarked,
              })}
            </Typography>
          ) : null}
          {classId !== 'all' ? (
            <Box display={'flex'} className="card_overview" p={'1rem 0'}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <OverviewCard
                    label={t('ATTENDANCE.CENTER_ATTENDANCE')}
                    value={
                      learnerData.length
                        ? presentPercentage + ' %'
                        : presentPercentage
                    }
                  />
                </Grid>
                <Grid item xs={7}>
                  <OverviewCard
                    label={t('ATTENDANCE.LOW_ATTENDANCE_STUDENTS')}
                    {...(loading && (
                      <Loader
                        loadingText={t('COMMON.LOADING')}
                        showBackdrop={false}
                      />
                    ))}
                    valuePartOne={
                      Array.isArray(lowAttendanceLearnerList) && lowAttendanceLearnerList.length > 2
                        ? `${lowAttendanceLearnerList[0]}, ${lowAttendanceLearnerList[1]}`
                        : lowAttendanceLearnerList.length === 2
                          ? `${lowAttendanceLearnerList[0]}, ${lowAttendanceLearnerList[1]}`
                          : lowAttendanceLearnerList.length === 1
                            ? `${lowAttendanceLearnerList[0]}`
                            : Array.isArray(lowAttendanceLearnerList) &&
                                lowAttendanceLearnerList.length === 0
                              ? t('ATTENDANCE.NO_LEARNER_WITH_LOW_ATTENDANCE')
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
            </Box>
          ) : null}
        </Box>
      </Box>

      {learnerData?.length > 0 ? (
        <Box bgcolor={theme.palette.warning['A400']}>
          {classId !== 'all' ? (
            <Stack mr={1} ml={1}>
              <Box mt={3} mb={3} boxShadow={'none'}>
                <Grid
                  container
                  alignItems="center"
                  display={'flex'}
                  justifyContent="space-between"
                >
                  <Grid item xs={8}>
                    <Paper
                      component="form"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleSearchSubmit();
                      }}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '100px',
                        background: theme.palette.warning.A700,
                        boxShadow: 'none',
                      }}
                    >
                      <InputBase
                        ref={inputRef}
                        value={searchWord}
                        sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                        placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                        inputProps={{ 'aria-label': 'search student' }}
                        onChange={handleSearch}
                        onClick={handleScrollDown}
                      />
                      <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={handleSearchSubmit}
                      >
                        <SearchIcon />
                      </IconButton>

                      {searchWord?.length > 0 && (
                        <IconButton
                          type="button"
                          aria-label="Clear"
                          onClick={handleSearchClear}
                        >
                          <ClearIcon />
                        </IconButton>
                      )}
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    display={'flex'}
                    justifyContent={'flex-end'}
                  >
                    <Button
                      onClick={handleOpenModal}
                      sx={{
                        color: theme.palette.warning.A200,

                        borderRadius: '10px',
                        fontSize: '14px',
                      }}
                      endIcon={<ArrowDropDownSharpIcon />}
                      size="small"
                      variant="outlined"
                    >
                      {t('COMMON.SORT_BY').length > 7
                        ? `${t('COMMON.SORT_BY').substring(0, 6)}...`
                        : t('COMMON.SORT_BY')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              <SortingModal
                isModalOpen={modalOpen}
                handleCloseModal={handleCloseModal}
                handleSorting={handleSorting}
                routeName={pathname}
              />
            </Stack>
          ) : null}
          {loading && (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          )}
          {classId !== 'all' ? (
            <Box>
              <LearnerListHeader
                numberOfColumns={3}
                firstColumnName={t('COMMON.ATTENDANCE')}
                secondColumnName={t('COMMON.CLASS_MISSED')}
              />
              <Box>
                {displayStudentList.length >= 1 ? (
                  displayStudentList?.map((user: any) => (
                    <StudentsStatsList
                      key={user.userId}
                      name={user.name}
                      presentPercent={
                        Math.floor(parseFloat(user.present_percent)) || 0
                      }
                      classesMissed={user.absent || 0}
                      userId={user.userId}
                      cohortId={classId}
                    />
                  ))
                ) : (
                  <Box
                    sx={{
                      mt: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      style={{ fontWeight: 'bold', marginLeft: '1rem' }}
                    >
                      {t('COMMON.NO_DATA_FOUND')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <LearnerListHeader
                numberOfColumns={2}
                firstColumnName={t('COMMON.ATTENDANCE')}
              />
              {allCenterAttendanceData.map(
                (item: {
                  cohortId: React.Key | null | undefined;
                  name: string;
                  presentPercentage: number;
                }) => (
                  <CohortAttendanceListView
                    key={item.cohortId}
                    cohortName={item.name}
                    attendancePercent={item.presentPercentage}
                  />
                )
              )}
            </Box>
          )}
        </Box>
      ) : (
        <Box
          display={'flex'}
          justifyContent={'center'}
          mt={2}
          p={'1rem'}
          borderRadius={'1rem'}
          bgcolor={theme.palette.warning['A400']}
          // bgcolor={'secondary.light'}
        >
          <Typography>{t('COMMON.NO_DATA_FOUND')}</Typography>
        </Box>
      )}
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

export default AttendanceOverview;
