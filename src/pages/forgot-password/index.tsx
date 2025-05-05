import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { resetPasswordLink } from '@/services/LoginService';
import CentralizedModal from '@/components/CentralizedModal';
import { showToastMessage } from '@/components/Toastify';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Image from 'next/image';
import Logo from './../../assets/images/Pratham-Logo.png';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [inputValue, setInputValue] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [maskEmail, setMaskEmail] = useState('');

  // Function to handle input and convert to lowercase
  const handleInputChange = (event: any) => {
    const lowercaseValue = event.target.value.toLowerCase(); // Convert input to lowercase
    setInputValue(lowercaseValue);
  };

  const maskEmailFunction = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length > 2) {
      const maskedLocalPart =
        localPart[0] + '*'.repeat(localPart.length - 2) + localPart.slice(-1);
      return `${maskedLocalPart}@${domain}`;
    }
    return email;
  };

  const handleSubmit = async () => {
    try {
      const response = await resetPasswordLink(inputValue);
      const email = response?.result?.email;

      if (email) {
        const maskedEmail = maskEmailFunction(email);
        setMaskEmail(maskedEmail);
      }

      setSuccessMessage(true);
    } catch (error: any) {
      showToastMessage(error?.response?.data?.params?.err || t('COMMON.DEFAULT_ERROR'), 'error');
    }
  };

  const handlePrimaryButton = () => {
    setSuccessMessage(false);
  };

  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: '16px',
        alignItems: 'center',
        '@media (min-width: 700px)': {
          height: '100vh',
        },
      }}
    >
      <Box
        sx={{
          '@media (min-width: 700px)': {
            width: '50%',
            boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            marginTop: '0rem',
            borderRadius: '16px',
          },
          width: '100%',
          marginTop: '8rem',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image src={Logo} alt="App Logo" height={100} />
        </Box>
        <Box sx={{ padding: '60px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LockOpenIcon
              sx={{ fontSize: '40px', color: theme.palette.warning['300'] }}
            />
          </Box>
          <Box
            sx={{
              color: theme.palette.warning['300'],
              fontWeight: '400',
              fontSize: '22px',
              textAlign: 'center',
            }}
          >
            {t('LOGIN_PAGE.TROUBLE_LOGIN')}
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
            {t('LOGIN_PAGE.ENTER_USERNAME_TO_GET_LINK')}
          </Box>

          <Box
            sx={{
              '@media (min-width: 700px)': {
                width: '100%',
              },
            }}
            margin={'3.2rem 0 0'}
          >
            <TextField
              id="Email"
              InputLabelProps={{
                shrink: true,
              }}
              type="text"
              value={inputValue}
              onChange={handleInputChange} // Uses updated function
              className="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                    ></IconButton>
                  </InputAdornment>
                ),
              }}
              label={t('LOGIN_PAGE.ENTER_USERNAME')}
            />
          </Box>

          <CentralizedModal
            icon={true}
            subTitle={t('LOGIN_PAGE.WE_SEND_AN_EMAIL', {
              maskEmail: maskEmail,
            })}
            primary={t('COMMON.OKAY')}
            modalOpen={successMessage}
            handlePrimaryButton={handlePrimaryButton}
          />

          <Box>
            <Box
              alignContent={'center'}
              textAlign={'center'}
              marginTop={'2.5rem'}
              width={'100%'}
            >
              <Button
                variant="contained"
                type="submit"
                fullWidth={true}
                onClick={handleSubmit}
                disabled={!inputValue}
                sx={{
                  '@media (min-width: 900px)': {
                    width: '50%',
                  },
                }}
              >
                {t('GUIDE_TOUR.NEXT')}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 10 }}>
            <Divider />
          </Box>
          <Box
            sx={{
              mt: 3,
              color: theme.palette.secondary.main,
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '500',
            }}
            onClick={() => {
              router.push('/login');
            }}
          >
            {t('LOGIN_PAGE.BACK_TO_LOGIN')}
          </Box>
        </Box>
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

export default ForgotPassword;
