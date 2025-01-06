import { Box, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { SurveysProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

function Surveys({ title, date }: SurveysProps) {
    const theme = useTheme<any>();
    const { t } = useTranslation();
    return (
        <Box
            sx={{
                border: `1px solid ${theme.palette.warning['A100']}`,
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer', 
            }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <Box>
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
            </Box>
            <Box>
                <KeyboardArrowRightIcon />
            </Box>
        </Box>
    );
}

export default Surveys;
