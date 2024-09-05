import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Session } from '../../../../../utils/Interfaces';
import SessionCardFooter from '@/components/SessionCardFooter';
import SessionsCard from '@/components/SessionCard';
import { logEvent } from '@/utils/googleAnalytics';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Box, Typography } from '@mui/material';
import {
  getAfterDate,
  getBeforeDate,
  shortDateFormat,
  sortSessionsByTime,
} from '@/utils/Helper';
import { getEventList } from '@/services/EventService';
import { showToastMessage } from '@/components/Toastify';
import MonthCalender from '@/components/MonthCalender';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next';

const eventMonthView = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const router = useRouter();
  const { date }: any = router.query;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [percentageAttendance, setPercentageAttendance] =
    React.useState<any>(null);
  const [extraSessions, setExtraSessions] = React.useState<Session[]>();

  useEffect(() => {
    const getSessionsData = async () => {
      try {
        const date = shortDateFormat(selectedDate);
        let cohortId;

        if (typeof window !== 'undefined' && window.localStorage) {
          cohortId = localStorage.getItem('classId') || '';
        }

        if (cohortId !== '') {
          const afterDate = getAfterDate(date);
          const beforeDate = getBeforeDate(date);
          const limit = 0;
          const offset = 0;
          const filters = {
            date: {
              after: afterDate,
              before: beforeDate,
            },
            cohortId: cohortId,
            status: ['live'],
          };

          const response = await getEventList({ limit, offset, filters });

          let sessionArray: any = [];
          let extraSessionArray: any = [];

          if (response?.events.length > 0) {
            response?.events.forEach((event: any) => {
              if (event.isRecurring) {
                sessionArray.push(event);
              } else {
                extraSessionArray.push(event);
              }
            });
          }

          if (extraSessionArray.length > 0) {
            const { sessionList, index } =
              sortSessionsByTime(extraSessionArray);
            setExtraSessions(sessionList);
          }

          if (sessionArray.length > 0) {
            const { sessionList, index } = sortSessionsByTime(sessionArray);
            setSessions(sessionList);
          }
        }
      } catch (error) {
        setSessions([]);
        setExtraSessions([]);
      }
    };

    getSessionsData();
  }, [selectedDate]);

  const handleActiveStartDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    handleSelectedDateChange(selectedDate);
  }, []);

  const handleSelectedDateChange = (date: Date | Date[] | null) => {
    setSelectedDate(date as Date);
  };

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
                          action: 'back-button-clicked-events-month-page',
                          category: 'events month Page',
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
              <MonthCalender
                formattedAttendanceData={percentageAttendance}
                onChange={handleActiveStartDateChange}
                onDateChange={handleSelectedDateChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        mt={3}
        px="14px"
        sx={{
          fontSize: '16px',
          fontWeight: '500',
          color: theme?.palette?.warning['300'],
        }}
      >
        <Typography sx={{ marginLeft: '10px' }}>
          {t('CENTER_SESSION.PLANNED_SESSIONS')}
        </Typography>

        <Box mt={3} px="18px">
          {sessions?.map((item) => (
            <SessionsCard data={item} key={item.id}>
              <SessionCardFooter item={item} />
            </SessionsCard>
          ))}
          {sessions && sessions?.length === 0 && (
            <Box
              className="fs-12 fw-400 italic"
              sx={{ color: theme.palette.warning['300'] }}
            >
              {t('COMMON.NO_SESSIONS_SCHEDULED')}
            </Box>
          )}
        </Box>
      </Box>

      <Box
        mt={3}
        px="14px"
        sx={{
          fontSize: '16px',
          fontWeight: '500',
          color: theme?.palette?.warning['300'],
        }}
      >
        <Typography sx={{ marginLeft: '10px' }}>
          {t('CENTER_SESSION.EXTRA_SESSION')}
        </Typography>

        <Box mt={3} px="18px">
          {extraSessions?.map((item) => (
            <SessionsCard data={item} key={item.id}>
              <SessionCardFooter item={item} />
            </SessionsCard>
          ))}
          {extraSessions && extraSessions?.length === 0 && (
            <Box
              className="fs-12 fw-400 italic"
              sx={{ color: theme.palette.warning['300'] }}
            >
              {t('COMMON.NO_SESSIONS_SCHEDULED')}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default eventMonthView;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
