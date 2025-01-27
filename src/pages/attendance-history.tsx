import {
  debounce,
  getLatestEntries,
  getTodayDate,
  handleKeyDown,
  shortDateFormat,
  toPascalCase,
} from '@/utils/Helper';
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
import React, { useEffect, useRef, useState } from 'react';
import {
  AttendancePercentageProps,
  AttendanceStatusListProps,
  CohortMemberList,
  ICohort,
  user
} from '../utils/Interfaces';

import { fetchAttendanceDetails } from '@/components/AttendanceDetails';
import AttendanceStatus from '@/components/AttendanceStatus';
import AttendanceStatusListView from '@/components/AttendanceStatusListView';
import CohortSelectionSection from '@/components/CohortSelectionSection';
import NoDataFound from '@/components/common/NoDataFound';
import MarkBulkAttendance from '@/components/MarkBulkAttendance';
import MonthCalender from '@/components/MonthCalender';
import { showToastMessage } from '@/components/Toastify';
import UpDownButton from '@/components/UpDownButton';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Status, Telemetry } from '@/utils/app.constant';
import { calculatePercentage } from '@/utils/attendanceStats';
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
import { accessControl } from '../../app.config';
import Header from '../components/Header';
import Loader from '../components/Loader';
import SortingModal from '../components/SortingModal';
import { useDirection } from '../hooks/useDirection';
import { attendanceStatusList } from '../services/AttendanceService';

const UserAttendanceHistory = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const { push } = useRouter();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<ICohort>>([]);
  const [percentageAttendance, setPercentageAttendance] =
    React.useState<any>(null);
  const [attendanceProgressBarData, setAttendanceProgressBarData] =
    React.useState<any>(null);
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<user>>(
    []
  );
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<user>
  >([]);
  const [searchWord, setSearchWord] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = React.useState('');
  const [status, setStatus] = useState('');
  const [openMarkAttendance, setOpenMarkAttendance] = useState(false);
  const handleMarkAttendanceModal = () =>
    setOpenMarkAttendance(!openMarkAttendance);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);
  const [blockName, setBlockName] = React.useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<ICohort>>(cohortsData);
  const searchRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const currentDate = getTodayDate();

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

    const attendanceInfo = {
      present_students: data.presentCount,
      totalcount: data.numberOfCohortMembers,
      present_percentage:
        data.numberOfCohortMembers === 0
          ? "0"
          : `${((data.presentCount / data.numberOfCohortMembers) * 100).toFixed(2)}`,
    };

    if (shortDateFormat(selectedDate) > shortDateFormat(new Date())) {
      setAttendanceProgressBarData({});
    } else {
      setAttendanceProgressBarData({
        [shortDateFormat(selectedDate)]: attendanceInfo,
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
    ReactGA.event('mark/modify-attendance-button-clicked-attendance-history', {
      teacherId: userId,
    });

    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'mark/modify-attendance-button-clicked-attendance-history',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'attendance-history',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setClassId(localStorage.getItem('classId') ?? '');
      const classId = localStorage.getItem('classId') ?? '';
      localStorage.setItem('cohortId', classId);
      setLoading(false);
      if (token) {
        if (isActiveYear) {
          push('/attendance-history');
        } else {
          push('/centers');
        }
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, [isActiveYear]);

  useEffect(() => {
    const getAttendanceStats = async () => {
      if (classId !== '' && classId !== undefined) {
        const cohortMemberRequest: CohortMemberList = {
          limit: 300,
          page: 0,
          filters: {
            cohortId: classId,
            role: 'Student',
          },
          includeArchived: true,
        };
        const currentDate = selectedDate || new Date();
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        firstDayOfMonth.setHours(0, 0, 0, 0);
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        lastDayOfMonth.setHours(23, 59, 59, 999);
        const fromDateFormatted = shortDateFormat(firstDayOfMonth);
        const toDateFormatted = shortDateFormat(lastDayOfMonth);
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
        setPercentageAttendance(attendanceStats);
      }
    };
    getAttendanceStats();
  }, [classId, selectedDate, handleSaveHasRun]);

  const getCohortMemberList = async () => {
    setLoading(true);
    try {
      if (classId) {
        const limit = 300;
        const page = 0;
        const filters = { cohortId: classId };
        const response = await getMyCohortMemberList({
          limit,
          page,
          filters,
          includeArchived: true,
        });
        const resp = response?.result?.userDetails || [];

        if (resp) {
          const nameUserIdArray = resp
              ?.map((entry: any) => ({
                userId: entry.userId,
                name: toPascalCase(entry?.firstName || '') + ' ' + (entry?.lastName ? toPascalCase(entry.lastName) : ""),
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
          const filteredEntries = getLatestEntries(nameUserIdArray, shortDateFormat(selectedDate));
          if (filteredEntries && (selectedDate || currentDate)) {
            const userAttendanceStatusList = async () => {
              const attendanceStatusData: AttendanceStatusListProps = {
                limit: 300,
                page: 0,
                filters: {
                  fromDate: shortDateFormat(selectedDate || currentDate),
                  toDate: shortDateFormat(selectedDate || currentDate),
                  contextId: classId,
                  scope: 'student',
                },
              };
              const res = await attendanceStatusList(attendanceStatusData);
              const response = res?.data?.attendanceList;
              if (response) {
                const getUserAttendanceStatus = (
                  filteredEntries: any[],
                  response: any[]
                ) => {
                  const userAttendanceArray: {
                    userId: any;
                    attendance: any;
                  }[] = [];

                  filteredEntries.forEach((user) => {
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
                  filteredEntries,
                  response
                );

                if (userAttendanceArray) {
                  const mergeArrays = (
                    filteredEntries: {
                      userId: string;
                      name: string;
                      memberStatus: string;
                      updatedAt: string;
                    }[],
                    userAttendanceArray: {
                      userId: string;
                      attendance: string;
                    }[]
                  ): {
                    userId: string;
                    name: string;
                    memberStatus: string;
                    attendance: string;
                    updatedAt: string;
                  }[] => {
                    const newArray: {
                      userId: string;
                      name: string;
                      memberStatus: string;
                      attendance: string;
                      updatedAt: string;
                    }[] = [];
                    filteredEntries.forEach((user) => {
                      const userId = user.userId;
                      const attendanceEntry = userAttendanceArray.find(
                        (entry) => entry.userId === userId
                      );
                      if (attendanceEntry) {
                        newArray.push({
                          userId,
                          name: user.name,
                          memberStatus: user.memberStatus,
                          attendance: attendanceEntry.attendance,
                          updatedAt: user.updatedAt,
                        });
                      }
                    });
                    if (newArray.length !== 0) {
                      setCohortMemberList(newArray);
                      setDisplayStudentList(newArray);
                    } else {
                      setCohortMemberList(filteredEntries);
                      setDisplayStudentList(filteredEntries);
                    }
                    return newArray;
                  };
                  mergeArrays(filteredEntries, userAttendanceArray);
                }
              }
              setLoading(false);
            };
            userAttendanceStatusList();
          }
          if (filteredEntries && (selectedDate || currentDate)) {
            fetchAttendanceDetails(
              filteredEntries,
              selectedDate,
              classId,
              handleAttendanceDataUpdate
            );
          }
        } else {
          setDisplayStudentList([]);
        }
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
  }, [classId, selectedDate, handleSaveHasRun]);

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    handleSelectedDateChange(selectedDate);
  }, []);

  const handleActiveStartDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  // const getAllDatesInRange = (startDate: string, endDate: string): string[] => {
  //   const datesArray: string[] = [];
  //   const currentDate = new Date(startDate);
  //   const lastDate = new Date(endDate);

  //   while (currentDate <= lastDate) {
  //     datesArray.push(shortDateFormat(currentDate));
  //     currentDate.setDate(currentDate.getDate() + 1);
  //   }

  //   return datesArray;
  // };

  const handleSelectedDateChange = (date: Date | Date[] | null) => {
    setSelectedDate(date as Date);
  };

  // const handleUpdate = async (date: string, status: string) => {
  //   const trimmedContextId = classId.trim();
  //   if (userId && trimmedContextId) {
  //     const attendanceData: AttendanceParams = {
  //       attendanceDate: date,
  //       attendance: status,
  //       userId,
  //       contextId: trimmedContextId,
  //     };
  //     setLoading(true);
  //   }
  // };

  // function getStateByCohortId(cohortId: any) {
  //   const cohort = cohortsData?.find((item) => item.cohortId === cohortId);
  //   return cohort ? cohort?.state : null;
  // }

  const handleSearchClear = () => {
    setSearchWord('');
    debouncedSearch.cancel();
    setDisplayStudentList(cohortMemberList);
  };

  // debounce use for searching time period is 2 sec
  const debouncedSearch = debounce((value: string) => {
    const filteredList = cohortMemberList?.filter((user: any) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayStudentList(filteredList || []);
  }, 200);

  // handle search student data
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = event.target.value.replace(/\s{2,}/g, " ").trimStart();
    setSearchWord(trimmedValue);
    ReactGA.event('search-by-keyword-attendance-history-age', {
      keyword: trimmedValue,
    });
    if (trimmedValue.length >= 3) {
      debouncedSearch(trimmedValue);
    } else if (trimmedValue === '') {
      debouncedSearch.cancel();
      setDisplayStudentList(cohortMemberList);
    } else {
      setDisplayStudentList(cohortMemberList);
    }
  };

  const handleSearchSubmit = () => {
    const filteredList = cohortMemberList?.filter((user: any) =>
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

  // handle sorting data
  const handleSorting = (sortByName: string, sortByAttendance: string) => {
    handleCloseModal();
    const sortedData = [...cohortMemberList];

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
    switch (sortByAttendance) {
      case 'pre':
        sortedData.sort((a, b) => {
          if (
            a.memberStatus === Status.DROPOUT &&
            b.memberStatus !== Status.DROPOUT
          )
            return 1;
          if (
            a.memberStatus !== Status.DROPOUT &&
            b.memberStatus === Status.DROPOUT
          )
            return -1;
          if (a.attendance === 'present' && b.attendance === 'absent')
            return -1;
          if (a.attendance === 'absent' && b.attendance === 'present') return 1;
          return 0;
        });
        break;
      case 'abs':
        sortedData.sort((a, b) => {
          if (
            a.memberStatus === Status.DROPOUT &&
            b.memberStatus !== Status.DROPOUT
          )
            return 1;
          if (
            a.memberStatus !== Status.DROPOUT &&
            b.memberStatus === Status.DROPOUT
          )
            return -1;
          if (a.attendance === 'absent' && b.attendance === 'present')
            return -1;
          if (a.attendance === 'present' && b.attendance === 'absent') return 1;
          return 0;
        });
        break;
    }
    setDisplayStudentList(sortedData);
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
    setDisplayStudentList(updatedAttendanceList);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleScrollDown = () => {
    if (inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const scrollMargin = 20;
      const scrollY = window.scrollY;
      const targetY = inputRect.top + scrollY - scrollMargin;
      window.scrollTo({ top: targetY - 170, behavior: 'smooth' });
    }
  };

  const darkMode =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('mui-mode')
      : null;

  return (
    <Box minHeight="100vh" textAlign={'center'}>
      <Header />
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      <Box display={'flex'} justifyContent={'center'}>
        <Box
          sx={{
            width: '100%',
            '@media (max-width: 700px)': {
              width: '100%',
            },
          }}
        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'1rem'}
            padding={'1rem 20px 0.5rem'}
            alignItems={'center'}
          >
            <Box
              display={'flex'}
              sx={{ color: theme.palette.warning['A200'] }}
              gap={'10px'}
              width={'100%'}
              paddingTop={'10px'}
            >
              <Box className="d-md-flex w-100 space-md-between min-align-md-center">
                <Box display={'flex'} gap={'10px'}>
                  <Box
                    onClick={() => {
                      window.history.back();
                      logEvent({
                        action: 'back-button-clicked-attendance-history-page',
                        category: 'Attendance History Page',
                        label: 'Back Button Clicked',
                      });
                    }}
                  >
                    <Box>
                      <KeyboardBackspaceOutlinedIcon
                        cursor={'pointer'}
                        sx={{
                          color: theme.palette.warning['A200'],
                          transform: isRTL ? ' rotate(180deg)' : 'unset',
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography
                    marginBottom={'0px'}
                    fontSize={'22px'}
                    color={theme.palette.warning['A200']}
                    className="flex-basis-md-30"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {t('ATTENDANCE.DAY_WISE_ATTENDANCE')}
                  </Typography>
                </Box>

                <Box className="w-100 d-md-flex flex-md-end">
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
                    setManipulatedCohortData={setManipulatedCohortData}
                    isManipulationRequired={false}
                    blockName={blockName}
                    setBlockName={setBlockName}
                    handleSaveHasRun={handleSaveHasRun}
                    setHandleSaveHasRun={setHandleSaveHasRun}
                    isCustomFieldRequired={true}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            pl={1}
            borderBottom={1}
            className="top-md-0"
            borderTop={1}
            sx={{
              position: 'sticky',
              top: '65px',
              zIndex: 1000,
              backgroundColor: theme.palette.warning['A400'],
              // boxShadow: '0px 1px 3px 0px #0000004D',
              boxShadow:
                darkMode === 'dark'
                  ? '0px 4px 8px 3px #ffffff1a'
                  : '0px 4px 8px 3px #00000026',
              borderTop:
                darkMode === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.15)',
              borderBottom: 'unset ',
              padding: '5px 10px',
            }}
          >
            <Box>
              <AttendanceStatus
                date={selectedDate}
                formattedAttendanceData={attendanceProgressBarData}
                onDateSelection={selectedDate}
                onUpdate={handleOpen}
              />
            </Box>
          </Box>

          <Box className="calender-container">
            <MonthCalender
              formattedAttendanceData={percentageAttendance}
              onChange={handleActiveStartDateChange}
              onDateChange={handleSelectedDateChange}
            />
          </Box>
          <Box mt={2}>
            {/*----------------------------search and Sort---------------------------------------*/}
            <Stack mr={1} ml={1}>
              <Box
                mt={'16px'}
                mb={3}
                sx={{ padding: '0 10px' }}
                boxShadow={'none'}
              >
                <Grid
                  container
                  alignItems="center"
                  display={'flex'}
                  justifyContent="space-between"
                >
                  <Grid item xs={8} ref={searchRef}>
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
                        sx={{
                          flex: 1,
                          mb: '0',
                          fontSize: '14px',
                          color: theme.palette.warning['A200'],
                          px: '10px',
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
                        <SearchIcon />
                      </IconButton>

                      {searchWord?.length > 0 && (
                        <IconButton
                          type="button"
                          aria-label="Clear"
                          onClick={handleSearchClear}
                        >
                          <ClearIcon
                            sx={{
                              color: theme.palette.warning['A200'],
                            }}
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
              <SortingModal
                isModalOpen={modalOpen}
                handleCloseModal={handleCloseModal}
                handleSorting={handleSorting}
                routeName={pathname}
              />
            </Stack>
            <Box>
              {status && (
                <AttendanceStatus
                  date={selectedDate}
                  formattedAttendanceData={percentageAttendance}
                  onDateSelection={selectedDate}
                  onUpdate={handleMarkAttendanceModal}
                />
              )}
            </Box>
            {/* <LearnerListHeader
              numberOfColumns={3}
              firstColumnName={t('ATTENDANCE.PRESENT')}
              secondColumnName={t('ATTENDANCE.ABSENT')}
            /> */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 18px',
                borderBottom: `1px solid ${theme.palette.warning['A100']}`,
                bgcolor: theme.palette.warning['A100'],
              }}
            >
              <Box
                sx={{
                  color: theme.palette.warning[400],
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {t('COMMON.LEARNER_NAME')}
              </Box>
              <Box sx={{ display: 'flex', gap: '20px' }}>
                <Box
                  sx={{
                    color: theme.palette.warning[400],
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {t('ATTENDANCE.PRESENT')}
                </Box>
                <Box
                  sx={{
                    color: theme.palette.warning[400],
                    fontSize: '11px',
                    paddingRight: '10px',
                    fontWeight: 600,
                  }}
                >
                  {t('ATTENDANCE.ABSENT')}
                </Box>
              </Box>
            </Box>
            {cohortMemberList?.length > 0 ? (
              <Box>
                {displayStudentList.length >= 1 ? (
                  displayStudentList?.map((user: any) => (
                    <AttendanceStatusListView
                      isDisabled={true}
                      showLink={true}
                      key={user.userId}
                      userData={user}
                      isEdit={false}
                      bulkAttendanceStatus={bulkAttendanceStatus}
                      handleBulkAction={submitBulkAttendanceAction}
                      attendanceDate={selectedDate}
                    />
                  ))
                ) : (
                  <NoDataFound />
                )}
              </Box>
            ) : (
              <NoDataFound bgColor={theme.palette.warning['A400']} />
            )}
          </Box>
          {open && (
            <MarkBulkAttendance
              open={open}
              onClose={handleClose}
              classId={classId}
              selectedDate={selectedDate}
              onSaveSuccess={() => setHandleSaveHasRun(!handleSaveHasRun)}
              memberList={attendanceData.cohortMemberList}
              presentCount={attendanceData.presentCount}
              absentCount={attendanceData.absentCount}
              numberOfCohortMembers={attendanceData.numberOfCohortMembers}
              dropoutMemberList={attendanceData.dropoutMemberList}
              dropoutCount={attendanceData.dropoutCount}
              bulkStatus={attendanceData.bulkAttendanceStatus}
            />
          )}
        </Box>
      </Box>
      {displayStudentList.length >= 1 ? <UpDownButton /> : null}
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

// export default UserAttendanceHistory;
export default withAccessControl(
  'accessAttendanceHistory',
  accessControl
)(UserAttendanceHistory);
