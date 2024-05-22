import { useTheme } from '@mui/material/styles';

const useDeterminePathColor = () => {
  const theme = useTheme();

  const determinePathColor = (presentPercentage) => {
    if (isNaN(presentPercentage)) return;
    if (presentPercentage < 25) return theme.palette.error.main;
    if (presentPercentage < 50) return theme.palette.action.activeChannel;
    return theme.palette.success.main;
  };

  return determinePathColor;
};

export default useDeterminePathColor;
