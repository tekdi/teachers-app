import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import Loader from '../components/Loader';
import { Session } from '../utils/Interfaces';
import SessionCardFooter from '@/components/SessionCardFooter';
import SessionsCard from '@/components/SessionCard';
import { getSessions } from '@/services/Sessionservice';
import { logEvent } from '@/utils/googleAnalytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const CenterSession: React.FC = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const getSessionsData = async () => {
      try {
        const response: Session[] = getSessions('cohortId'); // Todo add dynamic cohortId
        setSessions(response);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };

    getSessionsData();
  }, []);

  return (
    <>
      <Box textAlign={'center'}>
        <Header />
        {/* {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />} */}
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
                          sx={{ color: theme.palette.warning['A200'] }}
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
                      {t('COMMON.CENTER_SESSIONS')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="calender-container">
              {/* month calender will come here  */}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={3} px="18px">
        {sessions.map((item) => (
          <SessionsCard data={item} key={item.id}>
            <SessionCardFooter item={item} />
          </SessionsCard>
        ))}
      </Box>
    </>
  );
};

export default CenterSession;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
