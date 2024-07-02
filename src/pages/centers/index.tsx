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

  // API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return;
      }

      setLoading(true);

      try {
        const limit = 0;
        const page = 0;
        const filters = { userId: userId };
        const resp = await cohortList({ limit, page, filters });

        const cohorts = resp?.results?.cohortDetails || [];
        setCohortsData(cohorts);
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
      } finally {
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
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Button
            sx={{
              border: '1px solid #1E1B16',
              borderRadius: '100px',
              height: '40px',
              width: '91px',
               color: theme.palette.error.contrastText,
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
        </Box> */}
        <Box
          className="linerGradient"
          sx={{
            borderRadius: '16px',
            mt: 2,
            '@media (min-width: 900px)': {
              borderRadius: '8px',
            },
          }}
          padding={'16px 16px 2px'}
        >
          {cohortsData?.map((cohort: any, index) => {
            return (
              <React.Fragment key={index}>
                <Box
                  onClick={() => {
                    router.push(`/centers/${cohort.cohortId}`);
                    localStorage.setItem('classId', cohort.cohortId);
                  }}
                  sx={{ cursor: 'pointer', marginBottom: '20px' }}
                >
                  <Box
                    sx={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: theme.palette.warning['300'],
                    }}
                  >
                    {cohort?.['customFields']?.address?.value}
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
                        background: theme.palette.primary.light,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px',
                      }}
                    >
                      <Image src={building} alt="center" />
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
                        sx={{
                          fontSize: '16px',
                          fontWeight: '400',
                          color: theme.palette.warning['300'],
                        }}
                      >
                        {cohort?.name}
                      </Box>
                      <ChevronRightIcon />
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })}
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
