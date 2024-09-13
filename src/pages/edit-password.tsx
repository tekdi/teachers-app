import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '@/components/Header';
import WestIcon from '@mui/icons-material/West';
import { useRouter } from 'next/router';
import CreatePassword from './create-password';
import { logEvent } from '@/utils/googleAnalytics';

const EditForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const router = useRouter();

  const handleBackEvent = () => {
    window.history.back();
    logEvent({
      action: 'back-button-clicked-attendance-overview',
      category: 'Password page',
      label: 'Back Button Clicked',
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    }
  }, []);

  return (
    <Box>
      <Header />
      <Box sx={{ px: '16px', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <WestIcon
            onClick={handleBackEvent}
            sx={{ color: theme.palette.warning['A200'] }}
          />
          <Box
            sx={{
              color: theme.palette.warning['A200'],
              fontWeight: '400',
              fontSize: '22px',
            }}
          >
            {t('LOGIN_PAGE.RESET_PASSWORD')}
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            color: theme.palette.warning['300'],
            fontWeight: '400',
            mt: 1.5,
          }}
        >
          {t('LOGIN_PAGE.CREATE_NEW')}
        </Box>
        <CreatePassword />
      </Box>
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default EditForgotPassword;
