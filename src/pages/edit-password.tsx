import CentralizedModal from '@/components/CentralizedModal';
import Header from '@/components/Header';
import PasswordCreate from '@/components/PasswordCreate';
import { showToastMessage } from '@/components/Toastify';
import { resetPassword } from '@/services/LoginService';
import { Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import { telemetryFactory } from '@/utils/telemetry';
import WestIcon from '@mui/icons-material/West';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDirection } from '../hooks/useDirection';

const EditForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
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

  const handleResetPassword = async (newPassword: string) => {
    
    try {
      const response = await resetPassword(newPassword);
      setForgotPassword(true);
      const telemetryInteract = {
        context: {
          env: 'profile',
          cdata: [],
        },
        edata: {
          id: 'reset-password',
          type: Telemetry.CLICK,
          subtype: '',
          pageid: 'edit-password',
        },
      };
      telemetryFactory.interact(telemetryInteract);
    }

     catch (error: any) {
      console.error('Error resetting password:', error);
      setForgotPassword(false);
      showToastMessage(error.response.data.params.err, 'error');
    }
  };
  const handlePrimaryButton = () => {
    router.push(`/dashboard`);
    localStorage.setItem('skipResetPassword', 'true');
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
  const { dir, isRTL } = useDirection();

  return (
    <Box>
      <Header />
      <Box sx={{ px: '16px', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <WestIcon
            onClick={handleBackEvent}
            sx={{
              color: theme.palette.warning['A200'],
              cursor: 'pointer',
              transform: isRTL ? ' rotate(180deg)' : 'unset',
            }}
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
        <Box
          sx={{
            '@media (min-width: 700px)': {
              width: '50%',
              boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
              marginTop: '1.8rem',
              borderRadius: '16px',
            },
            width: '100%',
            marginTop: '8rem',
          }}
        >
          <Box sx={{ padding: '30px' }}>
            <PasswordCreate
              handleResetPassword={handleResetPassword}
              editPassword={true}
            />
          </Box>
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

export default EditForgotPassword;
