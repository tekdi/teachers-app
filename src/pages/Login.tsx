'use client';
import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Image from 'next/image';
import appLogo2 from '../../public/appLogo.png';
import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { useLocation } from 'react-router-dom';
// import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { login } from '../services/LoginService';
import { useTranslation } from 'react-i18next';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import config from '../../config.json';
// import { getUserId } from '../services/ProfileService';
import Loader from '../components/Loader';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showToastMessage, setShowToastMessage] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'en'
  );
  const [language, setLanguage] = useState(selectedLanguage);
  const theme = useTheme<any>();
  // const router = useRouter();
  // const location = useLocation();

  const DEFAULT_POSITION: Pick<State, 'vertical' | 'horizontal'> = {
    vertical: 'top',
    horizontal: 'center',
  };
  const [state, setState] = React.useState<State>({
    openModal: false,
    ...DEFAULT_POSITION,
  });
  const { vertical, horizontal, openModal } = state;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // router.push('/dashboard');
    }
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const trimmedValue = value.trim();
    setUsername(trimmedValue);
    const containsSpace = /\s/.test(trimmedValue);
    setUsernameError(containsSpace);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!usernameError && !passwordError) {
      setLoading(true);
      event.preventDefault();
      try {
        const response = await login({
          username: username,
          password: password,
        });
        console.log(response);
        if (response) {
          setTimeout(() => {
            setState({
              openModal: false,
              ...DEFAULT_POSITION,
            });
            setShowToastMessage(false);
          });

          const token = response?.access_token;
          const refreshToken = response?.refresh_token;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);

          // const userResponse = await getUserId();
          // localStorage.setItem('userId', userResponse?.userId);
        }
        setLoading(false);
        // router.push('/dashboard');
      } catch (error: any) {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          handleClick({ ...DEFAULT_POSITION })();
          setShowToastMessage(true);
        } else {
          console.error('Error:', error);
        }
      }
    }
  };

  const isButtonDisabled =
    !username || !password || usernameError || passwordError;

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, openModal: true });
  };

  const handleClose = () => {
    setState({ ...state, openModal: false });
  };
  const action = useMemo(
    () => (
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    ),
    [t]
  );

  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        bgcolor={theme.palette.warning.A200}
        minHeight={'100vh'}
      >
        {loading && (
          <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
        )}
        <Box
          display={'flex'}
          overflow="auto"
          alignItems={'center'}
          justifyContent={'center'}
          zIndex={99}
          sx={{ margin: '32px 0' }}
        >
          <Image src={appLogo2} alt="App Logo" />{' '}
        </Box>
        <Box
          flexGrow={1}
          display={'flex'}
          bgcolor="white"
          overflow="auto"
          height="auto"
          borderRadius={'2rem 2rem 0 0'}
          zIndex={99}
          justifyContent={'center'}
          p={'2rem'}
        >
          <Box position={'relative'}>
            <Box mt={'0.5rem'}>
              <FormControl sx={{ m: '2rem 0 1rem' }}>
                <Select
                  className="SelectLanguages"
                  value={language}
                  onChange={handleChange}
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: 'auto',
                    marginBottom: '0rem',
                  }}
                >
                  {config?.languages.map((lang) => (
                    <MenuItem value={lang.code} key={lang.code}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box marginY={'1rem'}>
              <FormControl
                variant="outlined"
                fullWidth={true}
                className="CssTextField"
              >
                <InputLabel
                  htmlFor="outlined-adornment-username"
                  error={usernameError}
                >
                  {t('LOGIN_PAGE.USERNAME')}
                </InputLabel>
                <OutlinedInput
                  type={'text'}
                  label={t('LOGIN_PAGE.USERNAME')}
                  placeholder={t('LOGIN_PAGE.USERNAME_PLACEHOLDER')}
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameError}
                />
              </FormControl>
            </Box>
            <Box marginY={'1rem'}>
              <FormControl variant="outlined" className="CssTextField">
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  error={passwordError}
                >
                  {t('LOGIN_PAGE.PASSWORD')}
                </InputLabel>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={t('LOGIN_PAGE.PASSWORD')}
                  placeholder={t('LOGIN_PAGE.PASSWORD_PLACEHOLDER')}
                  value={password}
                  onChange={handlePasswordChange}
                  error={passwordError}
                />
              </FormControl>
            </Box>

            <Box marginTop={'-1rem'} marginLeft={'0.5rem'}>
              <Link sx={{ color: 'blue' }} href="#" underline="none">
                {t('LOGIN_PAGE.FORGOT_PASSWORD')}
              </Link>
            </Box>
            <Box marginTop={'1rem'} className="RememberMecheckbox">
              <Checkbox defaultChecked />
              {t('LOGIN_PAGE.REMEMBER_ME')}
            </Box>
            <Box
              alignContent={'center'}
              textAlign={'center'}
              marginTop={'1rem'}
              bottom={'1rem'}
              width={'100%'}
            >
              <Button
                variant="contained"
                type="submit"
                fullWidth={true}
                disabled={isButtonDisabled}
              >
                {t('LOGIN_PAGE.LOGIN')}
              </Button>
            </Box>
          </Box>
        </Box>
        {showToastMessage && (
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openModal}
            onClose={handleClose}
            className="alert"
            autoHideDuration={5000}
            key={vertical + horizontal}
            message={t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT')}
            action={action}
          />
        )}
      </Box>
    </form>
  );
};

export default LoginPage;
