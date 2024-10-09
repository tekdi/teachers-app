import { Box, Button, Grid, Typography } from '@mui/material';
import {
  CancelOutlined,
  CheckCircleOutlineOutlined,
  CreateOutlined,
} from '@mui/icons-material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { formatToShowDateMonth, shortDateFormat } from '@/utils/Helper';

import { modifyAttendanceLimit } from '../../app.config';
import useDeterminePathColor from '../hooks/useDeterminePathColor';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';

interface AttendanceStatusProps {
  date: Date;
  formattedAttendanceData?: FormattedAttendanceData;
  learnerAttendanceData?: learnerAttendanceData;
  onDateSelection: Date;
  onUpdate?: () => void;
}

type AttendanceData = {
  totalcount: any;
  present_percentage: number;
  present_students: number;
  total_students: number;
  attendanceStatus: string;
};

type FormattedAttendanceData = {
  [date: string]: AttendanceData;
};

type learnerAttendanceData = {
  [date: string]: {
    attendanceStatus: string;
  };
};

function AttendanceStatus({
  date,
  formattedAttendanceData,
  learnerAttendanceData,
  onDateSelection,
  onUpdate,
}: Readonly<AttendanceStatusProps>) {
  const { t } = useTranslation();
  const determinePathColor = useDeterminePathColor();
  const selectedDate = shortDateFormat(onDateSelection);
  const dateString = shortDateFormat(onDateSelection);
  const attendanceData = formattedAttendanceData?.[dateString];
  const learnerAttendance = learnerAttendanceData?.[dateString];
  const todayDate = shortDateFormat(new Date());
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  const theme = useTheme<any>();
  sevenDaysAgo.setDate(currentDate.getDate() - modifyAttendanceLimit);
  const formatedSevenDaysAgo = shortDateFormat(sevenDaysAgo);
  const currentAttendance =
    formattedAttendanceData?.[dateString] || 'notMarked';
  let attendanceStatus;
  let learnerAttendanceStatus = learnerAttendance?.attendanceStatus;

  if (!attendanceData) {
    attendanceStatus = 'notMarked';
    if (selectedDate > todayDate) {
      attendanceStatus = 'futureDate';
    }
  }

  if (learnerAttendanceData && !learnerAttendance) {
    learnerAttendanceStatus = 'notMarked';
    if (selectedDate > todayDate) {
      learnerAttendanceStatus = 'futureDate';
    }
  }

  let icon, message;
  switch (learnerAttendanceStatus) {
    case 'present':
      icon = <CheckCircleOutlineOutlined />;
      message = 'Present';
      break;
    case 'absent':
      icon = <CancelOutlined />;
      message = 'Absent';
      break;
    case 'notMarked':
      message = t('DASHBOARD.NOT_MARKED');
      break;
    case 'futureDate':
      message = t('DASHBOARD.FUTURE_DATE_CANT_MARK');
      break;
    default:
      break;
  }

  const presentPercentage =
    typeof currentAttendance !== 'string'
      ? currentAttendance.present_percentage
      : 0;
  const pathColor = determinePathColor(presentPercentage);

  return (
    <Box>
      <Grid
        container
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Grid item xs={8}>
          <Box display={'flex'} width={'100%'}>
            <Typography
              marginBottom={'0px'}
              ml={1}
              fontSize={'14px'}
              fontWeight={'500'}
              color={theme.palette.warning['300']}
            >
              {formatToShowDateMonth(date)}
            </Typography>
          </Box>
          {formattedAttendanceData && (
            <Box display={'flex'} gap={'4px'} ml={'8px'} alignItems={'center'}>
              {attendanceStatus !== 'notMarked' &&
                attendanceStatus !== 'futureDate' && (
                  <>
                    <Box width={'25px'} marginTop={'6px'} height={'2rem'}>
                      <CircularProgressbar
                        value={presentPercentage}
                        styles={buildStyles({
                          textColor: pathColor,
                          pathColor: pathColor,
                          trailColor: '#E6E6E6',
                          strokeLinecap: 'round',
                        })}
                        strokeWidth={20}
                      />
                    </Box>
                    <Box display={'flex'} alignItems={'center'}>
                      <Typography
                        variant="h6"
                        // className="word-break"
                        color={pathColor}
                        sx={{
                          whiteSpace: 'nowrap',
                          '@media (max-width: 412px)': {
                            width: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                      >
                        {t('DASHBOARD.PERCENT_ATTENDANCE', {
                          percent_students: presentPercentage,
                        })}

                        {t('DASHBOARD.PRESENT_STUDENTS', {
                          present_students:
                            typeof currentAttendance !== 'string'
                              ? currentAttendance.present_students
                              : 0,
                          total_students:
                            typeof currentAttendance !== 'string'
                              ? currentAttendance.totalcount
                              : 0,
                        })}
                      </Typography>
                      &nbsp;
                    </Box>
                  </>
                )}

              {attendanceStatus === 'notMarked' && (
                <Typography fontSize={'0.8rem'} color={pathColor}>
                  {t('DASHBOARD.NOT_MARKED')}
                </Typography>
              )}

              {attendanceStatus === 'futureDate' && (
                <Typography
                  fontSize={'0.8rem'}
                  color={pathColor}
                  fontStyle="italic"
                  fontWeight={'500'}
                >
                  {t('DASHBOARD.FUTURE_DATE_CANT_MARK')}
                </Typography>
              )}
            </Box>
          )}

          {learnerAttendanceStatus && (
            <Grid item display={'flex'}>
              {icon && (
                <div
                  className={`${learnerAttendanceStatus?.toLowerCase()}-marker`}
                >
                  {icon}
                </div>
              )}
              <Typography
                fontSize={'0.8rem'}
                color={pathColor}
                fontStyle="italic"
                fontWeight={'500'}
              >
                {message}
              </Typography>
            </Grid>
          )}
        </Grid>

        {onUpdate && (
          <Grid
            item
            xs={4}
            display={'flex'}
            justifyContent={'end'}
            sx={{ cursor: 'pointer' }}
          >
            <Button
              variant="text"
              endIcon={<CreateOutlined />}
              onClick={onUpdate}
              disabled={
                attendanceStatus === 'futureDate' ||
                learnerAttendanceStatus === 'notMarked' ||
                (attendanceStatus !== 'futureDate' &&
                  formatedSevenDaysAgo > selectedDate)
              }
              className="one-line-text"
            >
              {learnerAttendanceStatus === 'notMarked' ||
              learnerAttendanceStatus === 'futureDate' ||
              learnerAttendanceStatus === 'present' ||
              learnerAttendanceStatus === 'absent'
                ? t('COMMON.MODIFY')
                : attendanceStatus === 'notMarked' ||
                    attendanceStatus === 'futureDate'
                  ? t('COMMON.MARK')
                  : t('COMMON.MODIFY')}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default AttendanceStatus;
