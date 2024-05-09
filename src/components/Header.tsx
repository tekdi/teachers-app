'use client';

import { Box, Stack } from '@mui/material';
import Menu, { MenuProps } from '@mui/material/Menu';
import React, { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import LogoWithoutTagline from '../../public/Logo_without_tagline.png';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
  const MenuDrawer = dynamic(() => import('./../pages/LeftDrawer'), {
    ssr: false,
  });

  const [selectedLanguage, setSelectedLanguage] = React.useState(
    localStorage.getItem('preferredLanguage') || 'en'
  );
  const [language, setLanguage] = React.useState(selectedLanguage);

  return (
    <>
      <Stack
        sx={{ minWidth: '100%' }}
        direction="row"
        justifyContent={'space-between'}
        alignItems={'center'}
        height="auto"
      >
        <Box onClick={toggleDrawer(true)} mt={'0.5rem'} paddingLeft={'1rem'}>
          <MenuIcon />
        </Box>
        <Box sx={{ margin: '0 auto' }}>
          <Image
            src={LogoWithoutTagline}
            alt="logo"
            onClick={() => router.push('/')}
            style={{ cursor: 'pointer' }}
          />
        </Box>
        <Box
          onClick={handleClick}
          sx={{ cursor: 'pointer', position: 'relative' }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : 'false'}
          paddingRight={'1rem'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
          mt={'0.5rem'}
        >
          <AccountCircleIcon fontSize="large" color="action" />
        </Box>
        <div>
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
      <Divider sx={{ borderBottomWidth: '0.15rem' }} />
      <MenuDrawer
        toggleDrawer={toggleDrawer}
        open={openDrawer}
        language={language}
        setLanguage={setLanguage}
      />
    </>
  );
};
export default Header;
