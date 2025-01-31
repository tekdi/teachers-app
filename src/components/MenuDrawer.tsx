'use client';

import useStore from '@/store/store';
import { accessGranted } from '@/utils/Helper';
import { AcademicYear } from '@/utils/Interfaces';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { accessControl, TENANT_DATA } from '../../app.config';
import config from '../../config.json';
import { isEliminatedFromBuild } from '../../featureEliminationUtil';
import board from '../assets/images/Board.svg';
import support from '../assets/images/Support.svg';
import checkBook from '../assets/images/checkbook.svg';
import assessment from '../assets/images/assessment.svg';
import surveyForm from '../assets/images/surveyForm.svg';
import { useDirection } from '../hooks/useDirection';
import GroupsIcon from '@mui/icons-material/Groups';
import { YOUTHNET_USER_ROLE } from './youthNet/tempConfigs';
interface DrawerProps {
  toggleDrawer?: (open: boolean) => () => void;
  open: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  handleToggleDrawer?: (open: boolean) => () => void;
}

const MenuDrawer: React.FC<DrawerProps> = ({
  toggleDrawer,
  open,
  language,
  setLanguage,
  handleToggleDrawer,
}) => {
  const theme = useTheme<any>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(open);
  const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>([]);
  const [modifiedAcademicYearList, setModifiedAcademicYearList] = useState<
    AcademicYear[]
  >([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const store = useStore();
  const userRole = store.userRole;
  const { isRTL } = useDirection();
  const setIsActiveYearSelected = useStore(
    (state: { setIsActiveYearSelected: any }) => state.setIsActiveYearSelected
  );
  const isActiveYear = store.isActiveYearSelected;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const isYouthUser = localStorage.getItem('tenantName');
      if (isYouthUser == TENANT_DATA.YOUTHNET) {
        setTenantName(isYouthUser);
      } else {
        setTenantName('');
      }
    }
  }, []);

  useEffect(() => setIsOpen(open), [open]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedList = localStorage.getItem('academicYearList');
      try {
        const parsedList = storedList ? JSON.parse(storedList) : [];
        setAcademicYearList(parsedList);

        const modifiedList = parsedList?.map(
          (item: { isActive: any; session: any }) => {
            if (item.isActive) {
              return {
                ...item,
                session: (
                  <>
                    {item.session} &nbsp;
                    <span
                      style={{
                        color: 'green',
                        fontWeight: '500',
                        fontSize: '12px',
                      }}
                    >
                      ({t('COMMON.ACTIVE')})
                    </span>
                  </>
                ),
              };
            }
            return item;
          }
        );
        setModifiedAcademicYearList(modifiedList);
        const selectedAcademicYearId = localStorage.getItem('academicYearId');
        setSelectedSessionId(selectedAcademicYearId ?? '');
      } catch (error) {
        console.error('Error parsing stored academic year list:', error);
        setAcademicYearList([]);
        setSelectedSessionId('');
      }
    }
  }, [t]);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      router.replace(router.pathname, router.asPath, { locale: newLocale });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedSessionId(event.target.value);
    localStorage.setItem('academicYearId', event.target.value);

    // Check if the selected academic year is active
    const selectedYear = academicYearList?.find(
      (year) => year.id === event.target.value
    );
    const isActive = selectedYear ? selectedYear.isActive : false;
    // localStorage.setItem('isActiveYearSelected', JSON.stringify(isActive));
    setIsActiveYearSelected(isActive);
    queryClient.clear();

    if (isActive) {
      window.location.reload();
    } else {
      router.push('/centers').then(() => {
        window.location.reload();
      });
    }
  };

  const closeDrawer = () => {
    if (toggleDrawer) {
      toggleDrawer(false)();
    } else if (handleToggleDrawer) {
      handleToggleDrawer(false)();
    }
  };

  const navigateToYouthBoard = () => {
    closeDrawer();
    router.push('/youthboard');
  };

  const navigateToDashboard = () => {
    closeDrawer();
    router.push('/dashboard');
  };

  const navigateToObservation = () => {
    closeDrawer();
    router.push('/observation');
  };

  const isDashboard = [
    '/dashboard',
    '/youthboard',
    '/attendance-history',
    '/attendance-overview',
  ].includes(router.pathname);
  const isTeacherCenter = router.pathname.includes('/centers');
  const isCoursePlanner = [
    '/curriculum-planner',
    '/topic-detail-view',
    '/curriculum-planner/center/[cohortId]',
    '/play/content/[identifier]',
  ].includes(router.pathname);
  const isObservation = router.pathname.includes('/observation');

  const isAssessments = router.pathname.includes('/assessments');
  const isBoard = router.pathname.includes('/board-enrollment');
  const isSupportRequest = router.pathname.includes('/support-request');
  const isVillagesAndYouths = router.pathname.includes('/youthboard/villages');
  const isSurveys = router.pathname.includes('/youthboard/surveys');

  return (
    <Drawer
      open={isDesktop || isOpen}
      onClose={closeDrawer}
      transitionDuration={{ enter: 500, exit: 500 }}
      anchor={isRTL ? 'right' : 'left'}
      className="backgroundFaded"
      variant={isDesktop ? 'persistent' : 'temporary'}
      sx={{
        '& .MuiPaper-root': {
          borderRight: `1px solid ${theme.palette.warning['A100']}`,
          zIndex: '998 !important',
          left: isRTL ? '0px !important' : '0px !important',

          width: isRTL ? '350px !important' : 'unset !important',
        },
      }}
    >
      <Box
        sx={{ padding: '16px 16px 12px 16px', width: '350px' }}
        role="presentation"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            className="fs-14 fw-500"
            sx={{ color: theme.palette.warning['A200'] }}
          >
            {t('DASHBOARD.MENU')}
          </Box>
          {!isDesktop && (
            <Box>
              <IconButton onClick={closeDrawer}>
                <ClearIcon sx={{ color: theme.palette.warning['300'] }} />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '22px 0 15px 0',
            gap: '30px',
          }}
        >
          <Box sx={{ flexBasis: '30%' }} className="joyride-step-5">
            <FormControl className="drawer-select" sx={{ width: '100%' }}>
              <Select
                value={i18n.language} // Directly use the language from i18n
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  '& .MuiSelect-icon': {
                    right: isRTL ? 'unset' : '7px',
                    left: isRTL ? '7px' : 'unset',
                  },
                  '& .MuiSelect-select': {
                    paddingRight: isRTL ? '10px' : '32px',
                    paddingLeft: isRTL ? '32px' : '12px',
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
          {!tenantName && (
            <Box sx={{ flexBasis: '70%' }} className="joyride-step-6">
              <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  onChange={handleSelectChange}
                  value={selectedSessionId}
                  className="select-languages"
                  displayEmpty
                  sx={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                    '& .MuiSelect-icon': {
                      right: isRTL ? 'unset' : '7px',
                      left: isRTL ? '7px' : 'unset',
                    },
                    '& .MuiSelect-select': {
                      paddingRight: isRTL
                        ? '10px !important'
                        : '32px !important',
                      paddingLeft: isRTL ? '32px' : '12px',
                    },
                  }}
                >
                  {modifiedAcademicYearList?.map(({ id, session }) => (
                    <MenuItem key={id} value={id}>
                      {session}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {tenantName && (
            <Box>
              <Typography sx={{ fontSize: '12px' }}>
                (Development in progress)
              </Typography>
            </Box>
          )}
        </Box>

        {isActiveYear && !tenantName && (
          <Box>
            <Button
              className="fs-14"
              sx={{
                gap: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isDashboard
                  ? theme.palette.primary.main
                  : 'transparent',
                padding: isDashboard
                  ? '16px 18px !important'
                  : '0px 18px !important',
                marginTop: '25px',
                color: isDashboard ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isDashboard ? '600' : 500,
                '&:hover': {
                  background: isDashboard
                    ? theme.palette.primary.main
                    : 'transparent',
                },
              }}
              startIcon={
                <DashboardOutlinedIcon sx={{ fontSize: '24px !important' }} />
              }
              onClick={navigateToDashboard}
            >
              {t('DASHBOARD.DASHBOARD')}
            </Button>
          </Box>
        )}

        {tenantName && (
          <Box>
            <Button
              className="fs-14"
              sx={{
                gap: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isDashboard
                  ? theme.palette.primary.main
                  : 'transparent',
                padding: isDashboard
                  ? '16px 18px !important'
                  : '0px 18px !important',
                marginTop: '25px',
                color: isDashboard ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isDashboard ? '600' : 500,
                '&:hover': {
                  background: isDashboard
                    ? theme.palette.primary.main
                    : 'transparent',
                },
              }}
              startIcon={
                <DashboardOutlinedIcon sx={{ fontSize: '24px !important' }} />
              }
              onClick={navigateToYouthBoard}
            >
              {t('DASHBOARD.DASHBOARD')}
            </Button>

            {/* villages and youth */}
            <Button
              className="fs-14"
              sx={{
                gap: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isVillagesAndYouths
                  ? theme.palette.primary.main
                  : 'transparent',
                padding: isVillagesAndYouths
                  ? '16px 18px !important'
                  : '0px 18px !important',
                marginTop: '25px',
                color: isVillagesAndYouths
                  ? '#2E1500'
                  : theme.palette.warning.A200,
                fontWeight: isVillagesAndYouths ? '600' : 500,
                '&:hover': {
                  background: isVillagesAndYouths
                    ? theme.palette.primary.main
                    : 'transparent',
                },
              }}
              startIcon={<GroupsIcon sx={{ fontSize: '24px !important' }} />}
              onClick={() => {
                router.push(`/youthboard/villages`);
              }}
            >
              {YOUTHNET_USER_ROLE.MENTOR_LEAD === TENANT_DATA.LEADER
                ? t('DASHBOARD.USERS_&_VILLAGES')
                : t('DASHBOARD.VILLAGES_AND_YOUTH')}
            </Button>

            <Button
              className="fs-14"
              sx={{
                gap: '10px',
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isSurveys
                  ? theme.palette.primary.main
                  : 'transparent',
                padding: isSurveys
                  ? '16px 18px !important'
                  : '0px 18px !important',
                marginTop: '25px',
                color: isSurveys ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isSurveys ? '600' : 500,
                '&:hover': {
                  background: isSurveys
                    ? theme.palette.primary.main
                    : 'transparent',
                },
              }}
              startIcon={<Image
                src={surveyForm}
                alt="SurveyForm-Icon"
                width={24}
                height={24}
              />}
              onClick={() => {
                router.push(`/youthboard/surveys`);
              }}
            >
              {
                t('SURVEYS.SURVEYS')
              }
            </Button>
          </Box>
        )}
        {!tenantName && (
          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14 joyride-step-7"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isTeacherCenter
                  ? theme.palette.primary.main
                  : 'transparent',

                padding: isTeacherCenter
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isTeacherCenter ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isTeacherCenter ? '600' : 500,
                '&:hover': {
                  background: isTeacherCenter
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
                gap: '10px',
              }}
              startIcon={
                <LocalLibraryOutlinedIcon
                  sx={{ fontSize: '24px !important' }}
                />
              }
              onClick={() => {
                router.push(`/centers`); // Check route
              }}
            >
              {accessGranted('showTeachingCenter', accessControl, userRole)
                ? t('DASHBOARD.TEACHING_CENTERS')
                : t('DASHBOARD.MY_TEACHING_CENTERS')}
            </Button>
          </Box>
        )}

        {!tenantName && (
          <Box sx={{ marginTop: '18px' }} className="joyride-step-8">
            <Button
              className="fs-14"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isObservation
                  ? theme.palette.primary.main
                  : 'transparent',
                gap: '10px',
                padding: isObservation
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isObservation ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isObservation ? '600' : 500,
                '&:hover': {
                  background: isObservation
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
              }}
              startIcon={
                <Image
                  src={surveyForm}
                  alt="SurveyForm-Icon"
                  width={24}
                  height={24}
                />
              }
              onClick={navigateToObservation}
            >
              {t('OBSERVATION.SURVEY_FORMS')}
            </Button>
          </Box>
        )}
        {isActiveYear && !tenantName && (
          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14 joyride-step-9"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isCoursePlanner
                  ? theme.palette.primary.main
                  : 'transparent',

                padding: isCoursePlanner
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isCoursePlanner ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isCoursePlanner ? '600' : 500,
                '&:hover': {
                  background: isCoursePlanner
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
                gap: '10px',
              }}
              startIcon={
                <Image
                  src={checkBook}
                  alt="CheckBook Icon"
                  width={24}
                  height={24}
                />
              }
              onClick={() => {
                router.push(`/curriculum-planner`);
              }}
            >
              {t('COURSE_PLANNER.COURSE_PLANNER')}
            </Button>
          </Box>
        )}
        {!isEliminatedFromBuild('Assessments', 'feature') &&
          isActiveYear &&
          !tenantName && (
            <Box sx={{ marginTop: '18px' }}>
              <Button
                className="fs-14 joyride-step-10"
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  background: isAssessments
                    ? theme.palette.primary.main
                    : 'transparent',

                  padding: isAssessments
                    ? '16px 18px !important'
                    : '0px 18px !important',
                  color: isAssessments ? '#2E1500' : theme.palette.warning.A200,
                  fontWeight: isAssessments ? '600' : 500,
                  '&:hover': {
                    background: isAssessments
                      ? theme.palette.primary.main
                      : 'transparent',
                  },
                  marginTop: '15px',
                  gap: '10px',
                }}
                startIcon={
                  <Image
                    src={assessment}
                    alt="Assessment Icon"
                    width={24}
                    height={24}
                  />
                }
                onClick={() => {
                  router.push(`/assessments`);
                }}
              >
                {t('ASSESSMENTS.ASSESSMENTS')}
              </Button>
            </Box>
          )}

        {isActiveYear && !tenantName && (
          <Box sx={{ marginTop: '18px' }} className="joyride-step-11">
            <Button
              className="fs-14 joyride-step-8"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isBoard
                  ? theme.palette.primary.main
                  : 'transparent',
                gap: '10px',
                padding: isBoard
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isBoard ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isBoard ? '600' : 500,
                '&:hover': {
                  background: isBoard
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
              }}
              startIcon={
                <Image src={board} alt="badge Icon" width={24} height={24} />
              }
              onClick={() => {
                router.push(`/board-enrollment`);
              }}
            >
              {t('BOARD_ENROLMENT.BOARD_ENROLLMENT')}
            </Button>
          </Box>
        )}
        {isActiveYear && !tenantName && (
          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isSupportRequest
                  ? theme.palette.primary.main
                  : 'transparent',
                gap: '10px',
                padding: isSupportRequest
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isSupportRequest
                  ? '#2E1500'
                  : theme.palette.warning.A200,
                fontWeight: isSupportRequest ? '600' : 500,
                '&:hover': {
                  background: isSupportRequest
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
              }}
              startIcon={
                <Image
                  src={support}
                  alt="support-icon"
                  width={24}
                  height={24}
                />
              }
              onClick={() => {
                router.push(`/support-request`);
              }}
            >
              {t('COMMON.SUPPORT_REQUEST')}
            </Button>
          </Box>
        )}
        {isActiveYear && !tenantName && (
          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: 'transparent',
                padding: '0px 18px !important',
                gap: '10px',
                color: theme.palette.secondary.main,
                fontWeight: 500,
                '&:hover': {
                  background: 'transparent',
                },
                marginTop: '15px',
              }}
              endIcon={
                <ErrorOutlineIcon sx={{ fontSize: '18px !important' }} />
              }
              onClick={() => {
                localStorage.removeItem('hasSeenTutorial');
                setTimeout(() => {
                  closeDrawer();
                  router.push(`/`);
                }, 0);
              }}
            >
              {t('GUIDE_TOUR.LEARN_HOW_TO_USE')}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
