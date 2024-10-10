import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { login, successfulNotification } from '../services/LoginService';
import { showToastMessage } from '@/components/Toastify';
import { PasswordCreateProps } from '@/utils/Interfaces';
import { useRouter } from 'next/router';

const PasswordCreate: React.FC<PasswordCreateProps> = ({
  handleResetPassword,
  editPassword = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditPassword = router.pathname === '/edit-password';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
    if (samePasswordError) {
      setSamePasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const validatePassword = (value: string) => {
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

  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    !samePasswordError &&
    password &&
    confirmPassword &&
    (!editPassword || (editPassword && oldPassword));

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSamePasswordError(false);

    if (editPassword) {
      if (oldPassword === password) {
        setSamePasswordError(true);
        return;
      }

      const userIdName = localStorage.getItem('userIdName');
      if (!userIdName) {
        showToastMessage(t('LOGIN_PAGE.NO_USERNAME'));
        return;
      }

      setLoading(true);

      try {
        const response = await login({
          username: userIdName,
          password: oldPassword,
        });
        if (response) {
          handleResetPassword(password);
          const username = localStorage.getItem('userEmail');
          if (username) {
            await successfulNotification(false, 'USER', 'OnPasswordReset', {
              receipients: [username],
            });
          }
        } else {
          setOldPasswordError(true);
        }
      } catch (error) {
        console.error('Error verifying old password', error);
        setOldPasswordError(true);
      } finally {
        setLoading(false);
      }
    } else {
      handleResetPassword(password);
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleFormSubmit}>
      {editPassword && (
        <Box
          sx={{
            width: '100%',
          }}
        >
          <TextField
            id="old-password"
            name="old-password-field" // Unique name to prevent autofill
            autoComplete="new-password" // Prevents autofill
            InputLabelProps={{
              shrink: true,
            }}
            type={'password'}
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              if (oldPasswordError) {
                setOldPasswordError(false);
              }
            }}
            error={oldPasswordError}
            helperText={
              oldPasswordError && t('LOGIN_PAGE.CURRENT_PASSWORD_NOT')
            }
            label={t('LOGIN_PAGE.OLD_PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: theme.palette.error.main,
              },
            }}
          />
        </Box>
      )}

      <Box
        sx={{
          width: '100%',
          margin: isEditPassword ? '1.8rem 0 0' : '3.2rem 0 0',
        }}
      >
        <TextField
          id="password"
          name="new-password-field"
          autoComplete="new-password"
          InputLabelProps={{
            shrink: true,
          }}
          type={'password'}
          value={password}
          onChange={handlePasswordChange}
          error={passwordError || samePasswordError}
          FormHelperTextProps={{
            sx: {
              color:
                passwordError || samePasswordError
                  ? theme.palette.error.main
                  : 'inherit',
            },
          }}
          helperText={
            (passwordError && t('LOGIN_PAGE.YOUR_PASSWORD_NEED')) ||
            (samePasswordError && t('LOGIN_PAGE.PASSWORD_SAME_AS_OLD'))
          }
          label={t('LOGIN_PAGE.PASSWORD')}
          fullWidth
          sx={{
            '.MuiFormHelperText-root.Mui-error': {
              color:
                passwordError || samePasswordError
                  ? theme.palette.error.main
                  : 'inherit',
            },
          }}
        />
      </Box>

      {showValidationMessages && passwordError && (
        <>
          <Box sx={{ mt: 0.8, pl: '16px' }}>
            <Typography
              variant="body2"
              color={passwordError ? 'error' : 'textPrimary'}
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '12px',
                fontWeight: '400',
              }}
            >
              <Box
                sx={{
                  color:
                    password.match(/[A-Z]/) && password.match(/[a-z]/)
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_BOTH')}
              </Box>
              <Box
                sx={{
                  color: password.match(/\d/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_NUMBER')}
              </Box>
              <Box
                sx={{
                  color: password.match(/[!@#$%^&*(),.?":{}|<>]/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />{' '}
                {t('LOGIN_PAGE.INCLUDE_SPECIAL')}
              </Box>
              <Box
                sx={{
                  color:
                    password.length >= 8
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  pt: 0.3,
                }}
              >
                <CheckIcon sx={{ fontSize: '15px' }} />
                {t('LOGIN_PAGE.MUST_BE_AT')}
              </Box>
            </Typography>
          </Box>
        </>
      )}

      <Box
        sx={{
          width: '100%',
        }}
        margin={'2rem 0 0'}
      >
        <TextField
          id="confirm-password"
          name="confirm-password-field" // Unique name to prevent autofill
          autoComplete="new-password" // Helps in preventing autofill
          InputLabelProps={{
            shrink: true,
          }}
          type={'password'}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={confirmPasswordError}
          helperText={confirmPasswordError && t('LOGIN_PAGE.NOT_MATCH')}
          label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
          fullWidth
          sx={{
            '.MuiFormHelperText-root.Mui-error': {
              color: theme.palette.error.main,
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
            className="one-line-text"
            disabled={!isFormValid || loading}
          >
            {t('LOGIN_PAGE.RESET_PASSWORD')}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default PasswordCreate;
