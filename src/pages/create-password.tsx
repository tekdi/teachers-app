import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PasswordCreate from '@/components/PasswordCreate';
import { resetPassword } from '@/services/LoginService';
import CentralizedModal from '@/components/CentralizedModal';
import { showToastMessage } from '@/components/Toastify';
import { useRouter } from 'next/router';

const CreatePassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const handleResetPassword = async (newPassword: string) => {
    try {
      const response = await resetPassword(newPassword);
      console.log(response);
      setForgotPassword(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      setForgotPassword(false);
      showToastMessage('Something Went Wrong', 'error');
    }
  };

  const handlePrimaryButton = () => {
    router.push(`/dashboard`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: '16px',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          '@media (min-width: 900px)': {
            width: '50%',
          },
          width: '100%',
          marginTop: '8rem',
        }}
      >
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
          }}
        >
          {t('LOGIN_PAGE.CREATE_NEW')}
        </Box>
        <PasswordCreate handleResetPassword={handleResetPassword} />
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
