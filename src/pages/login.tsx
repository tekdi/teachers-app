import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ReactGA from 'react-ga4';

import Checkbox from '@mui/material/Checkbox';
import Image from 'next/image';
import Loader from '../components/Loader';
import MenuItem from '@mui/material/MenuItem';
import appLogo from '../../public/images/appLogo.png';
import config from '../../config.json';
import { getUserId } from '../services/ProfileService';
import { login } from '../services/LoginService';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { telemetryFactory } from '@/utils/telemetry';
import { logEvent } from '@/utils/googleAnalytics';
import { showToastMessage } from '@/components/Toastify';
import Link from '@mui/material/Link';
import useStore from '@/store/store';

const LoginPage = () => {
  const { t } = useTranslation();
  const store = useStore();
  const setUserRole = useStore(
    (state: { setUserRole: any }) => state.setUserRole
  );
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(lang);
  const [language, setLanguage] = useState(selectedLanguage);
  const [scrolling, setScrolling] = useState(false);

  const theme = useTheme<any>();
  const router = useRouter();

  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.getItem('preferredLanguage')) {
        var lang = localStorage.getItem('preferredLanguage') || 'en';
      } else {
        lang = 'en';
      }
      setLanguage(lang);
      setLang(lang);
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      }
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

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    logEvent({
      action: 'show-password-icon-clicked',
      category: 'Login Page',
      label: 'Show Password',
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    logEvent({
      action: 'login-button-clicked',
      category: 'Login Page',
      label: 'Login Button Clicked',
    });
    if (!usernameError && !passwordError) {
      setLoading(true);
      try {
        const response = await login({
          username: username,
          password: password,
        });
        if (response) {
          if (typeof window !== 'undefined' && window.localStorage) {
            const token = response?.result?.access_token;
            const refreshToken = response?.result?.refresh_token;
            localStorage.setItem('token', token);
            rememberMe
              ? localStorage.setItem('refreshToken', refreshToken)
              : localStorage.removeItem('refreshToken');

            const userResponse = await getUserId();
            localStorage.setItem('userId', userResponse?.userId);
            localStorage.setItem('state', userResponse?.state);
            localStorage.setItem('district', userResponse?.district);
            localStorage.setItem('role', userResponse?.tenantData[0]?.roleName);
            setUserRole(userResponse?.tenantData[0]?.roleName);
          }
        }
        setLoading(false);
        const telemetryInteract = {
          context: {
            env: 'sign-in',
            cdata: [],
          },
          edata: {
            id: 'login-success',
            type: 'CLICK',
            subtype: '',
            pageid: 'sign-in',
            uid: localStorage.getItem('userId') || 'Anonymous',
          },
        };
        telemetryFactory.interact(telemetryInteract);
        router.push('/dashboard');
      } catch (error: any) {
        setLoading(false);
        if (error.response && error.response.status === 404) {
          showToastMessage(
            t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT'),
            'error'
          );
        } else {
          console.error('Error:', error);
          showToastMessage(
            t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT'),
            'error'
          );
        }
      }
    }
  };

  const isButtonDisabled =
    !username || !password || usernameError || passwordError;

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      setLanguage(event.target.value);
      ReactGA.event('select-language-login-page', {
        selectedLanguage: event.target.value,
      });
      router.push('/login', undefined, { locale: newLocale });
    }
  };

  useEffect(() => {
    const handlePasswordFocus = () => {
      if (loginButtonRef.current) {
        setTimeout(() => {
          loginButtonRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 200); // Delay of 200 milliseconds
      }
    };
    const passwordField = passwordRef.current;
    if (passwordField) {
      passwordField.addEventListener('focus', handlePasswordFocus);
      return () => {
        passwordField.removeEventListener('focus', handlePasswordFocus);
      };
    }
  }, []);

  const handleForgotPasswordClick = () => {
    logEvent({
      action: 'forgot-password-link-clicked',
      category: 'Login Page',
      label: 'Forgot Password Link Clicked',
    });
  };

  return (
    <Box sx={{ height: '100vh', overflowY: 'auto', background: 'white' }}>
      <form onSubmit={handleFormSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          bgcolor={theme.palette.warning.A200}
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
            sx={{ margin: '32px 0 65px' }}
          >
            <Image src={appLogo} alt="App Logo" height={100} />{' '}
          </Box>
        </Box>
        <Box
          flexGrow={1}
          display={'flex'}
          bgcolor="white"
          height="auto"
          borderRadius={'2rem 2rem 0 0'}
          zIndex={99}
          justifyContent={'center'}
          p={'2rem'}
          marginTop={'-25px'}
        >
          <Box
            position={'relative'}
            sx={{
              '@media (max-width: 700px)': {
                width: '100%',
              },
            }}
          >
            <Box mt={'0.5rem'}>
              <FormControl sx={{ m: '1rem 0 1rem' }}>
                <Select
                  className="SelectLanguages"
                  value={language}
                  onChange={handleChange}
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['A200'],
                    width: '117px',
                    height: '32px',
                    marginBottom: '0rem',
                    fontSize: '14px',
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
            <Box
              marginY={'1rem'}
              sx={{
                width: '668px',
                '@media (max-width: 700px)': {
                  width: '100%',
                },
              }}
            >
              <TextField
                id="username"
                InputLabelProps={{
                  shrink: true,
                }}
                label={t('LOGIN_PAGE.USERNAME')}
                placeholder={t('LOGIN_PAGE.USERNAME_PLACEHOLDER')}
                value={username}
                onChange={handleUsernameChange}
                error={usernameError}
                className="userName"
              />
            </Box>
            <Box
              sx={{
                width: '668px',
                '@media (max-width: 768px)': {
                  width: '100%',
                },
              }}
              margin={'2rem 0 0'}
            >
              <TextField
                type={showPassword ? 'text' : 'password'}
                id="password"
                InputLabelProps={{
                  shrink: true,
                }}
                onClick={() => setScrolling(!scrolling)}
                className="password"
                InputProps={{
                  endAdornment: (
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
                  ),
                }}
                label={t('LOGIN_PAGE.PASSWORD')}
                placeholder={t('LOGIN_PAGE.PASSWORD_PLACEHOLDER')}
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                inputRef={passwordRef}
              />
            </Box>

            {
              <Box marginTop={'1rem'} marginLeft={'0.8rem'}>
                <Link
                  sx={{ color: theme.palette.secondary.main }}
                  href="https://qa.prathamteacherapp.tekdinext.com/auth/realms/pratham/login-actions/reset-credentials?client_id=security-admin-console&tab_id=rPJFHSFv50M"
                  underline="none"
                  onClick={handleForgotPasswordClick}
                >
                  {t('LOGIN_PAGE.FORGOT_PASSWORD')}
                </Link>
              </Box>
            }
            <Box marginTop={'1.2rem'} className="remember-me-checkbox">
              <Checkbox
                onChange={(e) => setRememberMe(e.target.checked)}
                checked={rememberMe}
              />
              <span
                style={{
                  cursor: 'pointer',
                  color: theme.palette.warning['300'],
                }}
                className="fw-400"
                onClick={() => {
                  setRememberMe(!rememberMe);
                  logEvent({
                    action: 'remember-me-button-clicked',
                    category: 'Login Page',
                    label: `Remember Me ${rememberMe ? 'Checked' : 'Unchecked'}`,
                  });
                }}
              >
                {t('LOGIN_PAGE.REMEMBER_ME')}
              </span>
            </Box>
            <Box
              alignContent={'center'}
              textAlign={'center'}
              marginTop={'2rem'}
              // marginBottom={'2rem'}
              width={'100%'}
            >
              <Button
                variant="contained"
                type="submit"
                fullWidth={true}
                disabled={isButtonDisabled}
                ref={loginButtonRef}
                // sx={{ marginBottom: '2rem' }}
              >
                {t('LOGIN_PAGE.LOGIN')}
              </Button>
            </Box>
          </Box>
        </Box>
      </form>
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

export default LoginPage;
