import {
  AttendanceParams,
  AttendancePercentageProps,
  AttendanceStatusListProps,
  cohort,
} from '../utils/Interfaces';
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
import React, { useEffect, useState } from 'react';
import {
  attendanceInPercentageStatusList,
  attendanceStatusList,
} from '../services/AttendanceService';
import {
  debounce,
  formatToShowDateMonth,
  getTodayDate,
  shortDateFormat,
  toPascalCase,
} from '@/utils/Helper';

import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import AttendanceStatus from '@/components/AttendanceStatus';
import AttendanceStatusListView from '@/components/AttendanceStatusListView';
import ClearIcon from '@mui/icons-material/Clear';
import Header from '../components/Header';
import { Height } from '@mui/icons-material';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import LearnerListHeader from '@/components/LearnerListHeader';
import Loader from '../components/Loader';
import MarkBulkAttendance from '@/components/MarkBulkAttendance';
import MonthCalender from '@/components/MonthCalender';
import SearchIcon from '@mui/icons-material/Search';
import SortingModal from '../components/SortingModal';
import UpDownButton from '@/components/UpDownButton';
import { cohortList } from '@/services/CohortServices';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

interface user {
  userId: string;
  name: string;
  attendance?: string;
  key?: string;
}

const UserAttendanceHistory = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { push } = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState(null);
  const [percentageAttendance, setPercentageAttendance] =
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
  const [open, setOpen] = useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);

  const pathname = usePathname();
  let userId: string;
  const currentDate = getTodayDate();
  // =localStorage.getItem('userId') || '';
  // localStorage.getItem('parentCohortId') ||
  // '60d4f919-cfb1-45a2-8502-ccc9b326ef48';

  const handleBackEvent = () => {
    window.history.back();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setLoading(false);
      if (token) {
        push('/attendance-history');
      } else {
        push('/login', undefined, { locale: 'en' });
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
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [classId, handleSaveHasRun]);

  //API for getting student list
  const getCohortMemberList = async () => {
    setLoading(true);
    try {
      if (classId) {
        let limit = 300;
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
                limit: 300,
                page: 0,
                filters: {
                  fromDate: shortDateFormat(selectedDate || currentDate),
                  toDate: shortDateFormat(selectedDate || currentDate),
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
                    if (attendance) {
                      userAttendanceArray.push({
                        userId,
                        attendance: attendance.attendance,
                      });
                    }
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
                    const newArray: {
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
                      setCohortMemberList(newArray);
                      setDisplayStudentList(newArray);
                    } else {
                      setCohortMemberList(nameUserIdArray);
                      setDisplayStudentList(nameUserIdArray);
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

  useEffect(() => {
    getCohortMemberList();
  }, [classId, selectedDate]);

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
    setSelectedDate(date);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCenter(event.target.value as string);
  };

  const handleUpdate = async (date: string, status: string) => {
    const trimmedContextId = classId.trim();
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
    setHandleSaveHasRun(!handleSaveHasRun);
  };

  const handleSearchClear = () => {
    setSearchWord('');
    setDisplayStudentList(cohortMemberList);
  };

  // debounce use for searching time period is 2 sec
  const debouncedSearch = debounce((value: string) => {
    let filteredList = cohortMemberList?.filter((user: any) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayStudentList(filteredList);
  }, 200);

  // handle search student data
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
    if (event.target.value.length >= 3) {
      debouncedSearch(event.target.value);
    } else {
      setDisplayStudentList(cohortMemberList);
    }
  };

  const handleSearchSubmit = () => {
    let filteredList = cohortMemberList?.filter((user: any) =>
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
    let sortedData = [...cohortMemberList];

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
          if (a.attendance === 'present' && b.attendance === 'absent')
            return -1;
          if (a.attendance === 'absent' && b.attendance === 'present') return 1;
          return 0;
        });
        break;
      case 'abs':
        sortedData.sort((a, b) => {
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
    console.log('updatedAttendanceList', updatedAttendanceList);
    setCohortMemberList(updatedAttendanceList);
    setDisplayStudentList(updatedAttendanceList);
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
            padding={'0.5rem 1rem'}
            alignItems={'center'}
          >
            <Box
              display={'flex'}
              sx={{ color: theme.palette.warning['A200'] }}
              gap={'10px'}
              width={'100%'}
              paddingTop={'10px'}
            >
              <Box onClick={handleBackEvent}>
                <Box>
                  <KeyboardBackspaceOutlinedIcon
                    cursor={'pointer'}
                    sx={{ color: theme.palette.warning['A200'] }}
                  />
                </Box>
              </Box>

              <Typography
                marginBottom={'0px'}
                fontSize={'22px'}
                color={theme.palette.warning['A200']}
              >
                {t('ATTENDANCE.DAY_WISE_ATTENDANCE')}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ minWidth: 120, gap: '15px', paddingBottom: '10px' }}
            display={'flex'}
          >
            <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
              <Select
                value={classId}
                onChange={handleCohortSelection}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                disabled={cohortsData?.length == 1 ? true : false}
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
            borderBottom={1}
            borderTop={1}
            sx={{
              position: 'sticky',
              top: '62px',
              zIndex: 1000,
              backgroundColor: 'white',
              // boxShadow: '0px 1px 3px 0px #0000004D',
              boxShadow: '0px 4px 8px 3px #00000026',
              border: '1px solid #D0C5B4',
            }}
            py={'5px'}
          >
            <Box>
              <AttendanceStatus
                date={selectedDate}
                formattedAttendanceData={percentageAttendance}
                onDateSelection={selectedDate}
                onUpdate={handleOpen}
              />
            </Box>
          </Box>

          <MonthCalender
            formattedAttendanceData={percentageAttendance}
            onChange={handleActiveStartDateChange}
            onDateChange={handleSelectedDateChange}
          />
          <Box mt={2}>
            {/*----------------------------search and Sort---------------------------------------*/}
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
                      sx={{
                        display: 'flex',
                        alignItems: 'center',

                        borderRadius: '100px',
                        background: theme.palette.warning.A700,
                        boxShadow: 'none',
                      }}
                    >
                      <InputBase
                        value={searchWord}
                        sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                        placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                        inputProps={{ 'aria-label': 'search student' }}
                        onChange={handleSearch}
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
                padding: '8px 8px',
                borderBottom: '1px solid #D0C5B4',
                bgcolor: '#E6E6E6',
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
              <Box sx={{ display: 'flex', gap: '13px' }}>
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
                {displayStudentList?.map((user: any) => (
                  <AttendanceStatusListView
                    isDisabled={true}
                    showLink={true}
                    key={user.userId}
                    userData={user}
                    isEdit={false}
                    bulkAttendanceStatus={bulkAttendanceStatus}
                    handleBulkAction={submitBulkAttendanceAction}
                  />
                ))}
              </Box>
            ) : (
              <Box
                display={'flex'}
                justifyContent={'center'}
                mt={2}
                p={'1rem'}
                borderRadius={'1rem'}
                bgcolor={'secondary.light'}
              >
                <Typography>{t('COMMON.NO_DATA_FOUND')}</Typography>
              </Box>
            )}
          </Box>

          <MarkBulkAttendance
            open={open}
            onClose={handleClose}
            classId={classId}
            selectedDate={selectedDate}
            onSaveSuccess={() => setHandleSaveHasRun(!handleSaveHasRun)}
          />
        </Box>
      </Box>
      <UpDownButton />
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
