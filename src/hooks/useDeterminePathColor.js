import { useTheme } from '@mui/material/styles';
import {
  avgLearnerAttendanceLimit,
  lowLearnerAttendanceLimit,
} from '../../app.config';

const useDeterminePathColor = () => {
  const theme = useTheme();

  const determinePathColor = (presentPercentage) => {
    if (presentPercentage == 0) return theme.palette.warning['400'];
    if (presentPercentage < lowLearnerAttendanceLimit)
      return theme.palette.error.main;
    if (presentPercentage <= avgLearnerAttendanceLimit)
      return theme.palette.action.activeChannel;
    return theme.palette.success.main;
  };

  return determinePathColor;
};

export default useDeterminePathColor;
