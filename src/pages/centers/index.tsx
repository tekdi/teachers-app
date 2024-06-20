import { Box, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { cohort, cohortAttendancePercentParam } from '@/utils/Interfaces';

import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Header from '@/components/Header';
import Image from 'next/image';
import Loader from '@/components/Loader';
import building from '../../assets/images/apartment.png';
import { cohortList } from '@/services/CohortServices';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { showToastMessage } from '@/components/Toastify';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const TeachingCenters = () => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [classId, setClassId] = React.useState('');
  const [manipulatedCohortData, setManipulatedCohortData] =
    React.useState<Array<cohort>>(cohortsData);

  // API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      setLoading(true);
      try {
        if (userId) {
          const limit = 0;
          const page = 0;
          const filters = { userId: userId };
          const resp = await cohortList({ limit, page, filters });
          setCohortsData(resp?.results?.cohortDetails);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      }
    };
    fetchCohortList();
  }, []);

  return (
    <>
      <Header />
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      <Box sx={{ padding: '0 18px' }}>
        <Box
          textAlign={'left'}
          fontSize={'22px'}
          p={'18px 0'}
          color={theme?.palette?.warning['300']}
        >
          {t('DASHBOARD.MY_TEACHING_CENTERS')}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button
            sx={{
              border: '1px solid #1E1B16',
              borderRadius: '100px',
              height: '40px',
              width: '91px',
            }}
            className="text-1E"
            endIcon={<AddIcon />}
          >
            {t('COMMON.ADD')}
          </Button>
          <Box sx={{ display: 'flex', gap: '5px' }}>
            <ErrorOutlineIcon style={{ fontSize: '15px' }} />

            <Box className="fs-12 fw-500 ">{t('COMMON.ADD_CENTER')}</Box>
          </Box>
        </Box>
        <Box className="linerGradient" sx={{ borderRadius: '16px' }} p={2}>
          {cohortsData?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Box
                  onClick={() => {
                    router.push(`/centers/${item.cohortId}`);
                  }}
                  sx={{ cursor: 'pointer', marginBottom: '20px' }}
                >
                  <Box>Khapari Dharmu, Chimur, Chandrapur</Box>
                  {/* will come from API */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      background: '#fff',
                      height: '56px',
                      borderRadius: '8px',
                    }}
                    mt={1}
                  >
                    <Box
                      sx={{
                        width: '56px',
                        display: 'flex',
                        background: '#FFDEA1',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px',
                      }}
                    >
                      <Image src={building} alt="apartment" />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0 10px',
                      }}
                    >
                      <Box>{item.name}</Box>
                      {/* will come from API */}

                      <ChevronRightIcon />
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}

          {/* <Box mt={3}>
            <Box sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}>
              Bhiwapur, Nagpur (Remote)
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                background: '#fff',
                height: '56px',
                borderRadius: '8px',
              }}
              mt={1}
            >
              <Box
                sx={{
                  width: '56px',
                  display: 'flex',
                  background: '#FFDEA1',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                }}
              >
                <Image src={building} alt="apartment" />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '0 10px',
                }}
              >
                <Box
                  sx={{ fontSize: '16px', color: theme.palette.warning['300'] }}
                >
                  Bhivapur
                </Box>

                <ChevronRightIcon />
              </Box>
            </Box>
          </Box> */}
        </Box>
      </Box>
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

export default TeachingCenters;
