'use client';

import * as React from 'react';

import {
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';

import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Drawer from '@mui/material/Drawer';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import { useTheme } from '@mui/material/styles';

interface DrawerProps {
  toggleDrawer: (open: boolean) => () => void;
  open: boolean;
}
const TemporaryDrawer: React.FC<DrawerProps> = ({ toggleDrawer, open }) => {
  const theme = useTheme<any>();

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box sx={{ padding: '16px 16px 12px 16px', width: '320px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ color: theme.palette.warning['A200'] }}>Menu</Box>
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
            <Box sx={{ flexBasis: '30%' }}>
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
                  <MenuItem>English</MenuItem>
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
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: theme.palette.primary.main,
                padding: '16px !important',
                marginTop: '15px',
              }}
              startIcon={<DashboardOutlinedIcon />}
            >
              Dashboard
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              borderRadius: '100px',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <Box>
              <LocalLibraryOutlinedIcon />
            </Box>
            <Box>My Teaching Centers</Box>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default TemporaryDrawer;
