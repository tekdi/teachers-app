'use client';

import { Box, Stack } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import React, { useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import accountIcon from './../assets/images/account.svg';
import dynamic from 'next/dynamic';
import logoLight from '../../public/images/logo-light.png';
import menuIcon from '../assets/images/menuIcon.svg';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const Header: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const pathname = usePathname();
  const theme = useTheme<any>();

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(() => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light'
          ? 'rgb(55, 65, 81)'
          : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  const handleProfileClick = () => {
    if (pathname !== '/profile') {
      router.push('/profile');
    }
  };
  const handleLogoutClick = () => {
    router.replace('/logout');
  };
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };
  const MenuDrawer = dynamic(() => import('./MenuDrawer'), {
    ssr: false,
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedLanguage = localStorage.getItem('preferredLanguage');
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
      }
    }
  }, []);

  const [language, setLanguage] = React.useState(selectedLanguage);

  return (
    <Box sx={{ marginBottom: '4rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: '0px',
          zIndex: '999',
          width: '100%',
          bgcolor: ' #FFFFFF',
          maxWidth: '899px',
        }}
      >
        <Stack
          width={'100%'}
          // padding={'8px 0'}
          direction="row"
          justifyContent={'space-between'}
          alignItems={'center'}
          height="64px"
          boxShadow="0px 1px 3px 0px #0000004D"
        >
          <Box
            onClick={toggleDrawer(true)}
            mt={'0.5rem'}
            sx={{ cursor: 'pointer' }}
            paddingLeft={'20px'}
          >
            <Image
              height={12}
              width={18}
              src={menuIcon}
              alt="logo"
              style={{ cursor: 'pointer' }}
            />
          </Box>

          <Image
            height={40}
            width={44}
            src={logoLight}
            alt="logo"
            onClick={() => router.push('/dashboard')}
            style={{ cursor: 'pointer' }}
          />
          <Box
            onClick={handleClick}
            sx={{ cursor: 'pointer', position: 'relative' }}
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
            <Image
              height={20}
              width={20}
              src={accountIcon}
              alt="logo"
              style={{ cursor: 'pointer' }}
            />
            {/* <AccountCircleIcon
              fontSize="large"
              className="accIcon"
              style={{ fill: theme.palette.warning['A200'] }}
            /> */}
          </Box>
          <div style={{ position: 'absolute' }}>
            <StyledMenu
              id="profile-menu"
              MenuListProps={{
                'aria-labelledby': 'profile-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfileClick} disableRipple>
                <PersonOutlineOutlinedIcon />
                {t('PROFILE.MY_PROFILE')}{' '}
              </MenuItem>
              <MenuItem onClick={handleLogoutClick} disableRipple>
                <LogoutOutlinedIcon />
                {t('COMMON.LOGOUT')}
              </MenuItem>
            </StyledMenu>
          </div>
        </Stack>
      </Box>

      <MenuDrawer
        toggleDrawer={toggleDrawer}
        open={openDrawer}
        language={language}
        setLanguage={setLanguage}
      />
    </Box>
  );
};
export default Header;
