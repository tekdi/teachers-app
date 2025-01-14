import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PasswordCreate from '@/components/PasswordCreate';
import { resetPassword } from '@/services/LoginService';
import CentralizedModal from '@/components/CentralizedModal';
import { showToastMessage } from '@/components/Toastify';
import { useRouter } from 'next/router';
import Logo from '../assets/images/Pratham-Logo.png';
import Image from 'next/image';

const CreatePassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleResetPassword = async (newPassword: string) => {
    try {
      await resetPassword(newPassword);
      setForgotPassword(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setForgotPassword(false);
      showToastMessage(error.response.data.params.err, 'error');
    }
  };

  const handlePrimaryButton = () => {
    router.push(`/dashboard`);
    localStorage.setItem('skipResetPassword', 'true');
  };

  const editPassword = router.pathname.includes('/edit-password');

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: editPassword ? 'flex-start' : 'center',
        px: editPassword ? '16px' : 0,
        alignItems: 'center',
        '@media (min-width: 700px)': {
          height: editPassword ? '100%' : '100vh',
        },
      }}
    >
      <Box
        sx={{
          '@media (min-width: 700px)': {
            width: editPassword ? '70%' : '50%',
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            marginTop: editPassword ? '2rem' : '0rem',
            borderRadius: '16px',
          },
          width: '100%',
          marginTop: editPassword ? '1.5rem' : '8rem',
        }}
      >
        <Box
          sx={{
            display: editPassword ? 'none' : 'flex',
            justifyContent: 'center',
          }}
        >
          <Image src={Logo} alt="App Logo" height={100} />
        </Box>
        <Box sx={{ padding: editPassword ? '16px' : '40px' }}>
          <Box
            sx={{
              color: theme.palette.warning['300'],
              fontWeight: '400',
              fontSize: '22px',
              textAlign: 'center',
            }}
          >
            {t('LOGIN_PAGE.CREATE_STRONG_PASSWORD')}
          </Box>
          <Box
            sx={{
              color: theme.palette.warning['300'],
              fontWeight: '400',
              fontSize: '14px',
              textAlign: 'center',
              mt: 0.5,
              display: editPassword ? 'none' : 'inline-block',
            }}
          >
            {t('LOGIN_PAGE.CREATE_NEW')}
          </Box>
          <PasswordCreate handleResetPassword={handleResetPassword} />
        </Box>
      </Box>
      <CentralizedModal
        icon={true}
        subTitle={t('LOGIN_PAGE.SUCCESSFULLY_RESET')}
        primary={t('COMMON.OKAY')}
        modalOpen={forgotPassword}
        handlePrimaryButton={handlePrimaryButton}
      />
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

export default CreatePassword;
