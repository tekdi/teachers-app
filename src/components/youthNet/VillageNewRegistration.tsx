import { Box } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { VillageNewRegistrationProps } from '@/utils/Interfaces';



const VillageNewRegistration: React.FC<VillageNewRegistrationProps> = ({ locations }) => {
    const theme = useTheme<any>();
    return (
        <>
            <Box
                sx={{
                    border: `1px solid ${theme?.palette?.warning['900']}`,
                    fontSize: '14px',
                    color: '#4D4639',
                    fontWeight: '500',
                    padding: '4px 6px',
                    borderRadius: '8px',
                }}
                className="one-line-text"
            >
                {locations}
            </Box>
        </>
    );
};

export default VillageNewRegistration;
