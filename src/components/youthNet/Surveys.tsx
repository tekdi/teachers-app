import { Box, Typography } from '@mui/material';
import React from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { SurveysProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';

function Surveys({ title, date }: SurveysProps) {
    const theme = useTheme<any>();
    return (
        <Box
            sx={{
                border: '1px solid #D0C5B4',
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
                        color: '#1F1B13',
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
                        color: '#7C766F',
                    }}
                    className="one-line-text"
                >
                    Closed on {date}
                </Typography>
            </Box>
            <Box>
                <KeyboardArrowRightIcon />
            </Box>
        </Box>
    );
}

export default Surveys;
