import { Avatar, Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';

interface RegistrationStatisticsProps {
    title?: string;
    cardTitle?: string;
    statistic?: string | number;
    avatar?: boolean;
    subtile?: string;
}

const RegistrationStatistics: React.FC<RegistrationStatisticsProps> = ({
    title,
    cardTitle,
    statistic,
    avatar,
    subtile,
}) => {
    const theme = useTheme<any>();
    return (
        <Box
            sx={{
                background: '#CDC5BD',
                boxShadow: '0px 1px 2px 0px #0000004D, 0px 2px 6px 2px #00000026',
                padding: '12px',
                borderRadius: '16px',
            }}
        >
            {title && (
                <Box
                    sx={{
                        color: theme?.palette?.warning['300'],
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center',
                    }}
                >
                    {title}
                </Box>
            )}

            <Box>
                {cardTitle && (
                    <Box sx={{ fontSize: '12px', fontWeight: '400', color: theme?.palette?.warning['300'] }}>
                        {cardTitle}
                    </Box>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                    }}
                >
                    {avatar && (
                        <Box>
                            <Avatar
                                sx={{ bgcolor: theme?.palette?.warning['A400'] }}
                                alt="Remy Sharp"
                                src="/broken-image.jpg"
                            >
                                {avatar}
                            </Avatar>
                        </Box>
                    )}

                    <Box>
                        {statistic && (
                            <Box
                                sx={{ fontSize: '16px', fontWeight: '500', color: theme?.palette?.warning['300'] }}
                            >
                                {statistic}
                            </Box>
                        )}
                        {subtile && (
                            <Box
                                sx={{ fontSize: '16px', fontWeight: '400', color: theme?.palette?.warning['300'] }}
                            >
                                {subtile}
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RegistrationStatistics;
