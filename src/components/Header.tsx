'use client';

import { UpdateDeviceNotification } from '@/services/NotificationService';
import { Telemetry } from '@/utils/app.constant';
import { logEvent } from '@/utils/googleAnalytics';
import { telemetryFactory } from '@/utils/telemetry';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import logoLight from '../../public/images/logo-light.png';
import menuIcon from '../assets/images/menuIcon.svg';
import { useDirection } from '../hooks/useDirection';
import useStore from '../store/store';
import ConfirmationModal from './ConfirmationModal';
import StyledMenu from './StyledMenu';
import { TENANT_DATA } from '../../app.config';

interface HeaderProps {
  toggleDrawer?: (newOpen: boolean) => () => void;
  openDrawer?: boolean;
}

// Dynamic import for MenuDrawer to avoid SSR issues
const MenuDrawer = dynamic(() => import('./MenuDrawer'), {
  ssr: false,
});

const Header: React.FC<HeaderProps> = ({ toggleDrawer, openDrawer }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const theme = useTheme<any>();
  const store = useStore();
  const isActiveYear = store.isActiveYearSelected;

  const [userId, setUserId] = useState<string>('');
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [language, setLanguage] = useState<string>(selectedLanguage);
  const [darkMode, setDarkMode] = useState<string | null>(null);
  const { isRTL } = useDirection();

  // Retrieve stored userId and language
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUserId = localStorage.getItem('userId') as string;
      const storedLanguage = localStorage.getItem('preferredLanguage');
      const storedDarkMode = localStorage.getItem('mui-mode');
      if (storedUserId) setUserId(storedUserId);
      if (storedLanguage) setSelectedLanguage(storedLanguage);
      if (storedDarkMode) setDarkMode(storedDarkMode);
    }
  }, []);

  const handleProfileClick = () => {
    const tenant = localStorage.getItem('tenantName');
    if (pathname !== `/user-profile/${userId}`) {
      if (tenant?.toLowerCase() === TENANT_DATA.YOUTHNET?.toLowerCase()) {
        router.push(`/youthboard/user-profile/${userId}`);
      } else if (
        tenant?.toLowerCase() ===
        TENANT_DATA.SECOND_CHANCE_PROGRAM?.toLowerCase()
      ) {
        router.push(`/user-profile/${userId}`);
      }
      logEvent({
        action: 'my-profile-clicked-header',
        category: 'Dashboard',
        label: 'Profile Clicked',
      });
    }
  };

  const handleLogoutClick = async () => {
    router.replace('/logout');
    logEvent({
      action: 'logout-clicked-header',
      category: 'Dashboard',
      label: 'Logout Clicked',
    });
    const token = localStorage.getItem('token');

    const tenantid = localStorage.getItem('tenantId');
    const deviceID = localStorage.getItem('deviceID');
    const windowUrl = window.location.pathname;
    const cleanedUrl = windowUrl.replace(/^\//, '');
    const env = cleanedUrl.split('/')[0];
    const telemetryInteract = {
      context: {
        env: env,
        cdata: [],
      },
      edata: {
        id: 'logout-user',

        type: Telemetry.CLICK,
        subtype: '',
        pageid: cleanedUrl,
      },
    };
    telemetryFactory.interact(telemetryInteract);
    if (deviceID) {
      try {
        const tenantId = tenantid;

        const headers = {
          tenantId,
          Authorization: `Bearer ${token}`,
        };

        await UpdateDeviceNotification(
          { deviceId: deviceID, action: 'remove' },
          userId,
          headers
        );
      } catch (updateError) {
        console.error('Error updating device notification:', updateError);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleDrawer = (newOpen: boolean) => () => {
    setOpenMenu(newOpen);
  };

  // Check if the user has seen the tutorial
  const hasSeenTutorial =
    typeof window !== 'undefined' &&
    window.localStorage.getItem('hasSeenTutorial') === 'true';

  const getMessage = () => {
    if (modalOpen) return t('COMMON.SURE_LOGOUT');
    return '';
  };

  const handleCloseModel = () => {
    setModalOpen(false);
  };

  const logoutOpen = () => {
    handleClose();
    setModalOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          height: '64px',
        }}
      >
        <Box
          className="w-md-100 ps-md-relative"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            '@media (max-width: 500px)': {
              position: hasSeenTutorial ? 'fixed' : 'relative',
            },
            top: '0px',
            zIndex: '999',
            width: '100%',
            bgcolor: theme.palette.warning['A400'],
          }}
        >
          <Stack
            width={'100%'}
            direction="row"
            justifyContent={'space-between'}
            alignItems={'center'}
            height="64px"
            boxShadow={
              darkMode === 'dark'
                ? '0px 1px 3px 0px #ffffff1a'
                : '0px 1px 3px 0px #0000004D'
            }
            className={isRTL ? '' : 'pl-md-20'}
          >
            <Box
              onClick={() => {
                if (openDrawer) {
                  if (toggleDrawer) {
                    toggleDrawer(true)();
                  }
                } else {
                  handleToggleDrawer(true)();
                }
              }}
              mt={'0.5rem'}
              className="display-md-none"
              paddingLeft={'20px'}
              sx={{ marginRight: isRTL ? '20px' : '0px' }}
            >
              <Image
                height={12}
                width={18}
                src={menuIcon}
                alt="menu"
                style={{ cursor: 'pointer' }}
              />
            </Box>

            <Image
              height={40}
              width={44}
              src={logoLight}
              alt="logo"
              onClick={() => isActiveYear && router.push('/dashboard')}
              style={{ marginRight: isRTL ? '20px' : '0px', cursor: 'pointer' }}
            />

            <Box
              onClick={handleClick}
              sx={{
                cursor: 'pointer',
                position: 'relative',
                marginLeft: isRTL ? '16px' : '0px',
              }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : 'false'}
              paddingRight={'20px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              flexDirection={'column'}
              mt={'0.5rem'}
            >
              <AccountCircleOutlinedIcon
                sx={{ color: theme.palette.warning['A200'] }}
              />
            </Box>

            <StyledMenu
              id="profile-menu"
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {pathname !== `/user-profile/${userId}` && (
                <MenuItem
                  onClick={handleProfileClick}
                  disableRipple
                  sx={{ 'letter-spacing': 'normal' }}
                >
                  <PersonOutlineOutlinedIcon />
                  {t('PROFILE.MY_PROFILE')}
                </MenuItem>
              )}
              <MenuItem
                onClick={logoutOpen}
                disableRipple
                sx={{
                  'letter-spacing': 'normal',
                  color: theme.palette.warning['300'],
                }}
              >
                <LogoutOutlinedIcon
                  sx={{ color: theme.palette.warning['300'] }}
                />
                {t('COMMON.LOGOUT')}
              </MenuItem>
            </StyledMenu>
          </Stack>
        </Box>

        <ConfirmationModal
          message={getMessage()}
          handleAction={handleLogoutClick}
          buttonNames={{
            primary: t('COMMON.LOGOUT'),
            secondary: t('COMMON.CANCEL'),
          }}
          handleCloseModal={handleCloseModel}
          modalOpen={modalOpen}
        />

        <MenuDrawer
          toggleDrawer={openDrawer ? toggleDrawer : handleToggleDrawer}
          open={openDrawer ? openDrawer : openMenu}
          language={language}
          setLanguage={setLanguage}
        />
      </Box>
      <Box sx={{ marginTop: '10px' }}></Box>
    </>
  );
};

export default Header;
