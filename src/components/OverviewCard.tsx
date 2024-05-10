import { Box, Typography } from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';

// import { useTranslation } from 'react-i18next';

interface OverviewCardProps {
  label: string;
  value: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ label, value }) => {
  const theme = useTheme<any>();
  //   const { t } = useTranslation();

  return (
    <Box
      gap="5rem"
      //   border={`1px solid ${theme.palette.warning.A100}`}
      borderRadius="1rem"
      alignItems="left"
      bgcolor="white"
      mx={'1rem'}
      sx={{ padding: '1rem' }}
      height={'4.5rem'}
      overflow={'hidden'}
    >
      <Box>
        <Typography
          color={`${theme.palette.warning[400]}`}
          variant="h6"
          fontWeight={600}
        >
          {label}
        </Typography>
        <Typography variant="h2" fontWeight={500}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default OverviewCard;
