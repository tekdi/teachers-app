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

const CreatePassword = () => {
  const { t } = useTranslation();
  const theme = useTheme();

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
            color: '#1F1B13',
            fontWeight: '400',
            fontSize: '22px',
            textAlign: 'center',
          }}
        >
          {t('Create a strong password')}
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
          {t(
            "Create a new, strong password that you don't use for other websites"
          )}
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
            type={'password'}
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            FormHelperTextProps={{
              sx: {
                color: passwordError ? '#4D4639' : 'inherit',
              },
            }}
            helperText={passwordError && t('Your password needs to:')}
            label={t('LOGIN_PAGE.PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: '#4D4639',
              },
            }}
          />
        </Box>

        {showValidationMessages && passwordError && (
          <Box sx={{ mt: 1, pl: '16px' }}>
            <Typography
              variant="body2"
              color={passwordError ? 'error' : 'textPrimary'}
              sx={{
                color: '#4D4639',
                fontSize: '16px',
                fontWeight: '400',
              }}
            >
              <Box
                sx={{
                  color:
                    password.match(/[A-Z]/) && password.match(/[a-z]/)
                      ? '#1A8825'
                      : '#BA1A1A',
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ Include both upper case and lower case
              </Box>
              <Box
                sx={{
                  color: password.match(/\d/) ? '#1A8825' : '#BA1A1A',
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ Include at least one number
              </Box>
              <Box
                sx={{
                  color: password.match(/[!@#$%^&*(),.?":{}|<>]/)
                    ? '#1A8825'
                    : '#BA1A1A',
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ Include at least one special character
              </Box>
              <Box
                sx={{
                  color: password.length >= 8 ? '#1A8825' : '#BA1A1A',
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ Must be at least 8 characters long
              </Box>
            </Typography>
          </Box>
        )}

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
            type={'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={confirmPasswordError}
            helperText={confirmPasswordError && t('Passwords do not match')}
            label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: '#BA1A1A',
              },
            }}
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
              }}
              disabled={!isFormValid}
            >
              {t('LOGIN_PAGE.RESET_PASSWORD')}
            </Button>
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

export default CreatePassword;
