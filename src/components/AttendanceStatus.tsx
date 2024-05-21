import { Box, Button, Grid, Typography } from '@mui/material';
import {
  RemoveCircleOutline,
  CheckCircleOutlineOutlined,
  CancelOutlined,
  CreateOutlined
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AttendanceStatusProps {
  status: string;
  onUpdate?: () => void;
}

function AttendanceStatus({ status, onUpdate }: AttendanceStatusProps) {
  const { t } = useTranslation();

  let icon, message;
  switch (status) {
    case 'present':
      icon = <CheckCircleOutlineOutlined />;
      message = 'Present';
      break;
    case 'absent':
      icon = <CancelOutlined />;
      message = 'Absent';
      break;
    case 'on-leave':
      icon = <CancelOutlined />;
      message = 'On leave';
      break;
    case 'half-day':
      icon = <RemoveCircleOutline />;
      message = 'Half-day';
      break;
    case 'Not marked':
      message = 'Attendance not marked';
      break;
    case 'Future date':
      message = 'Future date cannot be marked';
      break;
    default:
      break;
  }

  return (
    <Box>
      <Grid container display={'flex'} justifyContent="space-between" alignItems={'center'}>
        <Grid item xs={8} display={'flex'}>
          {icon && <div className={`${status.toLowerCase()}-marker`}>{icon}</div>}
          <Typography marginBottom={0} fontSize="16px" ml={1}>
            {message}
          </Typography>
        </Grid>
        {onUpdate && (
          <Grid item xs={4} display={'flex'} justifyContent={'end'}>
            <Button
              variant="text"
              endIcon={<CreateOutlined />}
              onClick={onUpdate}
              disabled={status === 'Future date'}>
              {t('COMMON.UPDATE')}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default AttendanceStatus;
