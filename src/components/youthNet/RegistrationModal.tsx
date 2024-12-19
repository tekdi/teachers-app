import { Avatar, Box } from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles';
import { RegistrationModalProps } from '@/utils/Interfaces';

const RegistrationModal: React.FC<RegistrationModalProps> = ({ avatar, title, age, village }) => {
    const theme = useTheme<any>();
    return (
        <Box sx={{display:'flex' , gap:'10px', alignItems:'center'}}>
            <Box>
                {avatar && (
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
                )}
            </Box>

            <Box >
                {title && (
                    <Box
                        sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            color: theme?.palette?.secondary?.main,
                        }}
                        className="one-line-text"
                    >
                        {title}
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: '8px', alignItems:'center'  }}>
                    {age && (
                        <Box
                            sx={{
                                color: theme?.palette?.warning['400'],
                                fontSize: '12px',
                                fontWeight: 500,
                            }}
                            className="one-line-text"
                        >
                            {age} y/o
                        </Box>
                    )}
                    <Box sx={{ height: '6px', width: '6px', bgcolor:'#CDC5BD', borderRadius:'50%'}}></Box>
                    {village && (
                        <Box
                            sx={{
                                color: theme?.palette?.warning['400'],
                                fontSize: '12px',
                                fontWeight: 500,
                            }}
                            className="one-line-text"
                        >
                            {village}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RegistrationModal;


