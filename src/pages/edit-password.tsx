import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '@/components/Header';
import WestIcon from '@mui/icons-material/West';
import { useRouter } from 'next/router';
import CreatePassword from './create-password';

const EditForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handlePasswordChange = (event: any) => {
    setNewPassword(event.target.value);
    validatePassword(event.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    validatePassword(newPassword, event.target.value);
  };

  const validatePassword = (password: any, confirmPassword: any) => {
    const isValid = password.length >= 8 && password === confirmPassword;
    setIsPasswordValid(isValid);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = () => {
    if (isPasswordValid) {
      // Password strength check (this is a simple check, adjust the criteria as needed)
      const isStrongPassword = newPassword.length >= 8;
      if (isStrongPassword) {
        setMessage('Password is strong!');
      } else {
        setMessage('Password is weak!');
      }
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ px: '16px', mt: 2 }}>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <WestIcon sx={{ color: theme.palette.warning['A200'] }} />
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
