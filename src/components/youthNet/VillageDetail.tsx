import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { VillageDetailProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';




const VillageDetail: React.FC<VillageDetailProps> = ({
    title,
    icon,
    subtitle,
}) => {
    const theme = useTheme<any>();
    return (
        <Box
            sx={{
                border: `1px solid ${theme.palette.warning['A100']}`,
                bgcolor: theme.palette.warning['800'],
                padding: '12px',
                margin: '100px',
                borderRadius: '8px',
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="start">
                <Box display="flex" flexDirection="column" gap="8px">
                    {icon && (
                        <Box
                            sx={{
                                boxShadow:
                                    '0px 2px 6px 2px #00000026, 0px 1px 2px 0px #0000004D',
                                border: `1.5px solid ${theme.palette.warning['A100']}`,
                                background: theme.palette.warning['A400'],
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                            }}
                        >
                            {icon}
                        </Box>
                    )}

                    {title && (
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 500,
                                lineHeight: '24px',
                                color: theme.palette.warning['300'],
                            }}
                            className="one-line-text"
                        >
                            {title}
                        </Typography>
                    )}

                    {subtitle && (
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 400,
                                lineHeight: '24px',
                                color: '#635E57',
                            }}
                            className="one-line-text"
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <ArrowForwardIcon
                    sx={{
                        fontSize: '20px',
                        color: '#0D599E',
                    }}
                />
            </Box>
        </Box>
    );
};

export default VillageDetail;
