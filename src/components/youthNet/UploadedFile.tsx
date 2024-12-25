import React from 'react';
import { Box, Typography } from '@mui/material';
import { VillageDetailProps } from '@/utils/Interfaces';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import mp from './../../assets/images/mp.png'
import GetAppIcon from '@mui/icons-material/GetApp';




const UploadedFile: React.FC<VillageDetailProps> = ({
    title,
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap="8px">

                    <Box>
                        <Image
                            src={mp}
                            alt="Login Image"
                        />
                    </Box>

                    {title && (
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 500,
                                lineHeight: '24px',
                                fontSize:'14px',
                                color: 'black',
                            }}
                            className="one-line-text"
                        >
                            {title}
                        </Typography>
                    )}

                </Box>

                <GetAppIcon
                    sx={{
                        fontSize: '20px',
                        color: theme.palette.warning['300']
                    }}
                />
            </Box>
        </Box>
    );
};

export default UploadedFile;
