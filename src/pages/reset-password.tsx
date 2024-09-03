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

const ResetPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
    validatePassword(event.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
    validatePassword(password, event.target.value);
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
      const isStrongPassword = password.length >= 8;
      if (isStrongPassword) {
        setMessage('Password is strong!');
      } else {
        setMessage('Password is weak!');
      }
    }
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
            color: '#1F1B13',
            fontWeight: '400',
            fontSize: '22px',
            textAlign: 'center',
          }}
        >
          {t('LOGIN_PAGE.RESET_PASSWORD')}
        </Box>
        <Box
          sx={{
            color: '#1F1B13',
            fontWeight: '400',
            fontSize: '14px',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          {t('LOGIN_PAGE.CREATE_NEW')}
        </Box>

        <Box
          sx={{
            width: '668px',
            '@media (max-width: 768px)': {
              width: '100%',
            },
            '@media (min-width: 900px)': {
              width: '100%',
            },
          }}
          margin={'3.2rem 0 0'}
        >
          <TextField
            id="password"
            InputLabelProps={{
              shrink: true,
            }}
            type="password"
            className="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  ></IconButton>
                </InputAdornment>
              ),
            }}
            label={t('LOGIN_PAGE.PASSWORD')}
            value={password}
            onChange={handlePasswordChange}
            error={password.length > 0 && password.length < 8}
            helperText={
              password.length > 0 && password.length < 8
                ? t('LOGIN_PAGE.CHARACTERS_LONG')
                : ''
            }
          />
        </Box>

        <Box
          sx={{
            width: '668px',
            '@media (max-width: 768px)': {
              width: '100%',
            },
            '@media (min-width: 900px)': {
              width: '100%',
            },
          }}
          margin={'2rem 0 0'}
        >
          <TextField
            id="confirm-password"
            InputLabelProps={{
              shrink: true,
            }}
            type="password"
            className="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  ></IconButton>
                </InputAdornment>
              ),
            }}
            label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={confirmPassword.length > 0 && confirmPassword !== password}
            helperText={
              confirmPassword.length > 0 && confirmPassword !== password
                ? t('LOGIN_PAGE.NOT_MATCH')
                : ''
            }
          />
        </Box>

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
              sx={{
                '@media (min-width: 900px)': {
                  width: '50%',
                },
                backgroundColor: isPasswordValid ? '#FFD700' : '',
              }}
              disabled={!isPasswordValid}
              onClick={handleResetPassword}
            >
              {t('LOGIN_PAGE.RESET_PASSWORD')}
            </Button>
          </Box>
          {message && (
            <Box
              sx={{
                mt: '1rem',
                textAlign: 'center',
                color: message.includes('strong') ? 'green' : 'red',
              }}
            >
              <Typography>{message}</Typography>
            </Box>
          )}
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

export default ResetPassword;
