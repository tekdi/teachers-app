import WarningIcon from '@mui/icons-material/Warning';
import { Link, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';


const Unauthorized = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  useEffect(() => {
    const handleBackButton = () => {
      console.log("User pressed the browser back button");
     // localStorage.clear()
     const keysToKeep = [
      'preferredLanguage',
      'mui-mode',
      'mui-color-scheme-dark',
      'mui-color-scheme-light',
      'hasSeenTutorial',
    ];
    // Retrieve the values of the keys to keep
    const valuesToKeep: { [key: string]: any } = {};
    keysToKeep.forEach((key: string) => {
      valuesToKeep[key] = localStorage.getItem(key);
    });

    // Clear all local storage
    localStorage.clear();

    // Re-add the keys to keep with their values
    keysToKeep.forEach((key: string) => {
      if (valuesToKeep[key] !== null) {
        // Check if the key exists and has a value
        localStorage.setItem(key, valuesToKeep[key]);
      }
    })}
    

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <Box
      py={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }} // '-webkit-fill-available' can be approximated with '100vh'
    >
      <WarningIcon color="primary" sx={{ fontSize: '68px' }} />
      <Typography
        mt={4}
        variant="h2"
        fontSize="24px"
        lineHeight="30px"
        fontWeight="600"
        color="black"
      >
        {t('COMMON.ACCESS_DENIED')}
      </Typography>

      <Typography
        mt={4}
        mb={2}
        variant="subtitle2"
        fontSize="16px"
        lineHeight="16px"
        fontWeight="600"
        color={theme.palette.warning['400']}
      >
        {t('COMMON.YOU_DONT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE')}
      </Typography>

      <Link href="/logout" color={'secondary'}>
        {t('COMMON.RETURN_TO_LOGIN')}
      </Link>
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

export default Unauthorized;
