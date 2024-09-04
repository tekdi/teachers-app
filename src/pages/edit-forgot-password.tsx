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

const EditForgotPassword = () => {
  const { t } = useTranslation();
  const theme = useTheme();

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
          <WestIcon sx={{ color: '#4D4639' }} />
          <Box sx={{ color: '#4D4639', fontWeight: '400', fontSize: '22px' }}>
            Reset Password
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: '14px',
            color: '#1F1B13',
            fontWeight: '400',
            mt: 1.5,
          }}
        >
          Create a new, strong password that you don't use for other websites
        </Box>

        <Box
          sx={{
            '@media (min-width: 900px)': {
              width: '50%',
            },
            width: '100%',
          }}
        >
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
              id="old-password"
              InputLabelProps={{
                shrink: true,
              }}
              type={showPassword ? 'text' : 'password'}
              className="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label={t('LOGIN_PAGE.OLD_PASSWORD')}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
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
              id="new-password"
              InputLabelProps={{
                shrink: true,
              }}
              type={showPassword ? 'text' : 'password'}
              className="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label={t('LOGIN_PAGE.NEW_PASSWORD')}
              value={newPassword}
              onChange={handlePasswordChange}
              error={newPassword.length > 0 && newPassword.length < 8}
              helperText={
                newPassword.length > 0 && newPassword.length < 8
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
              type={showPassword ? 'text' : 'password'}
              className="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={
                confirmPassword.length > 0 && confirmPassword !== newPassword
              }
              helperText={
                confirmPassword.length > 0 && confirmPassword !== newPassword
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
      <Box
        sx={{
          px: '16px',
          color: '#0D599E',
          fontSize: '14px',
          fontWeight: '500',
          mt: 3,
          textAlign: 'center',
        }}
        onClick={() => {
          router.push('/reset-password');
        }}
      >
        Forgot Password?
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
