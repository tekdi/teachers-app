import { Box, Button, Grid, Typography } from '@mui/material';
import { CreateOutlined } from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { shortDateFormat } from '@/utils/Helper';
import { useTheme } from '@mui/material/styles';

interface AttendanceStatusProps {
  formattedAttendanceData: FormattedAttendanceData;
  onDateSelection: Date;
  onUpdate?: () => void;
}

type AttendanceData = {
  present_percentage: number;
  present_students: number;
  total_students: number;
};

type FormattedAttendanceData = {
  [date: string]: AttendanceData;
};

function AttendanceStatus({
  formattedAttendanceData,
  onDateSelection,
  onUpdate,
}: AttendanceStatusProps) {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const selectedDate = shortDateFormat(onDateSelection);
  console.log(selectedDate);
  const dateString = shortDateFormat(onDateSelection);
  const attendanceData = formattedAttendanceData?.[dateString];
  const todayDate = shortDateFormat(new Date());
  const currentAttendance =
    formattedAttendanceData?.[dateString] || 'notMarked';
  let attendanceStatus;

  if (!attendanceData) {
    attendanceStatus = 'notMarked';
    if (selectedDate > todayDate) {
      attendanceStatus = 'futureDate';
    }
  }

  const presentPercentage = currentAttendance?.present_percentage;
  let pathColor;
  if (!isNaN(presentPercentage)) {
    if (presentPercentage < 25) {
      pathColor = theme.palette.error.main;
    } else if (presentPercentage < 50) {
      pathColor = theme.palette.action.activeChannel;
    } else {
      pathColor = theme.palette.success.main;
    }
  }

  return (
    <Box>
      <Grid
        container
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Grid item xs={8} display={'flex'}>
          <Box display={'flex'}>
            {attendanceStatus !== 'notMarked' &&
              attendanceStatus !== 'futureDate' && (
                <>
                  <Box
                    width={'25px'}
                    height={'2rem'}
                    marginTop={'1rem'}
                    margin={'5px'}
                  >
                    <CircularProgressbar
                      value={presentPercentage}
                      styles={buildStyles({
                        textColor: pathColor,
                        pathColor: pathColor,
                        trailColor: '#E6E6E6',
                      })}
                      strokeWidth={15}
                    />
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography
                      variant="h6"
                      className="word-break"
                      color={pathColor}
                    >
                      {t('DASHBOARD.PERCENT_ATTENDANCE', {
                        percent_students: currentAttendance?.present_percentage,
                      })}
                    </Typography>
                    &nbsp;
                    <Typography
                      variant="h6"
                      className="word-break"
                      color={pathColor}
                    >
                      {t('DASHBOARD.PRESENT_STUDENTS', {
                        present_students: currentAttendance?.present_students,
                        total_students: currentAttendance?.total_students,
                      })}
                    </Typography>
                  </Box>
                </>
              )}

            {attendanceStatus === 'notMarked' && (
              <Typography fontSize={'0.8rem'} color={pathColor}>
                {t('DASHBOARD.NOT_MARKED')}
              </Typography>
            )}

            {attendanceStatus === 'futureDate' && (
              <Typography fontSize={'0.8rem'} color={pathColor}>
                {t('DASHBOARD.FUTURE_DATE_CANT_MARK')}
              </Typography>
            )}
          </Box>
        </Grid>
        {onUpdate && (
          <Grid item xs={4} display={'flex'} justifyContent={'end'}>
            <Button
              variant="text"
              endIcon={<CreateOutlined />}
              // onClick={onUpdate}
              disabled={attendanceStatus === 'futureDate'}
            >
              {attendanceStatus === 'notMarked' ||
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
