import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorIcon from '../../public/images/404.png'; // Make sure to replace this with the actual path to your image
import Image from 'next/image';

const PageNotFound = () => {
  return (
    <Box
      py={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }} // '-webkit-fill-available' can be approximated with '100vh'
    >
      <Image width={270} src={ErrorIcon} alt="Error icon" />
      <Typography
        mt={4}
        variant="h2"
        fontSize="20px"
        lineHeight="30px"
        fontWeight="600"
        color="black"
      >
        Page not Found
      </Typography>
    </Box>
  );
};

export default PageNotFound;
