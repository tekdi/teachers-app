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
      minHeight={'6.2rem'}
      p={2}
      overflow={'hidden'}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        // minHeight: 'fit-content',
        minHeight: '6.2rem',
        '@media (max-width: 600px)': {
          minHeight: '7.4rem',
        },
      }}
    >
      <Box>
        <Typography
          color={`${theme.palette.warning[400]}`}
          variant="h6"
          fontWeight={600}
          sx={{ fontSize: '11px', color: theme.palette.warning['400'] }}
        >
          {label}
        </Typography>
        {value ? (
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.warning['300'],
              fontSize: '16px',
              fontWeight: '500',
            }}
            fontWeight={500}
          >
            {value}
          </Typography>
        ) : (
          <Box sx={{ marginTop: '4px' }}>
            <span
              className="two-line-text"
              style={{
                color: theme.palette.warning['300'],
                fontSize: '16px',
                fontWeight: '500',
                wordBreak: 'break-word',
                lineHeight: '22px',
                display: 'inline',
              }}
            >
              {valuePartOne}
            </span>

            <span
              style={{
                color: theme.palette.warning['300'],
                fontSize: '12px',
                fontWeight: '400',
                lineHeight: '22px',
                marginLeft: '3px',
                display: 'inline',
              }}
            >
              {valuePartTwo}
            </span>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OverviewCard;
