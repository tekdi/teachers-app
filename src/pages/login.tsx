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
import { getAcademicYear } from '@/services/AcademicYearService';
import manageUserStore from '@/store/manageUserStore';
import useStore from '@/store/store';
import { Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import { AcademicYear } from '@/utils/Interfaces';
import { telemetryFactory } from '@/utils/telemetry';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import config from '../../config.json';
import appLogo from '../../public/images/appLogo.png';
import Loader from '../components/Loader';
import { useDirection } from '../hooks/useDirection';
import { login } from '../services/LoginService';
import { getUserDetails, getUserId } from '../services/ProfileService';
import loginImg from './../assets/images/login-image.jpg';
import { UpdateDeviceNotification } from '@/services/NotificationService';
import { TENANT_DATA } from '../../app.config';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const setIsActiveYearSelected = useStore(
    (state: { setIsActiveYearSelected: any }) => state.setIsActiveYearSelected
  );
  const setUserId = manageUserStore((state) => state.setUserId);
  const setUserRole = useStore(
    (state: { setUserRole: any }) => state.setUserRole
  );

  const { isRTL } = useDirection();

  const setAccessToken = useStore(
    (state: { setAccessToken: any }) => state.setAccessToken
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
      const tenant = localStorage.getItem('tenantName');
      if (token && (tenant?.toLocaleLowerCase() === TENANT_DATA?.SECOND_CHANCE_PROGRAM?.toLowerCase() || tenant?.toLocaleLowerCase() === TENANT_DATA?.PRATHAM_SCP?.toLowerCase())) {
        localStorage.setItem("previousPage", "login");
        router.push('/dashboard');
      } else if (token && tenant?.toLowerCase() == TENANT_DATA?.YOUTHNET?.toLowerCase()) {
        router.push('/youthboard');
        localStorage.setItem("previousPage", "login");

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

  const telemetryOnSubmit = () => {
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
  };

  const getAcademicYearList = async () => {
    const academicYearList: AcademicYear[] = await getAcademicYear();
    if (academicYearList) {
      localStorage.setItem(
        'academicYearList',
        JSON.stringify(academicYearList)
      );
      const extractedAcademicYears = academicYearList?.map(
        ({ id, session, isActive }) => ({ id, session, isActive })
      );
      const activeSession = extractedAcademicYears?.find(
        (item) => item.isActive
      );
      const activeSessionId = activeSession ? activeSession.id : '';
      localStorage.setItem('academicYearId', activeSessionId);
      setIsActiveYearSelected(true);

      return activeSessionId;
    }
  };

  const handleInvalidUsernameOrPassword = () => {
    showToastMessage(t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT'), 'error');
    logEvent({
      action: 'login-fail',
      category: 'Login Page',
      label: 'Login Fail',
    });
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
        const response = await login({ username, password });

        if (response?.result?.access_token) {
          if (typeof window !== 'undefined' && window.localStorage) {
            const token = response.result.access_token;
            const refreshToken = response?.result?.refresh_token;

            if (token) {
              localStorage.setItem('token', token);
            }

            if (rememberMe) {
              localStorage.setItem('refreshToken', refreshToken);
            } else {
              localStorage.removeItem('refreshToken');
            }

            const userResponse = await getUserId();

            const userId = userResponse?.userId;
            if (userResponse.tenantData && userResponse.tenantData.length > 0) {
              const tenantName = userResponse.tenantData[0].tenantName;
              const tenantId = userResponse.tenantData[0].tenantId;
              localStorage.setItem('tenantName', tenantName);
              localStorage.setItem('tenantId', tenantId);
            } else {
              console.error('Tenant data not found in user response.');
            }
            localStorage.setItem('userId', userId);
            setUserId(userId);

            if (token && userId) {
              document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
              document.cookie = `userId=${userId}; path=/; secure; SameSite=Strict`;

              // Retrieve deviceID from local storage
              const deviceID = localStorage.getItem('deviceID');

              if (deviceID) {
                try {
                  // Update device notification
                  const headers = {
                    tenantId: userResponse?.tenantData[0]?.tenantId,
                    Authorization: `Bearer ${token}`,
                  };

                  await UpdateDeviceNotification(
                    { deviceId: deviceID, action: 'add' },
                    userId,
                    headers
                  );

                } catch (updateError) {
                  console.error(
                    'Error updating device notification:',
                    updateError
                  );
                }
              }
            }

            logEvent({
              action: 'login-success',
              category: 'Login Page',
              label: 'Login Success',
              value: userId,
            });

            localStorage.setItem('role', userResponse?.tenantData[0]?.roleName);
            localStorage.setItem('userEmail', userResponse?.email);
            localStorage.setItem('userName', userResponse?.firstName);
            localStorage.setItem('userIdName', userResponse?.username);
            localStorage.setItem(
              'temporaryPassword',
              userResponse?.temporaryPassword ?? 'false'
            );
            localStorage.setItem('userData', JSON.stringify(userResponse));

            setUserRole(userResponse?.tenantData[0]?.roleName);
            setAccessToken(token);

            const tenant = localStorage.getItem('tenantName');
            if (tenant?.toLocaleLowerCase() === TENANT_DATA?.SECOND_CHANCE_PROGRAM?.toLowerCase() || tenant?.toLocaleLowerCase() === TENANT_DATA?.PRATHAM_SCP?.toLowerCase()) {
              const userDetails = await getUserDetails(userId, true);
              if (userDetails?.result?.userData) {
                const activeSessionId = await getAcademicYearList();
                const customFields =
                  userDetails?.result?.userData?.customFields;
                if (customFields?.length) {
                  const state = customFields.find(
                    (field: any) => field?.label === 'STATES'
                  );
                  const district = customFields.find(
                    (field: any) => field?.label === 'DISTRICTS'
                  );
                  const block = customFields.find(
                    (field: any) => field?.label === 'BLOCKS'
                  );

                  if (state) {
                    localStorage.setItem('stateName', state?.value);
                    setStateName(state?.value);
                    setStateCode(state?.code);
                    setStateId(state?.fieldId);
                  }

                  if (district) {
                    setDistrictName(district?.value);
                    setDistrictCode(district?.code);
                    setDistrictId(district?.fieldId);
                  }

                  if (block) {
                    setBlockName(block?.value);
                    setBlockCode(block?.code);
                    setBlockId(block?.fieldId);
                  }
                }

                if (activeSessionId) {
                  router.push('/dashboard');
                }
              }
            } else if (token && tenant?.toLowerCase() === TENANT_DATA.YOUTHNET?.toLowerCase()) {
              router.push('/youthboard');
            }
          }
          setLoading(false);
        } else if (response?.responseCode === 404) {
          handleInvalidUsernameOrPassword();
          setLoading(false);
        }
        telemetryOnSubmit();
      } catch (error: any) {
        setLoading(false);
        if (error?.response?.status === 404) {
          handleInvalidUsernameOrPassword();
        } else {
          console.error('Error:', error);
          showToastMessage(
            t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT'),
            'error'
          );
        }

        const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split("/")[0];
    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: 'failed-login',

        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
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
      setSelectedLanguage(newLocale);
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

  const darkMode =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('mui-mode')
      : null;
  return (
    <Box sx={{ overflowY: 'auto', background: theme.palette.warning['A400'] }}>
      <Box
        display="flex"
        flexDirection="column"
        bgcolor={theme.palette.warning.A200}
        borderRadius={'10px'}
        sx={{
          '@media (min-width: 900px)': {
            display: 'none',
          },
        }}
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
          sx={{ margin: '5px 10px 25px' }}
        >
          <Box
            sx={{ width: '55%', '@media (max-width: 400px)': { width: '95%' } }}
          >
            <Image
              src={appLogo}
              alt="App Logo"
              height={80}
              layout="responsive"
            />
          </Box>
        </Box>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent={'center'}
        px={'30px'}
        marginBottom={'10px'}
        alignItems={'center'}
        width={'100% !important'}
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
                // display={'flex'}
                bgcolor={theme.palette.warning['A400']}
                height="auto"
                zIndex={99}
                justifyContent={'center'}
                p={'2rem'}
                borderRadius={'2rem 2rem 0 0'}
                sx={{
                  '@media (min-width: 900px)': {
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow:
                      darkMode === 'dark'
                        ? 'rgba(0, 0, 0, 0.9) 0px 2px 8px 0px'
                        : 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    marginTop: '50px',
                  },
                  '@media (max-width: 900px)': {
                    marginTop: '-25px',
                  },
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  bgcolor={theme.palette.warning.A200}
                  borderRadius={'10px'}
                  sx={{
                    '@media (max-width: 900px)': {
                      display: 'none',
                    },
                  }}
                >
                  {loading && (
                    <Loader
                      showBackdrop={true}
                      loadingText={t('COMMON.LOADING')}
                    />
                  )}
                  <Box
                    display={'flex'}
                    overflow="auto"
                    alignItems={'center'}
                    justifyContent={'center'}
                    zIndex={99}
                  // sx={{ margin: '5px 10px 25px', }}
                  >
                    <Box
                      sx={{
                        width: '60%',
                        '@media (max-width: 700px)': { width: '95%' },
                      }}
                    >
                      <Image
                        src={appLogo}
                        alt="App Logo"
                        height={80}
                        layout="responsive"
                      />
                    </Box>
                  </Box>
                </Box>
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
                        inputProps={{
                          'aria-label': 'Select Language',
                        }}
                        className="select-languages"
                        value={i18n.language}
                        onChange={handleChange}
                        displayEmpty
                        sx={{
                          borderRadius: '0.5rem',
                          width: '117px',
                          height: '32px',
                          marginBottom: '0rem',
                          fontSize: '14px',
                          '& .MuiSelect-icon': {
                            right: isRTL ? 'unset' : '7px',
                            left: isRTL ? '7px' : 'unset',
                          },
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

                  <Box
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: theme.palette.secondary.main,
                      mt: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleForgotPasswordClick();
                      // router.push('/forgot-password');
                      const resetAppUrl =
                        process.env.NEXT_PUBLIC_RESET_PASSWORD_URL;
                      window.open(
                        `${resetAppUrl}?redirectUrl=${window.location.origin}/login`,
                        '_self'
                      );
                    }}
                  >
                    {t('LOGIN_PAGE.FORGOT_PASSWORD')}
                  </Box>

                  <Box marginTop={'1.2rem'} className="">
                    <Checkbox
                      // color="info"
                      onChange={(e) => setRememberMe(e.target.checked)}
                      checked={rememberMe}
                      inputProps={{ 'aria-label': 'Remember Me' }}
                    />
                    <button
                      type="button"
                      style={{
                        cursor: 'pointer',
                        color: theme.palette.warning['300'],
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        font: 'inherit',
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
                    </button>
                  </Box>
                  <Box
                    alignContent={'center'}
                    textAlign={'center'}
                    marginTop={'2rem'}
                    width={'100%'}
                  >
                    <Button
                      variant="contained"
                      color="primary"
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
