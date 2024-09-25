import Header from '@/components/Header';
import MonthCalender from '@/components/MonthCalender';
import SessionsCard from '@/components/SessionCard';
import SessionCardFooter from '@/components/SessionCardFooter';
import { getEventList } from '@/services/EventService';
import { logEvent } from '@/utils/googleAnalytics';
import {
  getAfterDate,
  getBeforeDate,
  shortDateFormat,
  sortSessionsByTime,
} from '@/utils/Helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl } from '../../../../../../app.config';
import { Session } from '../../../../../utils/Interfaces';

const EventMonthView: React.FC<any> = () => {
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

          const sessionArray: any = [];
          const extraSessionArray: any = [];

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

        <Box mt={1.5} px="10px">
          <Grid container spacing={2}>
            {sessions?.map((item) => (
              <Grid xs={12} sm={6} md={6} key={item.id} item>
                <SessionsCard data={item} key={item.id}>
                  <SessionCardFooter item={item} />
                </SessionsCard>
              </Grid>
            ))}
          </Grid>
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
        mb={3}
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

        <Box mt={1.5} px="10px">
          <Grid container spacing={2}>
            {extraSessions?.map((item) => (
              <Grid xs={12} sm={6} md={6} key={item.id} item>
                <SessionsCard data={item} key={item.id}>
                  <SessionCardFooter item={item} />
                </SessionsCard>
              </Grid>
            ))}
          </Grid>
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

export default withAccessControl(
  'accessCenters',
  accessControl
)(EventMonthView);
