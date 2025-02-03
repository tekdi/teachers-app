import { Box, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { SurveysProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function Surveys({
  title,
  date,
  onClick,
  status,
  villages,
  actionRequired,
  minHeight
}: SurveysProps) {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <Box
      onClick={onClick}
    >
      <Box
        sx={{
          border: `1px solid ${theme.palette.warning['A100']}`,
          borderRadius: '8px',
          padding: '12px',
          cursor: 'pointer',
          background: theme.palette.warning['A400'],
          minHeight: minHeight || '100%'
        }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: '400',
                color: theme.palette.warning['300'],
              }}
              className="one-line-text"
            >
              {title}
            </Typography>
            {status && (
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: theme?.palette?.success?.main,
                }}
                className="one-line-text"
              >
                {status}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            {villages && (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: theme.palette.warning['400'],
                }}
                className="one-line-text"
              >
                {villages} {t('SURVEYS.VILLAGES')}
              </Typography>
            )}
            {date && (
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: theme.palette.warning['400'],
                }}
                className="one-line-text"
              >
                {t('YOUTHNET_DASHBOARD.CLOSED_ON')} {date}
              </Typography>
            )}
          </Box>

          {actionRequired && (
            <Box sx={{ display: 'flex', gap: '2px', mt: '3px' }}>
              <Box>
                <PriorityHighIcon
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: theme?.palette?.error?.main,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: theme?.palette?.error?.main,
                }}
                className="one-line-text"
              >
                {actionRequired}
              </Typography>
            </Box>
          )}
        </Box>
        <Box>
          <KeyboardArrowRightIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default Surveys;
