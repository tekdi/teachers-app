import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ErrorIcon from '../../public/images/404.png'; // Make sure to replace this with the actual path to your image
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const PageNotFound = () => {
  const { t } = useTranslation();

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
        {t('COMMON.PAGE_NOT_FOUND')}
      </Typography>
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default PageNotFound;
