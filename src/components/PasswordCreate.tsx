import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import { login } from '../services/LoginService';

interface PasswordCreateProps {
  handleResetPassword: (password: string) => void;
  editPassword?: boolean;
}

const PasswordCreate: React.FC<PasswordCreateProps> = ({
  handleResetPassword,
  editPassword = false, // default to false
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
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
    !passwordError && !confirmPasswordError && password && confirmPassword;

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (editPassword) {
      const userIdName = localStorage.getItem('userIdName');
      if (!userIdName) {
        console.error('User ID not found in localStorage');
        return;
      }

      setLoading(true);

      try {
        // Call the login API to verify the old password
        const response = await login({
          username: userIdName,
          password: oldPassword,
        });

        if (response) {
          // Old password matches, proceed to reset password
          handleResetPassword(password);
        } else {
          // Old password does not match, show error
          setOldPasswordError(true);
        }
      } catch (error) {
        console.error('Error verifying old password', error);
        setOldPasswordError(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Directly reset the password if not editing the old one
      handleResetPassword(password);
    }
  };

  return (
    <>
      {/* Conditionally render the old password field */}
      {editPassword && (
        <Box
          sx={{
            width: '100%',
          }}
          margin={'3.2rem 0 0'}
        >
          <TextField
            id="old-password"
            InputLabelProps={{
              shrink: true,
            }}
            type={'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            error={oldPasswordError}
            helperText={
              oldPasswordError && t('LOGIN_PAGE.OLD_PASSWORD_INCORRECT')
            }
            label="Old Password"
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
              color: passwordError ? theme.palette.warning['A200'] : 'inherit',
            },
          }}
          helperText={passwordError && t('LOGIN_PAGE.YOUR_PASSWORD_NEED')}
          label={t('LOGIN_PAGE.PASSWORD')}
          fullWidth
          sx={{
            '.MuiFormHelperText-root.Mui-error': {
              color: theme.palette.warning['A200'],
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
            onClick={handleFormSubmit}
            disabled={!isFormValid || loading}
          >
            {t('LOGIN_PAGE.RESET_PASSWORD')}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PasswordCreate;
