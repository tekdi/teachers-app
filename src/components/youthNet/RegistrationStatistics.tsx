import { Avatar, Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { RegistrationStatisticsProps } from '@/utils/Interfaces';

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
                    className="one-line-text"
                >
                    {title}
                </Box>
            )}

            <Box>
                {cardTitle && (
                    <Box
                        sx={{
                            fontSize: '12px',
                            fontWeight: '400',
                            color: theme?.palette?.warning['300'],
                        }}
                        className="one-line-text"
                    >
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
                                sx={{
                                    bgcolor: theme?.palette?.warning['A400'],
                                    color: theme?.palette?.warning['300'],
                                    boxShadow: '0px 1px 2px 0px #0000004D',
                                    border: `2px solid ${theme?.palette?.warning['A100']}`,
                                }}
                                alt="logo"
                                src="/broken-image.jpg"
                            >
                                {avatar}
                            </Avatar>
                        </Box>
                    )}

                    <Box>
                        {statistic && (
                            <Box
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: theme?.palette?.warning['300'],
                                }}
                                className="one-line-text"
                            >
                                {statistic}
                            </Box>
                        )}
                        {subtile && (
                            <Box
                                className="one-line-text"
                                sx={{
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    color: theme?.palette?.warning['300'],
                                }}
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
