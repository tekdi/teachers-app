import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PasswordCreate from '@/components/PasswordCreate';

const CreatePassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const validatePassword = (value: any) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength;
    setPasswordError(!isValid);

    return isValid;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid =
    !passwordError && !confirmPasswordError && password && confirmPassword;

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
        <PasswordCreate />
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

export default CreatePassword;
