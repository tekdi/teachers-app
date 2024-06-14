import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

import AttendanceStatus from '@/components/AttendanceStatus';
import Header from '@/components/Header';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { LearnerAttendanceProps } from '@/utils/Interfaces';
import Loader from '@/components/Loader';
import MarkAttendance from '@/components/MarkAttendance';
import MonthCalender from '@/components/MonthCalender';
import { getLearnerAttendanceStatus } from '@/services/AttendanceService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { shortDateFormat } from '@/utils/Helper';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ToastMessage from '@/components/ToastMessage';
import { logEvent } from '@/utils/googleAnalytics';

type LearnerAttendanceData = {
  [date: string]: {
    attendanceStatus: string;
  };
};

type AttendanceRecord = {
  attendanceDate: string;
  attendance: string;
};

const LearnerAttendanceHistory = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const { push } = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [attendanceUpdated, setAttendanceUpdated] = useState(false);
  const [learnerAttendance, setLearnerAttendance] = useState<
    LearnerAttendanceData | undefined
  >(undefined);
  const [isError, setIsError] = React.useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setLoading(false);
      if (token) {
        push('/learner-attendance-history');
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  useEffect(() => {
    handleSelectedDateChange(selectedDate);
  }, []);

  const handleSelectedDateChange = (date: Date | Date[] | null) => {
    setSelectedDate(date as Date);
  };

  const handleActiveStartDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleOpen = () => {
    setOpen(true);
    logEvent({
      action: 'individual-learner-attendance-modal-open',
      category: 'Learner Attendance History Page',
      label: 'Mark Individual Learner Modal Open',
    });
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    logEvent({
      action: 'individual-learner-attendance-modal-close',
      category: 'Learner Attendance History Page',
      label: 'Mark Individual Learner Modal Close',
    });
  };

  useEffect(() => {
    const getAttendanceStatus = async () => {
      setLoading(true);
      try {
        const classId = localStorage.getItem('classId') || '';
        const userId = localStorage.getItem('learnerId') || '';
        if (
          classId !== '' &&
          classId !== undefined &&
          userId !== undefined &&
          userId !== ''
        ) {
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
          const attendanceRequest: LearnerAttendanceProps = {
            limit: 300,
            page: 0,
            filters: {
              contextId: classId,
              fromDate: fromDateFormatted,
              toDate: toDateFormatted,
              scope: 'student',
              userId: userId,
            },
          };
          const response = await getLearnerAttendanceStatus(attendanceRequest);
          const attendanceStats = response?.data?.attendanceList;
          const attendanceData = attendanceStats?.reduce(
            (acc: LearnerAttendanceData, record: AttendanceRecord) => {
              acc[record.attendanceDate] = {
                attendanceStatus: record.attendance,
              };
              return acc;
            },
            {}
          );
          setLearnerAttendance(attendanceData);
          setIsError(false)
          setLoading(false);
        }
      } catch (err) {
        setIsError(true)
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getAttendanceStatus();
  }, [selectedDate, attendanceUpdated]);

  return (
    <Box minHeight="100vh" textAlign={'center'}>
      <Header />
      {loading && <Loader showBackdrop={true} loadingText={t('LOADING')} />}
      <Box display={'flex'}>
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
              <Box onClick={() => window.history.back()}>
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
        </Box>
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
          boxShadow: '0px 4px 8px 3px #00000026',
          border: '1px solid #D0C5B4',
        }}
        py={'5px'}
      >
        <Box>
          <AttendanceStatus
            date={selectedDate}
            learnerAttendanceData={learnerAttendance}
            onDateSelection={selectedDate}
            onUpdate={handleOpen}
          />
        </Box>
      </Box>

      <MonthCalender
        learnerAttendanceDate={learnerAttendance}
        onChange={handleActiveStartDateChange}
        onDateChange={handleSelectedDateChange}
      />
      <MarkAttendance
        isOpen={open}
        date={shortDateFormat(selectedDate)}
        isSelfAttendance={false}
        currentStatus={
          learnerAttendance?.[shortDateFormat(selectedDate)]
            ?.attendanceStatus || ''
        }
        handleClose={handleModalClose}
        onAttendanceUpdate={() => setAttendanceUpdated(!attendanceUpdated)}
      />
      { isError &&
             <ToastMessage message={t('COMMON.SOMETHING_WENT_WRONG')} />
          }
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
export default LearnerAttendanceHistory;
