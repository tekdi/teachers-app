'use client';

import { Button, FormControl, IconButton, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Drawer from '@mui/material/Drawer';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import config from '../../config.json';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Role } from '@/utils/app.constant';
import useStore from '@/store/store';
import { accessGranted } from '@/utils/Helper';
import { accessControl } from '../../app.config';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import checkBook from '../assets/images/checkbook.svg';
import Image from 'next/image';
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
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
  const store = useStore();
  const userRole = store.userRole;

  useEffect(() => setIsOpen(open), [open, toggleDrawer, handleToggleDrawer]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      setLanguage(lang);
      const role = localStorage.getItem('role');
      if (role === 'Team Leader') {
        setIsTeamLeader(true);
      }
    }
  }, [setLanguage]);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      router.replace(router.pathname, router.asPath, { locale: newLocale });
    }
  };

  const closeDrawer = () => {
    if (toggleDrawer) {
      toggleDrawer(false)();
    } else if (handleToggleDrawer) {
      handleToggleDrawer(false)();
    }
  };
  

  const navigateToDashboard = () => {
    closeDrawer();
    router.push('/dashboard');
  };

  const navigateToManageUser = () => {
    closeDrawer();
    router.push('/manageUser');
  };

  const isDashboard = router.pathname === '/dashboard';
  const isTeacherCenter = router.pathname === '/centers';
  const isCoursePlanner = router.pathname === '/course-planner';
  const isAssessments = router.pathname === '/assessments';

  // const isManageUser = router.pathname === '/manageUser';

  return (
    <Drawer
      open={isDesktop || isOpen}
      onClose={
        closeDrawer
      }
      transitionDuration={{ enter: 500, exit: 500 }}
      className="backgroundFaded"
      variant={isDesktop ? 'persistent' : 'temporary'}
      sx={{
        '& .MuiPaper-root': {
          borderRight: `1px solid theme.palette.warning['A100']`,
          zIndex: '998 !important',
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
              <IconButton
                onClick={
                  closeDrawer
                }
              >
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
                value={language}
                onChange={handleChange}
                displayEmpty
                className="select-languages fs-14 fw-500"
                style={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
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
          <Box sx={{ flexBasis: '70%' }}>
            <FormControl className="drawer-select" sx={{ width: '100%' }}>
              <Select
                className="select-languages"
                displayEmpty
                style={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  marginBottom: '0rem',
                }}
              >
                <MenuItem>Program 2024-25</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Button
            className="fs-14"
            sx={{
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
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14 joyride-step-6"
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
            }}
            startIcon={
              <LocalLibraryOutlinedIcon sx={{ fontSize: '24px !important' }} />
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
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: 'transparent',
              padding: '0px 18px !important',
              color: theme.palette.warning.A200,
              fontWeight: 500,
              '&:hover': {
                background: 'transparent',
              },
              marginTop: '15px',
            }}
            startIcon={<EditNoteIcon sx={{ fontSize: '24px !important' }} />}
            // onClick={navigateToManageUser}
          >
            {t('COMMON.OBSERVATIONS_FORMS')}
          </Button>

          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14 joyride-step-7"
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
                router.push(`/course-planner`); // Check route
              }}
            >
              {t('COURSE_PLANNER.COURSE_PLANNER')}
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14 joyride-step-8"
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
            }}
            startIcon={
              <EventAvailableOutlinedIcon
                sx={{ fontSize: '24px !important' }}
              />
            }
            onClick={() => {
              router.push(`/assessments`);
            }}
          >
            {t('ASSESSMENTS.ASSESSMENTS')}
          </Button>
        </Box>
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14"
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
            }}
            startIcon={
              <EventAvailableOutlinedIcon
                sx={{ fontSize: '24px !important' }}
              />
            }
            onClick={() => {
              router.push(`/assessments`);
            }}
          >
            {t('ASSESSMENTS.ASSESSMENTS')}
          </Button>
        </Box>

        {/* <Box sx={{ marginTop: '12px' }}>
          <Button
            className="fs-14"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isManageUser
                ? theme.palette.primary.main
                : 'transparent',

              padding: isManageUser
                ? '16px 18px !important'
                : '0px 18px !important',
              color: isManageUser ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isManageUser ? '600' : 500,
              '&:hover': {
                background: isManageUser
                  ? theme.palette.primary.main
                  : 'transparent',
              },
              marginTop: '15px',
            }}
            startIcon={<PeopleOutlineOutlinedIcon />}
            onClick={navigateToManageUser}
          >
            {t('COMMON.MANAGE_USERS')}
          </Button>
        </Box> */}
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
