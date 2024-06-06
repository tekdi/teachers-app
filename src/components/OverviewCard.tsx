import { Box, Typography } from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';

// import { useTranslation } from "next-i18next";

interface OverviewCardProps {
  label: string;
  value?: string | number;
  valuePartOne?: string | number;
  valuePartTwo?: string | number | null;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  label,
  value,
  valuePartOne,
  valuePartTwo,
}) => {
  const theme = useTheme<any>();
  //   const { t } = useTranslation();

  return (
    <Box
      gap="5rem"
      //   border={`1px solid ${theme.palette.warning.A100}`}
      borderRadius="1rem"
      alignItems="left"
      bgcolor="white"
      sx={{ padding: '1rem' }}
      minHeight={'6.2rem'}
      overflow={'hidden'}
    >
      <Box>
        <Typography
          color={`${theme.palette.warning[400]}`}
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: '11px', color: '#7C766F' }}
        >
          {label}
        </Typography>
        {value ? (
          <Typography
            variant="h2"
            sx={{ color: '#1F1B13', fontSize: '16px', fontWeight: '500' }}
            fontWeight={500}
          >
            {value}
          </Typography>
        ) : (
          <Box>
            <Typography
              variant="h2"
              sx={{ color: '#1F1B13', fontSize: '16px', fontWeight: '500' }}
              fontWeight={500}
            >
              {valuePartOne}
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: '#1F1B13', fontSize: '16px', fontWeight: '500' }}
              fontWeight={500}
            >
              {valuePartTwo}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OverviewCard;
