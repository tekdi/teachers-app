import { useTheme } from '@mui/material/styles';

const useDeterminePathColor = () => {
  const theme = useTheme();

  const determinePathColor = (presentPercentage) => {
    if (presentPercentage == 0) return theme.palette.warning['400'];
    if (presentPercentage < 25) return theme.palette.error.main;
    if (presentPercentage < 50) return theme.palette.action.activeChannel;
    return theme.palette.success.main;
  };

  return determinePathColor;
};

export default useDeterminePathColor;
