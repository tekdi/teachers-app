import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect, useRef, useState } from 'react';
import ReactGA from 'react-ga4';

import { showToastMessage } from '@/components/Toastify';
import manageUserStore from '@/store/manageUserStore';
import useStore from '@/store/store';
import { logEvent } from '@/utils/googleAnalytics';
import { telemetryFactory } from '@/utils/telemetry';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import config from '../../config.json';
import appLogo from '../../public/images/appLogo.png';
import Loader from '../components/Loader';
import { login } from '../services/LoginService';
import { getUserDetails, getUserId } from '../services/ProfileService';
import loginImg from './../assets/images/login-image.jpg';
import { Telemetry } from '@/utils/app.constant';

const LoginPage = () => {
  const { t } = useTranslation();
  const setUserId = manageUserStore((state) => state.setUserId);
  const setUserRole = useStore(
    (state: { setUserRole: any }) => state.setUserRole
  );

  const setDistrictCode = manageUserStore(
    (state: { setDistrictCode: any }) => state.setDistrictCode
  );
  const setDistrictId = manageUserStore(
    (state: { setDistrictId: any }) => state.setDistrictId
  );

  const setDistrictName = manageUserStore(
    (state: { setDistrictName: any }) => state.setDistrictName
  );

  const setStateCode = manageUserStore(
    (state: { setStateCode: any }) => state.setStateCode
  );
  const setStateId = manageUserStore(
    (state: { setStateId: any }) => state.setStateId
  );

  const setStateName = manageUserStore(
    (state: { setStateName: any }) => state.setStateName
  );

  const setBlockCode = manageUserStore(
    (state: { setBlockCode: any }) => state.setBlockCode
  );
  const setBlockId = manageUserStore(
    (state: { setBlockId: any }) => state.setBlockId
  );
  const setBlockName = manageUserStore(
    (state: { setBlockName: any }) => state.setBlockName
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
      let lang;
      if (localStorage.getItem('preferredLanguage')) {
        lang = localStorage.getItem('preferredLanguage') ?? 'en';
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
            setUserId(userResponse?.userId);
            logEvent({
              action: 'login-success',
              category: 'Login Page',
              label: 'Login Success',
              value: userResponse?.userId,
            });

            localStorage.setItem('role', userResponse?.tenantData[0]?.roleName);
            localStorage.setItem('userEmail', userResponse?.email);
            localStorage.setItem('userName', userResponse?.name);
            localStorage.setItem('userId', userResponse?.userId);
            setUserRole(userResponse?.tenantData[0]?.roleName);

            const userDetails = await getUserDetails(
              userResponse?.userId,
              true
            );
            if (userDetails?.result?.userData) {
              const customFields = userDetails?.result?.userData?.customFields;
              if (customFields?.length) {
                const state = customFields.find((field: any) => field?.label === "STATES");
                const district = customFields.find((field: any) => field?.label === "DISTRICTS");
                const block = customFields.find((field: any) => field?.label === "BLOCKS");

                if(state) {
                  localStorage.setItem('stateName', state?.value);
                  setStateName(state?.value);
                  setStateCode(state?.id);
                }
                 
                if (district) {
                  setDistrictName(district?.value);
                  setDistrictCode(district?.code);
                }

                if (block) {
                  setBlockName(block?.value);
                  setBlockCode(block?.code);
                }
              }

              console.log('userDetails', userDetails);
            }
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
            type: Telemetry.CLICK,
            subtype: '',
            pageid: 'sign-in',
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
          logEvent({
            action: 'login-fail',
            category: 'Login Page',
            label: 'Login Fail',
            value: error.response,
          });
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
    <Box sx={{ overflowY: 'auto', background: 'white' }}>
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

      <Grid
        container
        spacing={2}
        justifyContent={'center'}
        px={'30px'}
        alignItems={'center'}
      >
        <Grid
          sx={{
            '@media (max-width: 900px)': {
              display: 'none',
            },
          }}
          item
          xs={12}
          sm={12}
          md={6}
        >
          <Image
            className="login-img"
            src={loginImg}
            alt="Login Image"
            layout="responsive"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <form onSubmit={handleFormSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                flexGrow={1}
                display={'flex'}
                bgcolor="white"
                height="auto"
                zIndex={99}
                justifyContent={'center'}
                p={'2rem'}
                borderRadius={'2rem 2rem 0 0'}
                marginTop={'-25px'}
                sx={{
                  '@media (min-width: 900px)': {
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    '@media (max-width: 700px)': {
                      width: '100%',
                    },
                  }}
                >
                  <Box mt={'0.5rem'}>
                    <FormControl sx={{ m: '1rem 0 1rem' }}>
                      <Select
                        className="select-languages"
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
                      '@media (min-width: 900px)': {
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
                      '@media (min-width: 900px)': {
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
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

                  {/* {
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
                  } */}
                  <Box marginTop={'1.2rem'} className="remember-me-checkbox">
                    <Checkbox
                      onChange={(e) => setRememberMe(e.target.checked)}
                      checked={rememberMe}
                    />
                    <span
                      role="checkbox"
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
                      sx={{
                        '@media (min-width: 900px)': {
                          width: '50%',
                        },
                      }}
                    >
                      {t('LOGIN_PAGE.LOGIN')}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>
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
