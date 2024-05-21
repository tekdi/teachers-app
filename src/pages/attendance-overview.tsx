'use client';

import Header from '@/components/Header';
import OverviewCard from '@/components/OverviewCard';
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
import { useTranslation } from 'next-i18next';
import { cohortList } from '@/services/CohortServices';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { cohort } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';


interface AttendanceOverviewProps {
  //   buttonText: string;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [classId, setClassId] = React.useState('');
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme<any>();


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

  return (
    <>
      <Box>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box width={'100%'}>
            <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
              {t('Attendance Overview')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 0.6 }}>
          <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
            <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
              <Select
                value={classId} 
                onChange={''}
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
        </Box>

        <Box sx={{ mt: 0.6 }}>
          <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
            <FormControl className="drawer-select" sx={{ m: 1, width: '100%' }}>
              <Select
                // value={classId}
                // onChange={''}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                className="SelectLanguages fs-14 fw-500"
                style={{
                  borderRadius: '0.5rem',
                  //   color: theme.palette.warning['200'],
                  width: '100%',
                  marginBottom: '0rem',
                }}
              >
                {/* {cohortsData?.length !== 0 ? (
                  cohortsData?.map((cohort) => (
                    <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                      {cohort.name}
                    </MenuItem>
                  ))
                ) : (
                  <Typography style={{ fontWeight: 'bold' }}>
                    {t('COMMON.NO_DATA_FOUND')}
                  </Typography>
                )} */}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box display={'flex'} className="card_overview">
          <Grid container spacing={0}>
            <Grid item xs={5}>
              <OverviewCard label="Centre Attendance" value="71%" />
            </Grid>
            <Grid item xs={7}>
              <OverviewCard
                label="Low Attendance Students"
                value="Bharat Kumar, Ankita Kulkarni, +3 more"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default AttendanceOverview;
