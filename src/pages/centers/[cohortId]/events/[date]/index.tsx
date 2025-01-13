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
  toPascalCase,
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
import {
  accessControl,
  dashboardDaysLimit,
} from '../../../../../../app.config';
import { useDirection } from '../../../../../hooks/useDirection';

import {
  CustomField,
  Session,
  eventFilters,
} from '../../../../../utils/Interfaces';
import { getCohortDetails } from '@/services/CohortServices';
import useEventDates from '@/hooks/useEventDates';
import { sessionType } from '@/utils/app.constant';

const EventMonthView: React.FC<any> = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const router = useRouter();
  const { cohortId }: any = router.query;
  const { showAll } = router.query;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [percentageAttendance, setPercentageAttendance] =
    React.useState<any>(null);
  const [extraSessions, setExtraSessions] = React.useState<Session[]>();
  const [eventDeleted, setEventDeleted] = React.useState(false);
  const [eventUpdated, setEventUpdated] = React.useState(false);
  const [cohortType, setCohortType] = React.useState<string>();
  const [medium, setMedium] = React.useState<string>();
  const [grade, setGrade] = React.useState<string>();
  const [board, setBoard] = React.useState<string>();
  const [state, setState] = React.useState<string>();

  let userId: string = '';
  let classId: string = '';
  if (typeof window !== 'undefined' && window.localStorage) {
    userId = localStorage.getItem('userId') || '';
    classId = localStorage.getItem('classId') || '';
  }
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
          const filters: eventFilters = {
            date: {
              after: afterDate,
              before: beforeDate,
            },
            status: ['live'],
          };

          if (showAll === '1' && userId) {
            filters['createdBy'] = userId;
          } else {
            filters['cohortId'] = cohortId;
          }

          const response = await getEventList({ limit, offset, filters });

          const sessionArray: any = [];
          const extraSessionArray: any = [];

          if (response?.events.length > 0) {
            response?.events.forEach((event: any) => {
              if (event?.metadata?.type === sessionType.PLANNED) {
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
        setEventUpdated(false);
        setEventDeleted(false);
      } catch (error) {
        setSessions([]);
        setExtraSessions([]);
      }
    };

    getSessionsData();
  }, [selectedDate, eventUpdated, eventDeleted]);

  const modifyAttendanceLimit = dashboardDaysLimit;

  let eventDates: any;
  if (showAll === '1') {
    eventDates = useEventDates(
      userId,
      'userId',
      modifyAttendanceLimit,
      selectedDate,
      eventUpdated,
      eventDeleted
    );
  } else {
    eventDates = useEventDates(
      cohortId,
      'cohortId',
      modifyAttendanceLimit,
      selectedDate,
      eventUpdated,
      eventDeleted
    );
  }
 

  const handleActiveStartDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    handleSelectedDateChange(selectedDate);
  }, []);

  const handleSelectedDateChange = (date: Date | Date[] | null) => {
    setSelectedDate(date as Date);
  };

  const handleEventDeleted = () => {
    setEventDeleted(true);
  };

  const handleEventUpdated = () => {
    setEventUpdated(true);
  };

  useEffect(() => {
    const getCohortData = async () => {
      if (classId !== '') {
        const response = await getCohortDetails(classId);

        let cohortData = null;

        if (response?.cohortData?.length) {
          cohortData = response?.cohortData[0];

          if (cohortData?.customField?.length) {
            const district = cohortData.customField.find(
              (item: CustomField) => item.label === 'DISTRICTS'
            );
            const districtCode = district?.code || '';
            const districtId = district?.fieldId || '';
            const state = cohortData.customField.find(
              (item: CustomField) => item.label === 'STATES'
            );
            setState(state.value);
            const stateCode = state?.code || '';
            const stateId = state?.fieldId || '';

            const blockField = cohortData?.customField.find(
              (field: any) => field.label === 'BLOCKS'
            );

            const address = `${toPascalCase(district?.value)}, ${toPascalCase(state?.value)}`;
            cohortData.address = address || '';

            const typeOfCohort = cohortData.customField.find(
              (item: CustomField) => item.label === 'TYPE_OF_COHORT'
            );
            setCohortType(typeOfCohort?.value);

            const medium = cohortData.customField.find(
              (item: CustomField) => item.label === 'MEDIUM'
            );
            setMedium(medium?.value);

            const grade = cohortData.customField.find(
              (item: CustomField) => item.label === 'GRADE'
            );
            setGrade(grade?.value);

            const board = cohortData.customField.find(
              (item: CustomField) => item.label === 'BOARD'
            );
            setBoard(board?.value);
          }
          // setCohortDetails(cohortData);
          // setCohortName(cohortData?.name);
        }
      }
    };
    getCohortData();
  }, [classId]);

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
                eventData={eventDates}
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
                <SessionsCard
                  data={item}
                  key={item.id}
                  showCenterName={showAll === '1' ? true : false}
                  isEventDeleted={handleEventDeleted}
                  isEventUpdated={handleEventUpdated}
                  StateName={state}
                  board={board}
                  medium={medium}
                  grade={grade}
                >
                  <SessionCardFooter
                    item={item}
                    isTopicSubTopicAdded={handleEventUpdated}
                    state={state}
                    board={board}
                    medium={medium}
                    grade={grade}
                    cohortId={cohortId}
                  />
                </SessionsCard>
              </Grid>
            ))}
          </Grid>
          {sessions && sessions?.length === 0 && (
            <Box
              className="fs-12 fw-400 italic"
              sx={{ color: theme.palette.warning['300'], marginTop: '15px' }}
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
                <SessionsCard
                  data={item}
                  key={item.id}
                  showCenterName={showAll === '1' ? true : false}
                  isEventDeleted={handleEventDeleted}
                  isEventUpdated={handleEventUpdated}
                  StateName={state}
                  board={board}
                  medium={medium}
                  grade={grade}
                >
                  <SessionCardFooter
                    item={item}
                    isTopicSubTopicAdded={handleEventUpdated}
                    state={state}
                    board={board}
                    medium={medium}
                    grade={grade}
                    cohortId={cohortId}
                  />
                </SessionsCard>
              </Grid>
            ))}
          </Grid>
          {extraSessions && extraSessions?.length === 0 && (
            <Box
              className="fs-12 fw-400 italic"
              sx={{ color: '#1F1B13', marginTop: '15px' }}
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
