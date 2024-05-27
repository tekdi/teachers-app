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
import React, { useEffect, useState } from 'react';
import { debounce, getTodayDate, toPascalCase } from '@/utils/Helper';

import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import ClearIcon from '@mui/icons-material/Clear';
import DateRangePopup from '@/components/DateRangePopup';
import Header from '@/components/Header';
import LearnerListHeader from '@/components/LearnerListHeader';
import Loader from '@/components/Loader';
import OverviewCard from '@/components/OverviewCard';
import SearchIcon from '@mui/icons-material/Search';
import SortingModal from '@/components/SortingModal';
import StudentsStatsList from '@/components/LearnerAttendanceStatsListView';
import { classesMissedAttendancePercentList } from '@/services/AttendanceService';
import { cohort } from '@/utils/Interfaces';
import { cohortList } from '@/services/CohortServices';
import { getMyCohortMemberList } from '@/services/MyClassDetailsService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

interface AttendanceOverviewProps {
  //   buttonText: string;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [learnerData, setLearnerData] = React.useState<Array<any>>([]);
  const [isFromDate, setIsFromDate] = useState(getTodayDate());
  const [isToDate, setIsToDate] = useState(getTodayDate());
  const [displayStudentList, setDisplayStudentList] = React.useState<
    Array<any>
  >([]);
  const [selectedValue, setSelectedValue] = React.useState<string>(
    t('COMMON.AS_OF_TODAY')
  );

  const theme = useTheme<any>();
  const pathname = usePathname();

  const menuItems = [
    t('COMMON.LAST_SEVEN_DAYS'),
    t('COMMON.AS_OF_TODAY'),
    t('COMMON.AS_OF_LAST_WEEK'),
    t('COMMON.LAST_MONTH'),
    t('COMMON.LAST_SIX_MONTHS'),
    t('COMMON.CUSTOM_RANGE'),
  ];

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
            });
            let resp = response?.data?.result?.userId;
            if (resp) {
              const filteredData = Object.keys(resp).map((userId) => ({
                userId,
                absent: resp[userId].absent,
                present_percent: resp[userId].present_percentage,
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
                setLearnerData(mergedArray);
                setDisplayStudentList(mergedArray);
              }
            }
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
  }, [classId, isToDate, isFromDate]);

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
  };

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
  }, 200);

  // handle search student data
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(event.target.value);
    if (event.target.value.length >= 3) {
      debouncedSearch(event.target.value);
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
          if (isNaN(aPercent)) return 1;
          if (isNaN(bPercent)) return -1;
          return bPercent - aPercent; 
        });
        break;
      case 'low':
        sortedData.sort((a, b) => {
          const aPercent = parseFloat(b.present_percent);
          const bPercent = parseFloat(a.present_percent);
          if (isNaN(aPercent)) return 1;
          if (isNaN(bPercent)) return -1;
          return aPercent - bPercent; 
        });
        break;
    }

    // Sorting by classesMissed
    switch (sortByClassesMissed) {
      case 'more':
        sortedData.sort((a, b) => parseFloat(b.absent) - parseFloat(a.absent));
        sortedData.sort((a, b) => {
          const aClassMissed = parseFloat(a.absent);
          const bClassMissed = parseFloat(b.absent);
          if (isNaN(aClassMissed)) return 1;
          if (isNaN(bClassMissed)) return -1;
          return bClassMissed - aClassMissed; 
        });
        break;
      case 'less':
        sortedData.sort((b, a) => parseFloat(a.absent) - parseFloat(b.absent));
        sortedData.sort((b, a) => {
          const aClassMissed = parseFloat(a.absent);
          const bClassMissed = parseFloat(b.absent);
          if (isNaN(aClassMissed)) return 1;
          if (isNaN(bClassMissed)) return -1;
          return aClassMissed - bClassMissed; 
        });
        break;
    }

    setDisplayStudentList(sortedData);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box width={'100%'}>
          <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
            {t('ATTENDANCE.ATTENDANCE_OVERVIEW')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 0.6 }}>
        <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
          <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
            <Select
              value={classId}
              onChange={handleCohortSelection}
              displayEmpty
              disabled = {cohortsData?.length == 1 ? true : false}
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
      </Box>

      <DateRangePopup
        menuItems={menuItems}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        onDateRangeSelected={handleDateRangeSelected}
      />

      <Box display={'flex'} className="card_overview">
        <Grid container spacing={0}>
          <Grid item xs={5}>
            <OverviewCard
              label={t('ATTENDANCE.CENTER_ATTENDANCE')}
              value="71%"
            />
          </Grid>
          <Grid item xs={7}>
            <OverviewCard
              label={t('ATTENDANCE.LOW_ATTENDANCE_STUDENTS')}
              value="Bharat Kumar, Ankita Kulkarni, +3 more"
            />
          </Grid>
        </Grid>
      </Box>

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
            <Grid item xs={4} display={'flex'} justifyContent={'flex-end'}>
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
      <LearnerListHeader
        numberOfColumns={3}
        firstColumnName={t('COMMON.ATTENDANCE')}
        secondColumnName={t('COMMON.CLASS_MISSED')}
      />
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      {learnerData?.length > 0 ? (
        <Box>
          {displayStudentList?.map((user: any) => (
            <StudentsStatsList
              key={user.userId}
              name={user.name}
              presentPercent={Math.floor(parseFloat(user.present_percent)) || 0}
              classesMissed={user.absent || 0}
              userId={user.userId}
              cohortId={classId}
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
