'use client';

import * as React from 'react';

import { Button, FormControl, IconButton, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Drawer from '@mui/material/Drawer';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import config from '../../config.json';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface DrawerProps {
  toggleDrawer: (open: boolean) => () => void;
  open: boolean;
  language: string;
  setLanguage: (lang: string) => void;
}
const menuDrawer: React.FC<DrawerProps> = ({
  toggleDrawer,
  open,
  language,
  setLanguage,
}) => {
  const theme = useTheme<any>();
  const { t, i18n } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ padding: '16px 16px 12px 16px', width: '300px' }}>
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
            <Box>
              <IconButton onClick={toggleDrawer(false)}>
                <ClearIcon />
              </IconButton>
            </Box>
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
            {/* <Box sx={{ flexBasis: '30%' }}>
              <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  className="SelectLanguages fs-14 fw-500"
                  displayEmpty
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                  }}
                >
                  <MenuItem>English</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
            <Box sx={{ flexBasis: '30%' }}>
              <FormControl className="drawer-select" sx={{ width: '100%' }}>
                <Select
                  value={language}
                  onChange={handleChange}
                  displayEmpty
                  className="SelectLanguages fs-14 fw-500"
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
                  className="SelectLanguages"
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
              //   variant="outlined"
              className="fs-14 fw-600"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: theme.palette.primary.main,
                padding: '16px !important',
                marginTop: '15px',
                color: '#2E1500',
                '&:hover': {
                  background: '#FDBE16',
                },
              }}
              startIcon={<DashboardOutlinedIcon />}
            >
              {t('DASHBOARD.DASHBOARD')}
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              borderRadius: '100px',
              alignItems: 'center',
              marginTop: '12px',
              marginLeft: '12px',
            }}
          >
            <Box>
              <LocalLibraryOutlinedIcon />
            </Box>
            <Box
              sx={{
                color: theme.palette.warning.A200,
              }}
              className="fs-14 fw-500"
            >
              {t('DASHBOARD.MY_TEACHING_CENTERS')}
            </Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default menuDrawer;
