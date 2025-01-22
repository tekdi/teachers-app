'use client';

import {
  classesMissedAttendancePercentList,
  getAllCenterAttendance,
  getCohortAttendance,
} from '@/services/AttendanceService';
import {
  debounce,
  filterAttendancePercentage,
  formatSelectedDate,
  getTodayDate,
  handleKeyDown,
  sortAttendanceNumber,
  toPascalCase
} from '@/utils/Helper';
import { CohortAttendancePercentParam, ICohort } from '@/utils/Interfaces';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { accessControl, AttendanceAPILimit, lowLearnerAttendanceLimit } from './../../app.config';

import CohortAttendanceListView from '@/components/CohortAttendanceListView';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import NoDataFound from '@/components/common/NoDataFound';
import DateRangePopup from '@/components/DateRangePopup';
import Header from '@/components/Header';
import StudentsStatsList from '@/components/LearnerAttendanceStatsListView';
import LearnerListHeader from '@/components/LearnerListHeader';
import Loader from '@/components/Loader';
import OverviewCard from '@/components/OverviewCard';
import SortingModal from '@/components/SortingModal';
import { showToastMessage } from '@/components/Toastify';
import UpDownButton from '@/components/UpDownButton';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { getMenuItems, Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import withAccessControl from '@/utils/hoc/withAccessControl';
import { telemetryFactory } from '@/utils/telemetry';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import { useDirection } from '../hooks/useDirection';

interface AttendanceOverviewProps {
  //   buttonText: string;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = () => {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { push } = useRouter();
  const today = new Date();
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const [allCenterAttendanceData, setAllCenterAttendanceData] =
    React.useState<any>(cohortsData);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [inLineLoading, setInLineLoading] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [learnerData, setLearnerData] = React.useState<Array<any>>([]);
  const [isFromDate, setIsFromDate] = useState(
    formatSelectedDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000))
  );
  const [isToDate, setIsToDate] = useState(getTodayDate());
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<any>
  >([]);
  const [currentDayMonth, setCurrentDayMonth] = React.useState<string>('');
  const [userId, setUserId] = React.useState<string | null>(null);
  const [selectedValue, setSelectedValue] = React.useState<any>('');
  const [presentPercentage, setPresentPercentage] = React.useState<
    string | number
  >('');
  const [lowAttendanceLearnerList, setLowAttendanceLearnerList] =
    React.useState<any>([]);
  const [numberOfDaysAttendanceMarked, setNumberOfDaysAttendanceMarked] =
    useState(0);
  const [dateRange, setDateRange] = React.useState<Date | string>('');
  const [blockName, setBlockName] = React.useState<string>('');

  const theme = useTheme<any>();
  const pathname = usePathname();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;

  const menuItems = getMenuItems(t, dateRange, currentDayMonth);

  useEffect(() => {
    setSelectedValue(currentDayMonth);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setClassId(localStorage.getItem('classId') ?? '');
      const class_Id = localStorage.getItem('classId') ?? '';
      localStorage.setItem('cohortId', class_Id);

      // setLoading(false);
      if (token) {
        if (isActiveYear) {
          push('/attendance-overview');
        } else {
          push('/centers');
        }
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  useEffect(() => {
    const getAttendanceMarkedDays = async () => {
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
      const cohortAttendanceData: CohortAttendancePercentParam = {
        limit: AttendanceAPILimit,
        page: 0,
        filters: {
          scope: 'student',
          fromDate: lastSeventhDayFormattedDate,
          toDate: todayFormattedDate,
          contextId: classId,
        },
        facets: ['attendanceDate'],
        sort: ['present_percentage', 'asc'],
      };
      try {

        const res = await getCohortAttendance(cohortAttendanceData);
        const response = res?.data?.result?.attendanceDate;
        if (response) {
          setNumberOfDaysAttendanceMarked(Object.keys(response)?.length);
        } else {
          setNumberOfDaysAttendanceMarked(0);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    if (classId) {
      getAttendanceMarkedDays();
    }
  }, [
    classId,
    selectedValue ===
    t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
      date_range: dateRange,
    }),
  ]);

  const handleDateRangeSelected = ({ fromDate, toDate }: any) => {
    setIsFromDate(fromDate);
    setIsToDate(toDate);
    // Handle the date range values as needed
  };
  //API for getting student list
  const getCohortMemberList = async () => {
    // setLoading(true);
    setDisplayStudentList([]);
    try {
      if (classId && classId != 'all') {
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
          const nameUserIdArray = resp?.map((entry: any) => ({
            userId: entry.userId,
            name: toPascalCase(entry?.firstName || '') + ' ' + (entry?.lastName ? toPascalCase(entry.lastName) : ""),

            memberStatus: entry.status,
          }));
          if (nameUserIdArray) {
            //Write logic to call class missed api
            const filters: any = {
              scope: 'student',
              contextId: classId,
            };
            // Conditionally add fromDate and toDate to filters if selectedValue doesn't match the specific condition
            if (
              selectedValue !==
              t('DASHBOARD.AS_OF_TODAY_DATE', { day_date: currentDayMonth })
            ) {
              filters.fromDate = isFromDate;
              filters.toDate = isToDate;
            }
            const response = await classesMissedAttendancePercentList({
              filters,
              facets: ['userId'],
              sort: ['present_percentage', 'asc'],
            });
            const resp = response?.data?.result?.userId;
            if (resp) {
              const filteredData = Object.keys(resp).map((userId) => ({
                userId,
                absent: resp[userId]?.absent || '0',
                present: resp[userId]?.present || '0',
                present_percent: resp[userId]?.present_percentage || '0',
                absent_percent: resp[userId]?.absent_percentage || '0',
              }));
              if (filteredData) {
                let mergedArray = filteredData.map((attendance) => {
                  const user = nameUserIdArray.find(
                    (user: { userId: string }) =>
                      user.userId === attendance.userId
                  );
                  return Object.assign({}, attendance, {
                    name: user ? user.name : 'Unknown',
                    memberStatus: user ? user.memberStatus : 'Unknown',
                  });
                });
                mergedArray = mergedArray.filter(
                  (item) => item.name !== 'Unknown'
                );
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

                // setLoading(false);
                setInLineLoading(false);
              }
            }
          }
        } else {
          setLearnerData([]);
          setDisplayStudentList([]);
          // setLoading(false);
          setInLineLoading(false);
        }
        if (classId) {
          const cohortAttendancePercent = async () => {
            const filters: any = {
              scope: 'student',
              contextId: classId,
            };

            // Conditionally add fromDate and toDate to filters if selectedValue doesn't match the specific condition
            if (
              selectedValue !==
              t('DASHBOARD.AS_OF_TODAY_DATE', { day_date: currentDayMonth })
            ) {
              filters.fromDate = isFromDate;
              filters.toDate = isToDate;
            }
            const cohortAttendanceData: CohortAttendancePercentParam = {
              limit: AttendanceAPILimit,
              page: 0,
              filters,
              facets: ['contextId'],
              sort: ['present_percentage', 'asc'],
            };
            const res = await getCohortAttendance(cohortAttendanceData);
            const response = res?.data?.result;
            const contextData = response?.contextId?.[classId];
            if (contextData?.present_percentage) {
              const presentPercentage = contextData?.present_percentage;
              setPresentPercentage(presentPercentage);
            } else if (contextData?.absent_percentage) {
              setPresentPercentage(0);
            } else {
              setPresentPercentage(t('ATTENDANCE.NO_ATTENDANCE'));
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
              return { cohortId, error };
            }
          });

          try {
            const results = await Promise.all(fetchPromises);
            const nameIDAttendanceArray = results
              .filter((result) => !result.error && result?.data?.contextId)
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
    setInLineLoading(true);
    getCohortMemberList();
  }, [classId, isToDate, isFromDate]);


  const handleSearchClear = () => {
    setSearchWord('');
    debouncedSearch.cancel();
    setDisplayStudentList(learnerData);
  };

  // debounce use for searching time period is 2 sec
  const debouncedSearch = debounce((value: string) => {
    const filteredList = learnerData?.filter((user: any) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayStudentList(filteredList || []);
  }, 200);

  // handle search student data
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = event.target.value.replace(/\s{2,}/g, " ").trimStart();
    setSearchWord(trimmedValue);
    if (trimmedValue.length >= 1) {
      debouncedSearch(trimmedValue);
      ReactGA.event('search-by-keyword-attendance-overview-page', {
        keyword: trimmedValue,
      });

      const telemetryInteract = {
        context: {
          env: 'dashboard',
          cdata: [],
        },
        edata: {
          id: 'search-by-keyword-attendance-overview-page',
          type: Telemetry.SEARCH,
          subtype: '',
          pageid: 'attendance-overview',
        },
      };
      telemetryFactory.interact(telemetryInteract);
    } else if (trimmedValue === '') {
      debouncedSearch.cancel();
      setDisplayStudentList(learnerData);
    } else {
      setDisplayStudentList(learnerData);
    }
  };

  const handleSearchSubmit = () => {
    const filteredList = learnerData?.filter((user: any) =>
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
    // sortByClassesMissed: string,
    sortByAttendancePercentage: string,
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
        sortedData = sortAttendanceNumber(sortedData, 'high');
        break;
      case 'low':
        sortedData = sortAttendanceNumber(sortedData, 'low');
        break;
    }

    // // Sorting by classesMissed
    // switch (sortByClassesMissed) {
    //   case 'more':
    //     sortedData = sortClassesMissed(sortedData, 'more');
    //     break;
    //   case 'less':
    //     sortedData = sortClassesMissed(sortedData, 'less');
    //     break;
    // }

    // Sorting by AttendancePercentage
    switch (sortByAttendancePercentage) {
      case "more":
        sortedData = filterAttendancePercentage(sortedData, "more");
        break;
      case "between":
        sortedData = filterAttendancePercentage(sortedData, "between");
        break;
      case "less":
        sortedData = filterAttendancePercentage(sortedData, "less");
        break;
      default:
        // Handle default case if needed
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

  const darkMode =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('mui-mode')
      : null;

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
            alignItems: 'center',
            color: theme.palette.warning['A200'],
            padding: '15px 20px 5px',
          }}
          width={'100%'}
        >
          <KeyboardBackspaceOutlinedIcon
            onClick={handleBackEvent}
            cursor={'pointer'}
            sx={{
              color: theme.palette.warning['A200'],
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
          />
          <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
            {t('ATTENDANCE.ATTENDANCE_OVERVIEW')}
          </Typography>
        </Box>

        <Box
          className="br-md-8"
          sx={{
            padding: '20px 20px',
            background:
              darkMode === 'dark'
                ? 'linear-gradient(180deg, #2e2e2e 0%, #1b1b1b 100%)'
                : 'linear-gradient(180deg, #fffdf7 0%, #f8efda 100%)',
          }}
        >
          <Box className="d-md-flex space-md-between gap-md-10 w-100">
            <Box className="flex-basis-md-50">
              <CohortSelectionSection
                classId={classId}
                setClassId={setClassId}
                userId={userId}
                setUserId={setUserId}
                loading={loading}
                setLoading={setLoading}
                cohortsData={cohortsData}
                setCohortsData={setCohortsData}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                manipulatedCohortData={manipulatedCohortData}
                setManipulatedCohortData={setManipulatedCohortData}
                blockName={blockName}
                setBlockName={setBlockName}
                isCustomFieldRequired={true}
              />
            </Box>
            <Box
              sx={{ marginTop: blockName ? '25px' : '0px' }}
              className="flex-basis-md-50"
            >
              <DateRangePopup
                menuItems={menuItems}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                onDateRangeSelected={handleDateRangeSelected}
                dateRange={dateRange}
              />
            </Box>
          </Box>

          {selectedValue ===
            t('DASHBOARD.LAST_SEVEN_DAYS_RANGE', {
              date_range: dateRange,
            }) || selectedValue === '' ? (
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
                        : t('ATTENDANCE.NO_ATTENDANCE')
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
                      lowAttendanceLearnerList.length > 0
                        ? lowAttendanceLearnerList.slice(0, 2).join(', ')
                        : t('ATTENDANCE.NO_LEARNER_WITH_LOW_ATTENDANCE')
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
                      className="w-md-60"
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
                        sx={{
                          ml: isRTL ? 0 : 3,
                          mr: isRTL ? 3 : 0,
                          flex: 1,
                          mb: '0',
                          px: '10px',
                          fontSize: '14px',
                          color: theme.palette.warning['A200'],
                        }}
                        placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                        inputProps={{ 'aria-label': 'search student' }}
                        onChange={handleSearch}
                        onClick={handleScrollDown}
                        onKeyDown={handleKeyDown}
                      />
                      <IconButton
                        type="button"
                        sx={{ p: '10px', color: theme.palette.warning['A200'] }}
                        aria-label="search"
                        onClick={handleSearchSubmit}
                      >
                        <SearchIcon
                          sx={{ color: theme.palette.warning['A200'] }}
                        />
                      </IconButton>

                      {searchWord?.length > 0 && (
                        <IconButton
                          type="button"
                          aria-label="Clear"
                          onClick={handleSearchClear}
                        >
                          <ClearIcon
                            sx={{ color: theme.palette.warning['A200'] }}
                          />
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
              {
                modalOpen && <SortingModal
                  isModalOpen={modalOpen}
                  handleCloseModal={handleCloseModal}
                  handleSorting={handleSorting}
                  routeName={pathname}
                />
              }
            </Stack>
          ) : null}
          {classId !== 'all' ? (
            <Box>
              <LearnerListHeader
                numberOfColumns={3}
                firstColumnName={t('COMMON.ATTENDANCE')}
                secondColumnName={t('COMMON.CLASS_MISSED')}
              />
              <Box>
                {inLineLoading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px',
                    }}
                  >
                    <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
                  </Box>
                ) : displayStudentList?.length > 0 ? (
                  displayStudentList.map((user: any) => (
                    <StudentsStatsList
                      key={user.userId}
                      name={user.name}
                      presentPercent={Math.floor(parseFloat(user.present_percent)) || 0}
                      classesMissed={user.absent || 0}
                      userId={user.userId}
                      cohortId={classId}
                      memberStatus={user.memberStatus}
                    />
                  ))
                ) : (
                  <>
                    <NoDataFound />
                  </>
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
        <NoDataFound />
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

export default withAccessControl(
  'accessAttendanceOverview',
  accessControl
)(AttendanceOverview);
